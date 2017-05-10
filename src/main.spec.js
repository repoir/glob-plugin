import fs from 'fs';
import { test } from './main.js';

jest.mock('fs');

describe('main', () => {
	const testConfig = {
		directories: [
			'src'
		],
		files: [
			'package.json',
			'.eslintrc',
			'.travis.yml'
		]
	};

	beforeEach(() => {
		fs.lstat.mockImplementation((path, callback) => {
			callback(null, {
				isDirectory: () => true,
				isFile: () => true
			});
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('test', () => {
		it('finds all files and directories', () => {
			return test(testConfig, {}).then((results) => {
				expect(results).toEqual([]);
			});
		});
		it('finds problems with missing files and directories', () => {
			fs.lstat.mockImplementation((path, callback) => {
				callback(null, {
					isDirectory: () => false,
					isFile: () => true
				});
			});

			return test(testConfig, {}).then((results) => {
				expect(results).toEqual([
					{
						message: `The directory with path \'${process.cwd()}/src\' cannot be found.`
					}
				]);
			});
		});
		it('finds all directories but no files supplied', () => {
			return test({
				directories: [
					'src'
				]
			}, {}).then((results) => {
				expect(results).toEqual([]);
			});
		});
		it('finds files but no directories supplied', () => {
			return test({
				files: [
					'package.json'
				]
			}, {}).then((results) => {
				expect(results).toEqual([]);
			});
		});
		it('fails to do fs.lstat', () => {
			fs.lstat.mockImplementation((path, callback) => {
				callback(new Error('File does not exist!'), null);
			});

			return test({
				files: [
					'package.json'
				],
				directories: [
					'src'
				]
			}, {}).then((results) => {
				expect(results).toEqual([
					{
						message: `The directory with path \'${process.cwd()}/src\' cannot be found.`
					},
					{
						message: `The file with path \'${process.cwd()}/package.json\' cannot be found.`
					}
				]);
			});
		});
	});
});
