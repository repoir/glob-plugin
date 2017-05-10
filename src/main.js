// @flow

import fs from 'fs';
import path from 'path';

type program = {
	config: string
};

type schemaType = {
	type: string,
	properties: {
		directories: {
			type: string,
			items: {
				type: string
			}
		}
	}
};

export const schema: schemaType = {
	type: 'object',
	properties: {
		directories: {
			type: 'array',
			items: {
				type: 'string'
			}
		},
		files: {
			type: 'array',
			items: {
				type: 'string'
			}
		}
	}
};

type ruleConfigType = {
	directories: Array<string>,
	files: Array<string>
};

type resultType = Array<{
	message: string
}>;

export function test (ruleConfig: ruleConfigType, program: program): Promise<resultType> {
	let results: resultType = [];
	const directoryPromise = checkDirectories(ruleConfig.directories || []);
	const filePromise = checkFiles(ruleConfig.files || []);

	return Promise.all([directoryPromise, filePromise]).then((resultList) => {
		resultList.forEach((res) => {
			results = results.concat(res);
		});

		return results;
	});
}

function checkDirectories (directoryList: Array<string>): Promise<resultType> {
	return fsStat(directoryList, 'directory');
}

function checkFiles (fileList: Array<string>): Promise<resultType> {
	return fsStat(fileList, 'file');
}

function fsStat (pathList: Array<string>, type: string): Promise<resultType> {
	const problems: resultType = [];

	return Promise.all(pathList.map((relPath) => {
		return new Promise((resolve, reject) => {
			const fullPath = path.resolve(process.cwd(), relPath);

			fs.lstat(fullPath, (err, stats) => {
				let exists = false;

				if (!err) {
					switch (type) {
						case 'file':
							exists = stats.isFile();
							break;
						case 'directory':
							exists = stats.isDirectory();
					}
				}

				if (!exists) {
					problems.push({
						message: `The ${type} with path '${fullPath}' cannot be found.`
					});
				}

				resolve();
			});
		});
	})).then(() => {
		return problems;
	});
}
