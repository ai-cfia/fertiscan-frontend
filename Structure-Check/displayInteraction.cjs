const prompts = require('prompts');  
const { createStateTracker } = require('./stateManagement');  
const { checkFile, analyzeCode } = require('./astTraversal');  
const { parseFile, readFileContent} = require('./fileOperations');
 
(async function() {
    const { render, Text, Box, useApp, useInput } = await import('ink');
    const SelectInput = await import('ink-select-input').then(mod => mod.default);

    // Your other functions and logic go here

    module.exports = {
        displayAnalysis,
        displayBasic,
        displayDetailedInteractive,
        displayTree,
        displayHelp,
        displayFilesMenu,
        displaySectionsMenu,
        loadInk: async () => ({ render, Text, Box, useApp, useInput, SelectInput }),
        displayHighlightedCode,
    };
})();  
const { logError, generateErrorMessage, 
    reportError, errors 
} = require('./errorHandling'); 

////////////////////////////
////////////////////////////
////////////////////////////  Make sure all display utilise the same menu function.
////////////////////////////  For this create a function menu that utilise the
///////// Todo /////////////: section map of the function 'displayDetailedInteractive' 
////////////////////////////  and the function 'displayHighlightedCode' to display the
////////////////////////////  selected section. Each type of display should display different information
////////////////////////////

/**
 * Displays analysis of sections based on the display level provided.
 * 
 * @async
 * @function displayAnalysis
 * @param {Object[]} sections - The sections to be analyzed and displayed.
 * @param {string} displayLevel - The level of detail for displaying the analysis. Possible values: 'basic', 'detailed', 'tree'.
 * @returns {Promise<void>} Returns a promise that resolves when the analysis has been successfully displayed.
 * @throws Will log an error to the console if an invalid display level is specified.
 */
const displayAnalysis = async (sections, displayLevel) => { 
    switch (displayLevel) {
        case 'basic':
            displayBasic(sections);  
            break;
        case 'detailed':
            await displayDetailedInteractive(sections);
            break;
        case 'tree':
            displayTree(sections);  
            break;
        default:
            console.error('Invalid display level specified.');  
            break;
    }  
}; 
  
////////////////////////////
////////////////////////////
////////// Todo ////////////: Modify the function to include error related to the code in a menu section.
////////////////////////////: Bug the error are displayed in a list 
////////////////////////////  Showing all information is bug
////////////////////////////

/**
 *  Displays a basic analysis report of various code sections to the console.
 *  This displays the number of imports, constants, contexts, hooks, helper 
 *  functions, components, main component, and exports in the code.
 *  It also displays any errors that were encountered during the
 *  analysis process in an error section.
 * 
 * @function displayBasic
 * @param {Object} sections - An object containing arrays that represent different parts of the code.
 * @param {Object[]} sections.imports - The array of import declarations.
 * @param {Object[]} sections.constants - The array of constants in the code.
 * @param {Object[]} sections.contexts - The array of context values used in the code.
 * @param {Object[]} sections.hooks - The array of React hooks used in the code.
 * @param {Object[]} sections.helperFunctions - The array of helper functions in the code.
 * @param {Object[]} sections.components - The array of React components in the code.
 * @param {Object} sections.mainComponent - The main component of the application.
 * @param {Object[]} sections.exports - The array of exports from the code.
 */
const displayBasic = (sections) => {    
    console.log('--- Basic Analysis ---');    
  
    console.log('Imports:', sections?.imports?.length ?? 0);    
    console.log('Constants:', sections?.constants?.length ?? 0);    
    console.log('Contexts:', sections?.contexts?.length ?? 0);    
    console.log('Hooks:', sections?.hooks?.length ?? 0);    
    console.log('Helper Functions:', sections?.helperFunctions?.length ?? 0);    
    console.log('Components:', sections?.components?.length ?? 0);    
    console.log('Main Component:', sections?.mainComponent ? 'Found' : 'Not Found');    
    console.log('Exports:', sections?.exports?.length ?? 0);    
    // Display errors    
    console.log('--- Errors ---');    
    errors.forEach(error => {    
        console.error(error.errorMessage);    
    });    
}; 
  
////////////////////////////
////////////////////////////
////////////////////////////: Modify the function to fix the error reporting problem.
////////// Todo ////////////  Error reporting are not working as expected and dont 
////////////////////////////  return code position / file and all related information.
////////////////////////////  
////////////////////////////

