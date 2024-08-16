const { findFilesRecursive, compileIgnorePattern, 
        parseFile, readFileContent, writeFileContent, 
        createBackup, revertFile 
    } = require('./fileOperations');  

const { checkFile, setupTraverse, analyzeCode, 
        reorderCode, createNewAST, fixFile, hasDisableCheckComment 
    } = require('./astTraversal.js');  

const { createStateTracker } = require('./stateManagement'); 

const { displayBasic, displayTree, displayAnalysis,  
        displayDetailedInteractive, displayHighlightedCode,  
        displayHelp, displayFilesMenu, displaySectionsMenu,  
    } = require('./displayInteraction.cjs');   

const path = require('path');  
  
const projectPath = require.main.path+'\\..\\src';
const filePattern = /\.(ts|tsx)$/;  
const ignoreFilePath = require.main.path+'\\structure-check.ignore';

  
/**  
 * Analyzes the structure of the entire project or specific files based on display level.  
 *  
 * @async  
 * @function analyzeProject  
 * @param {string} displayLevel - The level of detail for displaying the analysis. Possible values: 'basic', 'detailed', 'tree', 'interactive'.  
 * @returns {Promise<void>} A promise that resolves when the analysis process is complete.  
 * @throws Will log an error if there's an issue finding or processing the files.  
 */  
const analyzeProject = async (displayLevel) => {  
    try {    
        console.log('Searching for .ts and .tsx files in the project...');  
  
        const ignorePattern = await compileIgnorePattern(ignoreFilePath);  
        const files = await findFilesRecursive(projectPath, filePattern, [], ignorePattern);  
        console.log(`Files found for structure analysis:`, files);  
  
        if (files.length === 0) {  
            console.log(`No matching files found with the pattern "${filePattern}".`);  
        } else {  
            console.log(`Files found for structure analysis:`, files);  
  
            // If the display level is detailed or interactive, show the file menu  
            if (displayLevel === 'detailed' || displayLevel === 'interactive') {  
                await displayFilesMenu(files, displayLevel);  
            } else {  
                for (const filePath of files) {  
                    const content = readFileContent(filePath);  
                    const ast = parseFile(content);  
                    const state = createStateTracker();  
                    checkFile(filePath, state);  
                    displayAnalysis(state, displayLevel);  
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
            await fixFile(filePath);  
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
        console.error('Error during the searching of the file', err);  
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
    if (filePath) {  
        revertFile(filePath);  
    } else {  
        const files = await findFilesRecursive('backup', filePattern);  
        for (const filePath of files) {  
            const originalFilePath = path.join(projectPath, path.relative('backup', filePath));  
            revertFile(originalFilePath);  
        }  
    }  
}; 
  
//////////////////////////
//////////////////////////
//////////////////////////: For now the detailed and interactive display are pretty mutch the same.
///////// Todo ///////////  I will need to add more details to the detailed display.
//////////////////////////  Or remove the interactive display and only put detailed.
//////////////////////////
//////////////////////////  

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
    const fix = args.includes('-fix') || args.includes('--f');  
    const revert = args.includes('-revert') || args.includes('-r');  
    const analyze = args.includes('-analyze')||args.includes('-a');  
    const help = args.includes('-help') || args.includes('-h');  

    let displayLevel = 'basic';  // Default display level  
    let language = 'en';  // Default language  
  
    // Check for display and language options  
    args.forEach(arg => {  
        if (arg.startsWith('-file=') || arg.startsWith('-fi=')) {  
            filePath = path.resolve(arg.replace('-file=', ''));  
        } else if (arg.startsWith('-display=') || arg.startsWith('-d=')) {  
            const level = arg.replace('-display=', '');  
            if (['basic', 'detailed', 'tree', 'interactive'].includes(level)) {  
                displayLevel = level;  
            }  
        } else if (arg.startsWith('-langue=') || arg.startsWith('-l=')) {  
            const lang = arg.replace('-langue=', '');  
            if (['en', 'fr'].includes(lang)) {  
                language = lang;  
            }  
        }  
    });  
  
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
    analyzeProject(displayLevel);  
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
