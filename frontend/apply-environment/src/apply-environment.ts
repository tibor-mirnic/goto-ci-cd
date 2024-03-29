import { join } from 'path';
import { readdirSync, readFileSync, writeFileSync } from 'fs-extra';

import { ENVIRONMENT_VARIABLES } from './environment';
import { applyEnvironmentVariable } from './apply-environment-variable';

const jsRegex = /\.js$/;

const workingDirectory = process.argv[2] as string;
const processEnvironment = process.env;

console.log(`Working directory: ${workingDirectory}`);

try {
  const files = readdirSync(workingDirectory);
  /*
  * Iterate over files and folders in the passed directory path.
  * It is assumed that the contents of the directory is generated by some
  * build tool (webpack or vite) and that it will contain *.js files (single/chunks)
  */
  files.forEach((fileOrDirectoryName: string) => {
    // Apply only if a file has a 'js' extension
    if (jsRegex.test(fileOrDirectoryName)) {
      console.log(`Applying environment variables in ${fileOrDirectoryName}`);
      
      const fullFilePath = join(workingDirectory, fileOrDirectoryName);

      let jsFile = readFileSync(fullFilePath, 'utf8');

      // Iterate and replace placeholders for found variable values
      Object.keys(ENVIRONMENT_VARIABLES).forEach(a => {
        jsFile = applyEnvironmentVariable(processEnvironment, jsFile, ENVIRONMENT_VARIABLES[a] as string);
      });

      writeFileSync(fullFilePath, jsFile);
    }
  });
} catch (error) {
  console.log('Error with post build: ', error);
  process.exit(1);
}