/**
 * Inteactively displays a detailed analysis of the various code sections.
 * Users can choose which file to analyse and which sections to highlight 
 * through a series of prompts.
 * 
 * This display should be used when a more detailed analysis of the code is required.
 * 
 * @async
 * @function displayDetailedInteractive
 * @param {Object} sections - An object containing properties that represent different parts of the code to be used in a detailed analysis.
 * @param {Object[]} [sections.imports] - An array of import declarations.
 * @param {Object[]} [sections.constants] - An array of constants in the code.
 * @param {Object[]} [sections.contexts] - An array of contexts used in the code.
 * @param {Object[]} [sections.hooks] - An array of React hooks used in the code.
 * @param {Object[]} [sections.helperFunctions] - An array of helper functions in the code.
 * @param {Object[]} [sections.components] - An array of React functional components in the code.
 * @param {Object[]} [sections.classComponents] - An array of React class components in the code.
 * @param {Object} [sections.mainComponent] - The main component of the application if present.
 * @param {Object[]} [sections.types] - An array of type declarations or class types in the code.
 * @param {Object[]} [sections.exports] - An array of exports from the code.
 * @param {Object[]} [sections.errors] - An array of errors encountered in the code analysis.
 * @returns {Promise<void>} A Promise that resolves after the interactive detailed analysis is completed or interrupted.
 * @throws {Error} Outputs an error to the console if an error occurs during the interactive prompts.
 */
const displayDetailedInteractive = async (sections) => {  
    console.log('--- Detailed Interactive Analysis ---');  

    // For menu choices
    const choices = [
        'Imports', 
        'Constants', 
        'Contexts', 
        'Hooks', 
        'Helper Functions', 
        'Components', 
        'Class Components', 
        'Main Component', 
        'Types', 
        'Exports', 
        'Errors'
    ];   
    
    const sectionMap = {  // This******
        'Imports': sections.imports,  
        'Constants': sections.constants,  
        'Contexts': sections.contexts,  
        'Hooks': sections.hooks,  
        'Helper Functions': sections.helperFunctions,  
        'Components': sections.components,  
        'Class Components': sections.classComponents,  
        'Main Component': sections.mainComponent ? [sections.mainComponent] : [],  
        'Types': sections.types,  
        'Exports': sections.exports,  
        'Errors': errors,  
    };  
  
    while (true) {  
        try {  
            const { selectedSection } = await prompts({  
                type: 'select',  
                name: 'selectedSection',  
                message: 'Select the section you want to highlight:',  
                choices: choices.map(choice => ({ title: choice, value: choice })),  
            });  
  
            // If no selected section, quit the menu.
            if (!selectedSection) break;  
  
            displayHighlightedCode(sectionMap[selectedSection]);  
            
            // If  selected section, continue by display the next menu.
            const { continueInteraction } = await prompts({  
                type: 'confirm',  
                name: 'continueInteraction',  
                message: 'Do you want to select another section?',  
                initial: true,  
            });  
  
            // If no selected section, quit the menu.
            if (!continueInteraction) break;  

        } catch (error) {  
            console.error('Error during prompts:', error);  
            break;  
        }  
    }  
};  
  
////////////////////////////
//////////////////////////// 
////////// Todo ////////////: Modify the error reporting to make sur it is 
////////////////////////////  all centralized to use only one function.
////////////////////////////  
////////////////////////////

/**
 * Outputs to the console highlighted code snippets for a given list of nodes.
 * Each node is printed with its type, location, name (if available), and code snippet.
 * Nodes that have errors are logged using console.error, and others using console.log.
 * 
 * @function displayHighlightedCode
 * @param {Object[]} nodes - An array of node objects to display.
 * @param {string} nodes[].type - The type of the node.
 * @param {Object} [nodes[].loc] - The source location information for the node.
 * @param {number} [nodes[].loc.start.line] - The starting line number of the node.
 * @param {number} [nodes[].loc.start.column] - The starting column number of the node.
 * @param {string} [nodes[].code] - The code snippet related to the node.
 * @param {string} [nodes[].name] - The name of the node, if applicable.
 * @param {boolean} [nodes[].hasError] - Indicates whether the node has an associated error.
 */
