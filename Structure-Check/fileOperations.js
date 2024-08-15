const fs = require('fs');  
const path = require('path');  
const { readFileSync, writeFileSync, statSync } = fs;  
const { parse } = require('@babel/parser');  
const { readdir, stat } = fs.promises;  
const util = require('util');  
const readFile = util.promisify(fs.readFile);  
const projectPath = path.resolve(__dirname, '../src/');
const filePattern = /\.(ts|tsx)$/;  
const ignoreFilePath = 'structure-check.ignore';  



/**
 * Recursively searches for files in a given directory that match a specified pattern.
 * 
 * @async
 * @function findFilesRecursive
 * @param {string} dir - The starting directory path.
 * @param {RegExp} pattern - The file pattern to search for.
 * @returns {Promise<string[]>} A promise that resolves to an array of file paths matching the pattern.
 */
async function findFilesRecursive(dir, pattern, fileList = [], ignorePattern) {  
    const files = await readdir(dir);  
    
    for (const file of files) {  
      const fullPath = path.join(dir, file);  
      const fileStat = await stat(fullPath);  
    
      // Test the ignorePattern against the full path  
      if (ignorePattern && ignorePattern.test(fullPath)) {  
        continue; // Skip ignored files or directories  
      }  
    
      if (fileStat.isDirectory()) {  
        await findFilesRecursive(fullPath, pattern, fileList, ignorePattern); // Recurse into subdirectories  
      } else if (pattern.test(file)) {  
        fileList.push(fullPath); // Add to list if file matches the pattern  
      }  
    }  
    
    return fileList;  
  } 
  

///////////////
///////////////
///////////////: Refactor the following functions to not avoid comment.
///////////////  This will give use the ability to check for comment in
///////////////  the code and create better structure.
/// Todo //////
///////////////  Dont forget to modify the other function
///////////////         that reply on this one.
///////////////
///////////////

/**
 * Compiles a regex pattern from an ignore file to determine which files should be ignored.
 * Each line in the ignore file is treated as a pattern, empty lines and comments are ignored, 
 * and dots are escaped for regex purposes.
 *
 * @async
 * @function compileIgnorePattern
 * @param {string} ignoreFilePath - The path to the ignore file.
 * @returns {Promise<RegExp>} A promise that resolves to a compiled regular expression based on the ignore patterns.
 * @throws Will log an error if there's an issue reading the ignore file and return an empty regex pattern.
 */
const compileIgnorePattern = async (ignoreFilePath) => {  
    try {  
        const fileContent = await readFile(ignoreFilePath, 'utf-8');  
        const patterns = fileContent  
            .split('\n')  
            .filter(Boolean)  // Remove empty lines **Here***
            .filter(line => !line.startsWith('#'))  
            .map(pattern => pattern.trim())  
            .map(pattern => pattern.replace(/\./g, '\\.'))  // Escape dots for regex
            .join('|');  // Combine into a single regex pattern
        return new RegExp(patterns);  
    } catch (error) {  
        // consoleError
        console.error(`Error reading '${ignoreFilePath}': ${error.message}`);  
        return new RegExp('');  // Return an empty regex if error occurs
    }  
};  

/**
 * Parses a given file to extract relevant information.
 * 
 * This const reads the content of the specified file and processes it
 * to extract necessary data for further analysis.
 * 
 * @async
 * @function parseFile
 * @param {string} filePath - The path to the file to be parsed.
 * @returns {Promise<Object>} A promise that resolves to an object containing the parsed data.
 */
const parseFile = (content) => {  
    return parse(content, {  
        sourceType: 'module',  
        plugins: ['jsx', 'typescript', 'classProperties', 'decorators-legacy', 'dynamicImport'],  
        ranges: true,
    });  
};  
  
/**
 * Reads the content of a file synchronously.
 *
 * @function readFileContent
 * @param {string} filePath - The path of the file to read.
 * @returns {string} The content of the file.
 * @throws Will throw an error if the file cannot be read.
 */
const readFileContent = (filePath) => readFileSync(filePath, 'utf-8');  
  
/**
 * Writes content to a file synchronously.
 *
 * @function writeFileContent
 * @param {string} filePath - The path of the file to write.
 * @param {string} content - The content to write to the file.
 * @throws Will throw an error if the file cannot be written.
 */
const writeFileContent = (filePath, content) => writeFileSync(filePath, content, 'utf-8');  
  
/**
 * Creates a backup of a specified file.
 * The backup is stored in a 'backup' directory, maintaining the original directory structure.
 *
 * @function createBackup
 * @param {string} filePath - The path of the file to backup.
 * @throws Will log an error if there's an issue creating the backup directory or copying the file.
 */
const createBackup = (filePath) => {  
    const backupDir = 'backup';  
    const backupFilePath = path.join(backupDir, path.relative(projectPath, filePath));  
    const backupFileDir = path.dirname(backupFilePath);  
    fs.mkdirSync(backupFileDir, { recursive: true });  
    fs.copyFileSync(filePath, backupFilePath);  
    console.log(`Backup of ${filePath} created at ${backupFilePath}`);  
};  
  
////////////
////////////
////////////: Refactor the following functions to make 
////////////  sure that if a user create multiple backup
////////////  it dont create problem with file.
/// Todo ///
////////////  Dont forget to modify the other function
////////////         that reply on this one.
////////////
////////////

/**
 * Reverts a file to its original state using a backup.
 * Checks if a backup exists in the 'backup' directory and, if so, copies it to replace the original file.
 * If no backup is found, logs a message indicating the absence of a backup.
 *
 * @function revertFile
 * @param {string} filePath - The path of the file to revert.
 * @throws Will log an error if there's an issue accessing the backup or copying the file.
 */
const revertFile = (filePath) => {  
    const backupFilePath = path.join('backup', path.relative(projectPath, filePath));

    // Check if a backup exists  
    if (fs.existsSync(backupFilePath)) {  
        // Copy the backup file to the original location  
        fs.copyFileSync(backupFilePath, filePath);  
        console.log(`Reverted ${filePath} to its original state.`);  
    } else {  
        console.log(`No backup found for ${filePath}. Unable to revert.`);  
    }  
};  
  
module.exports = {  
    findFilesRecursive,  
    compileIgnorePattern,  
    parseFile,  
    readFileContent,  
    writeFileContent,  
    createBackup,  
    revertFile,  
};  
