File Structure Repoir Plugin
============================

The files structure plugin works with Repoir to enforce the configured file structure. You give it necessary files and directories and it checks for their existence. For instance, you can enforce the existence of a `package.json`, `.eslintrc`, and `src` directory with the following configuration.

```json
{
    "plugins": [
        "file-structure"
    ],
    "rules": {
        "file-structure": {
            "directories": [
                "src"
            ],
            "files": [
                "package.json",
                ".eslintrc"
            ]
        }
    }
}
```