const displayHighlightedCode = (nodes) => {  
    nodes.forEach(node => {  
        const location = node.loc && node.loc.start ? `Line ${node.loc.start.line}, Column ${node.loc.start.column}` : 'Location information not available';  
        const codeSnippet = node.code || 'Code not available';
        const output = `\n
#### Node Type: ${node.type}\n
- **Location:** ${location}${node.name ? 
`- **Name:** ${node.name}` : ''}
- **Code:**\n\`\`\`javascript
${codeSnippet}\n\`\`\``;
        
        // Check for error messages  ********Here********
        if (node.hasError) {  
            console.error(output);  
        } else {  
            console.log(output);  
        }  
    });  
};  

////////////////////////////
//////////////////////////// 
////////// Todo ////////////: Modify the error reporting to make sur it is 
////////////////////////////  all centralized to use only one function.
////////////////////////////  
////////////////////////////

/**
 * Displays a tree analysis of various code sections together with any errors.
 * The information is formatted for command line interface output.
 * 
 * @function displayTree
 * @param {Object} sections - An object containing properties that represent different parts of the code to be analyzed in tree format.
 * @param {Object[]} sections.nodes - An array of node objects representing different code elements.
 * @param {string} sections.nodes[].type - The type of the node.
 * @param {Object} sections.nodes[].loc - The location information for the node.
 * @param {number} sections.nodes[].loc.start.line - The starting line number of the node.
 * @param {number} sections.nodes[].loc.start.column - The starting column number of the node.
 * @param {string} [sections.nodes[].name] - The name of the node, if applicable.
 * @param {Object[]} sections.errors - An array of error objects encountered during analysis.
 * @param {string} sections.errors[].type - The type of error.
 * @param {string} sections.errors[].location - The location of the error.
 * @param {string} sections.errors[].message - The error message.
 * @param {Object} [sections.errors[].node] - The node associated with the error.
 * @param {Object} [sections.errors[].extraInfo] - Additional information regarding the error.
 * @param {string} [sections.errors[].extraInfo.suggestions] - Suggestions for fixing the error.
 * @param {string} [sections.errors[].extraInfo.fix] - Suggested fix for the error.
 */
function displayTree(sections) {  
    console.log('--- Tree Analysis ---');  

    const ui = require('cliui')({ width: 80 });  // Not sure what this library is for.

    // Display the tree structure of the code
    sections.nodes.forEach(node => {  
      ui.div({  
        text: `Node Type: ${node.type}\nLocation: Line ${node.loc.start.line}, Column ${node.loc.start.column}\n${node.name ? `Name: ${node.name}` : ''}`,  
        padding: [1, 0, 1, 0]  
      });  
    });  

    console.log(ui.toString());  
    
    // Check for error messages  ********Here********
    console.log('--- Errors ---');  
    errors.forEach(error => {  
      const errorMessage = [  
        `[${error.type || 'Error'}] - Error in ${error.location}:`,  
        `Message: ${error.message}`,  
        `Node Type: ${error.type || error.node.type || 'Unknown'}`,  
        error.extraInfo.suggestions ? `Suggestions: ${error.extraInfo.suggestions}` : '',  
        error.extraInfo.fix ? `Suggested Fix: ${error.extraInfo.fix}` : ''  
      ].filter(Boolean).join('\n');  
      console.error(errorMessage);  
    });  
}  

/**
 * Displays help information for using the script, in either English or French, 
 * based on the provided language parameter.
 * 
 * @function displayHelp
 * @param {string} language - The language in which to display the help information. 
 *                            Supported options are 'en' for English and 'fr' for French.
 */
