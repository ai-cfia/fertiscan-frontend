const { findFilesRecursive, compileIgnorePattern, 
    parseFile, readFileContent, revertFile 
} = require('./fileOperations');  

const { analyzeCode, fixFile, 
} = require('./astTraversal.js');  


const { displayAnalysis,  
    displayHelp, displayFilesMenu,  
} = require('./displayInteraction.cjs');   

const {
    logError, errors
} = require('./errorHandling');

const path = require('path');  

const projectPath = require.main.path + '/../src';
const filePattern = /\.(ts|tsx)$/;  
const ignoreFilePath = require.main.path + '/structure-check.ignore';
const fs = require('fs');


/**  
 * Analyzes the structure of the entire project or specific files based on display level.  
 *  
 * @async  
 * @function analyzeProject  
 * @param {string} displayLevel - The level of detail for displaying the analysis. Possible values: 'basic', 'detailed', 'tree', 'interactive'.  
 * @returns {Promise<void>} A promise that resolves when the analysis process is complete.  
 * @throws Will log an error if there's an issue finding or processing the files.  
 */  
const analyzeProject = async (displayLevel, filePath) => {  
    try {  
        console.log('Searching for .ts and .tsx files in the project...');  
  
        const ignorePattern = await compileIgnorePattern(ignoreFilePath);  
        const files = filePath ? [filePath] : await findFilesRecursive(projectPath, filePattern, [], ignorePattern);  
        console.log(`Files found for structure analysis:`, files);  
  
        if (files.length === 0) {  
            console.log(`No matching files found with the pattern "${filePattern}".`);  
        } else {  
            if (displayLevel === 'detailed') {  
                await displayFilesMenu(files, displayLevel);  
            }else {  
                for (const filePath of files) {  
                    const content = readFileContent(filePath);  
                    const ast = parseFile(content);  
                    const sections = analyzeCode(ast, filePath);  
                    displayAnalysis(sections, displayLevel, errors);  
                }  
            }  
        }  
    } catch (err) {  
        console.error('Error during the search of the file:', err);  
    }  
};  
 




/**
* Fixes the structure of the entire project or a specific file if a file path is provided.
* If no file path is provided, it searches for .ts and .tsx files in the project directory and applies fixes.
*
* @async
* @function fixProjectStructure
* @param {string} [filePath] - The path of the file to fix. If not provided, the function will process all matching files in the project.
* @returns {Promise<void>} A promise that resolves when the project's structure has been fixed or an error occurs.
* @throws Will log an error if there's an issue finding or fixing the files.
*/
  
const fixProjectStructure = async (filePath) => {   
    try {     
        if (filePath) {    
            if (fs.existsSync(filePath)) {  
                await fixFile(filePath);    
            } else {  
                logError(null, `Specified file does not exist: ${filePath}`, filePath);  
                return;  // Exit the function if the file does not exist  
            }  
        } else {    
            const ignorePattern = await compileIgnorePattern(ignoreFilePath);    
            const files = await findFilesRecursive(projectPath, filePattern, [], ignorePattern);    
            if (files.length === 0) {    
                // If no files are found, log a message and exit  
                console.log(`Files found for structure analysis:`, files);  
            } else {   
                for (const filePath of files) {    
                    await fixFile(filePath);    
                }    
                console.log("Fixing of react project done");  
            }  
        }    
    } catch (err) {    
        logError(null, `Error during the searching of the file: ${err.message}`, filePath);  
    }   
}; 

///////////////////////////////
///////////////////////////////
/////////// Todo //////////////: Test this function because it as not been tested yet.
///////////////////////////////
///////////////////////////////

/**
* Reverts the project structure to its original state.
* If a file path is provided, it reverts only that particular file.
* Otherwise, it reverts all files found in the 'backup' directory.
*
* @async
* @function revertProjectStructure
* @param {string} [filePath] - The path of the file to revert. 
*                              If not provided, all files in the 'backup' 
*                              directory will be reverted.
* @returns {Promise<void>} A promise that resolves when the reversion 
*                          process is complete.
*/
const revertProjectStructure = async (filePath) => {    
    try {  
        if (filePath) {    
            if (fs.existsSync(filePath)) {  
                revertFile(filePath);    
            } else {  
                logError(null, `Specified file does not exist: ${filePath}`, filePath);  
                return;  // Exit the function if the file does not exist  
            }  
        } else {    
            const files = await findFilesRecursive('backup', filePattern);    
            for (const filePath of files) {    
                const originalFilePath = path.join(projectPath, path.relative('backup', filePath));    
                revertFile(originalFilePath);    
            }    
        }  
    } catch (err) {  
        logError(null, `Error during the reversion process: ${err.message}`, filePath);  
    }  
}; 

/**  
 * Parses and processes command line arguments for the script.  
 *   
 * @function parseCommandLineArguments  
 * @returns {Object} An object containing parsed command line options.  
 * @returns {boolean} return.fix - Indicates whether the --fix option was specified.  
 * @returns {boolean} return.revert - Indicates whether the --revert option was specified.  
 * @returns {boolean} return.analyze - Indicates whether the --analyze option was specified.  
 * @returns {boolean} return.help - Indicates whether the --help option was specified.  
 * @returns {string} return.filePath - The file path provided with the --file=<path> option, if specified.  
 * @returns {string} return.displayLevel - The display level set with the --display=<level> option. Defaults to 'basic'.  
 * @returns {string} return.language - The language set with the --langue=<lang> option. Defaults to 'en'.  
 */  
const parseCommandLineArguments = () => {  
    const args = process.argv.slice(2);  
    let filePath = '';  
    const fix = args.includes('--fix') || args.includes('-f');
    const revert = args.includes('--revert') || args.includes('-r');
    const analyze = args.includes('--analyze')||args.includes('-a');
    const help = args.includes('--help') || args.includes('-h');

    let displayLevel = 'basic';  // Default display level  
    let language = 'en';  // Default language  
  
    // Check for display and language options  
    args.forEach(arg => {  
        if (arg.startsWith('--file=') || arg.startsWith('-fi=')) {
            filePath = path.resolve(arg.replace(/-{1,2}fi(le)?=/, ''));
        } else if (arg.startsWith('--display=') || arg.startsWith('-d=')) {
            const level = arg.replace(/-{1,2}d(isplay)?=/, ''); // match either -d= or --display= ( could also match --d= or -display=)
            if (['basic', 'detailed', 'tree', 'interactive'].includes(level)) {  
                displayLevel = level;  
            }  
        } else if (arg.startsWith('--langue=') || arg.startsWith('-l=')) {
            const lang = arg.replace(/-{1,2}l(angue)?=/, ''); // match either -l= or --langue= ( could also match --l= or -langue=)
            if (['en', 'fr'].includes(lang)) {  
                language = lang;  
            }  
        }  
    });  

    // Ensure 'tree' display level is only allowed when filePath is provided  
    if (displayLevel === 'tree' && !filePath) {  
        console.error('The "tree" display level is only available when the -file option is provided.');  
        displayLevel = 'basic';  // Fallback to default display level  
    }  
  
    return { fix, revert, analyze, help, filePath, displayLevel, language };  
};  



  

const { fix, revert, analyze, help, filePath, displayLevel, language } = parseCommandLineArguments();  

if (help) {  
displayHelp(language);  
} else if (revert) {  
revertProjectStructure(filePath);  
} else if (fix) {  
fixProjectStructure(filePath);  
} else if (analyze) {  
analyzeProject(displayLevel, filePath);  
} else {  
console.log('No specific command provided. Use --help to see available options.');  
displayHelp(language);  
}   

// Export the necessary functions for use in structure-check-terminal.js  
module.exports = {  
analyzeProject,  
fixProjectStructure,  
revertProjectStructure,  
}; 