function displayHelp(language) {  
    if (language === 'fr') {  
      console.log(`  
        Usage: node script.js [options]  
            
        Options:  
            --fix                  Corrige la structure de tous les fichiers .ts et .tsx dans le projet.  
            --fix --file=<path>    Corrige la structure du fichier spécifié.  
            --revert               Réinitialise la structure des fichiers corrigés à partir des sauvegardes.  
            --revert --file=<path> Réinitialise la structure du fichier spécifié à partir de la sauvegarde.  
            --analyze              Analyse la structure des fichiers .ts et .tsx dans le projet.  
            --analyze --file=<path> Analyse la structure du fichier spécifié.  
            --display=<level>      Définit le niveau d'affichage pour l'analyse. Options disponibles: basic, detailed, tree, interactive.  
            --langue=<lang>        Définit la langue d'affichage de l'aide. Options disponibles: en, fr.  
            --help                 Affiche l'aide pour les commandes disponibles.  
            
        Examples:  
            node script.js --fix  
            node script.js --fix --file=src/components/App.tsx  
            node script.js --revert  
            node script.js --revert --file=src/components/App.tsx  
            node script.js --analyze  
            node script.js --analyze --file=src/components/App.tsx --display=tree  
            node script.js --analyze --file=src/components/App.tsx --display=interactive  
            node script.js --help  
      `)  
    } else {  
      console.log(`  
        Usage: node script.js [options]  
            
        Options:  
            --fix                  Fix the structure of all .ts and .tsx files in the project.  
            --fix --file=<path>    Fix the structure of the specified file.  
            --revert               Revert the structure of fixed files from backups.  
            --revert --file=<path> Revert the structure of the specified file from backup.  
            --analyze              Analyze the structure of .ts and .tsx files in the project.  
            --analyze --file=<path> Analyze the structure of the specified file.  
            --display=<level>      Set the display level for analysis. Available options: basic, detailed, tree, interactive.  
            --langue=<lang>        Set the language for help display. Available options: en, fr.  
            --help                 Display help for available commands.  
            
        Examples:  
            node script.js --fix  
            node script.js --fix --file=src/components/App.tsx  
            node script.js --revert  
            node script.js --revert --file=src/components/App.tsx  
            node script.js --analyze  
            node script.js --analyze --file=src/components/App.tsx --display=tree  
            node script.js --analyze --file=src/components/App.tsx --display=interactive  
            node script.js --help  
    `);  
    }  
} 

/**  
 * Displays a menu for selecting files to analyze.  
 * Provides options based on the available files and allows the user to interactively select files for analysis.  
 *  
 * @async  
 * @function displayFilesMenu  
 * @param {string[]} files - An array of file paths to display in the menu.  
 * @param {string} displayLevel - The level of detail for displaying the sections.  
 * @returns {Promise<void>} A promise that resolves when the menu interaction is complete.  
 */    
const displayFilesMenu = async (files) => {  
    const fileChoices = files.map(filePath => ({ title: "src"+filePath.split("src")[1], value: filePath }));
    let continueInteraction = true;  
  
    while (continueInteraction) {  
        try {  
            const { selectedFile } = await prompts({  
                type: 'select',  
                name: 'selectedFile',  
                message: 'Select the file you want to analyze:',  
                choices: fileChoices,  
            });  
  
            if (!selectedFile) break;  
  
            const content = readFileContent(selectedFile);  
            const ast = parseFile(content);  
            const sections = analyzeCode(ast, selectedFile);  
  
            // Display section menu after analyzing the file  
            await displaySectionsMenu(sections, selectedFile);  
  
            const result = await prompts({  
                type: 'confirm',  
                name: 'continueInteraction',  
                message: 'Do you want to select another file?',  
                initial: true,  
            });  
  
            continueInteraction = result.continueInteraction;  
        } catch (error) {  
            console.error('Error during prompts:', error);  
            break;  
        }  
    }  
};  
  
module.exports = displayFilesMenu;  
 
  
////////////////////////////
//////////////////////////// 
////////// Todo ////////////: Make sure that all type are in the menu.
////////////////////////////  
////////////////////////////

/**  
 * Displays a menu for selecting sections of code to highlight.  
 * Provides options based on the available sections and allows the user to interactively select and highlight sections.  
 *  
 * @async  
 * @function displaySectionsMenu  
 * @param {Object} sections - An object containing arrays of different code sections.  
 * @param {Array} sections.imports - An array of import statements.  
 * @param {Map} [sections.localConstants=new Map()] - A map of local constants within function bodies.  
 * @param {Array} sections.constants - An array of constant declarations.  
 * @param {Array} sections.contexts - An array of context declarations.  
 * @param {Array} sections.hooks - An array of hook declarations.  
 * @param {Array} sections.helperFunctions - An array of helper functions.  
 * @param {Array} sections.functions - An array of other functions.  
 * @param {Array} sections.components - An array of component declarations.  
 * @param {Array} sections.classComponents - An array of class component declarations.  
 * @param {Object} sections.mainComponent - The main component.  
 * @param {Object} sections.types - An object containing different types, e.g., Enums.  
 * @param {Array} sections.types.Enums - An array of enum declarations.  
 * @param {Array} sections.exports - An array of export statements.  
 * @param {Array} sections.errors - An array of errors encountered during analysis.  
 * @param {string} displayLevel - The level of detail for displaying the sections.  
 * @param {string} filePath - The path of the file being processed.  
 * @returns {Promise<void>} A promise that resolves when the menu interaction is complete.  
 */    
const displaySectionsMenu = async (sections, filePath) => {  
    const choices = [];  
  
    if (sections.imports && sections.imports.length > 0) choices.push(`(${sections.imports.length}) Imports`);  
    if (sections.localConstants && sections.localConstants.size > 0) choices.push(`(${sections.localConstants.size}) Local Constants`);  
    if (sections.constants && sections.constants.length > 0) choices.push(`(${sections.constants.length}) Constants`);  
    if (sections.contexts && sections.contexts.length > 0) choices.push(`(${sections.contexts.length}) Contexts`);  
    if (sections.hooks && sections.hooks.length > 0) choices.push(`(${sections.hooks.length}) Hooks`);  
    if (sections.helperFunctions && sections.helperFunctions.length > 0) choices.push(`(${sections.helperFunctions.length}) Helper Functions`);  
    if (sections.functions && sections.functions.length > 0) choices.push(`(${sections.functions.length}) Functions`);  
    if (sections.components && sections.components.length > 0) choices.push(`(${sections.components.length}) Components`);  
    if (sections.classComponents && sections.classComponents.length > 0) choices.push(`(${sections.classComponents.length}) Class Components`);  
    if (sections.mainComponent) choices.push('(1) Main Component');  
    if (sections.types.TSInterfaceDeclaration.length > 0) choices.push(`(${sections.types.TSInterfaceDeclaration.length}) TS Interface Declarations`);  
    if (sections.types.TSTypeAliasDeclaration.length > 0) choices.push(`(${sections.types.TSTypeAliasDeclaration.length}) TS Type Alias Declarations`);  
    if (sections.types.TSEnumDeclaration.length > 0) choices.push(`(${sections.types.TSEnumDeclaration.length}) TS Enum Declarations`);  
    if (sections.exports && sections.exports.length > 0) choices.push(`(${sections.exports.length}) Exports`);  
    if (errors.length > 0) choices.push(`(${errors.length}) Errors`);  
  
    const sectionMap = {  
        'Imports': sections.imports || [],  
        'Local Constants': Array.from(sections.localConstants?.values() ?? []),  
        'Constants': sections.constants || [],  
        'Contexts': sections.contexts || [],  
        'Hooks': sections.hooks || [],  
        'Helper Functions': sections.helperFunctions || [],  
        'Functions': sections.functions || [],  
        'Components': sections.components || [],  
        'Class Components': sections.classComponents || [],  
        'Main Component': sections.mainComponent ? [sections.mainComponent] : [],  
        'TS Interface Declarations': sections.types?.TSInterfaceDeclaration || [],  
        'TS Type Alias Declarations': sections.types?.TSTypeAliasDeclaration || [],  
        'TS Enum Declarations': sections.types?.TSEnumDeclaration || [],  
        'Exports': sections.exports || [],  
        'Errors': errors || [],  
    };  
  
    while (true) {  
        try {  
            const { selectedSection } = await prompts({  
                type: 'select',  
                name: 'selectedSection',  
                message: 'Select the section you want to highlight:',  
                choices: choices.map(choice => ({ title: choice, value: choice })),  
            });  
  
            if (!selectedSection) break;  
  
            // Remove count from selectedSection to match the sectionMap keys  
            const cleanedSectionName = selectedSection.replace(/^\(\d+\) /, '');  
  
            displayHighlightedCode(sectionMap[cleanedSectionName]);  
  
            const { continueInteraction } = await prompts({  
                type: 'confirm',  
                name: 'continueInteraction',  
                message: 'Do you want to select another section?',  
                initial: true,  
            });  
  
            if (!continueInteraction) break;  
        } catch (error) {  
            console.error('Error during prompts:', error);  
            break;  
        }  
    }  
};  

// Todo : check the relevance of this function not sure if it used as now.
async function loadInk() {    
    const { render, Text, Box, useApp, useInput } = await import('ink');    
    const SelectInput = await import('ink-select-input').then(mod => mod.default); // Use dynamic import for ink-select-input  
    return { render, Text, Box, useApp, useInput, SelectInput };    
  } 
  
  module.exports = {  
    displayAnalysis,  
    displayBasic,  
    displayDetailedInteractive,  
    displayTree,
    displayHelp,
    displayFilesMenu,
    displaySectionsMenu,
    loadInk,
    displayHighlightedCode,  
};  
