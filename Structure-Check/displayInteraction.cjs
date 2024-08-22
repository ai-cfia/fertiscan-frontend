const prompts = require('prompts');
const { analyzeCode } = require('./astTraversal');
const { parseFile, readFileContent } = require('./fileOperations');
const path = require('path');

const {
    logError, generateErrorMessage,
    reportError, errors
} = require('./errorHandling');
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    fgRed: "\x1b[31m",
    fgGreen: "\x1b[32m",
    fgYellow: "\x1b[33m",
    fgBlue: "\x1b[34m",
    fgMagenta: "\x1b[35m",
    fgCyan: "\x1b[36m",
    fgWhite: "\x1b[37m"
};

// Get the base name of the file (without directory path)
const getShortenedFileName = (filePath) => {
    return path.basename(filePath, path.extname(filePath));
};

const displayFilePaths = (filePath) => {
    const shortenedName = getShortenedFileName(filePath);
    const fileLink = `file://${path.resolve(filePath)}`;
    console.log(`Name: ${shortenedName} | Link: ${fileLink}`);
};

/**
 * Centralized error handling function
 * @param {Object[]} errorArray - Array of error objects
 */
const handleErrors = (errorArray) => {
    if (!errorArray || errorArray.length === 0) {
        console.log('No errors found.');
        return;
    }
    
    console.log('--- Errors ---');
    errorArray.forEach(error => {
        console.error(error.errorMessage, 'at', error.location ?? 'unknown location');
    });
}; 

/**
 * Displays analysis of sections based on the display level provided.
 * @async
 * @function displayAnalysis
 * @param {Object[]} sections - The sections to be analyzed and displayed.
 * @param {string} displayLevel - The level of detail for displaying the analysis. Possible values: 'basic', 'detailed', 'tree'.
 * @returns {Promise<void>} Returns a promise that resolves when the analysis has been successfully displayed.
 * @throws Will log an error to the console if an invalid display level is specified.
 */
const displayAnalysis = async (sections, displayLevel, errors) => {
    console.log(`displayAnalysis called with displayLevel: ${displayLevel}`); // Debugging log

        switch (displayLevel) {
            case 'basic':
                displayBasic(sections, errors);
                break;
            case 'detailed':
                await displayDetailedInteractive(sections, errors);
                break;
            case 'tree':
                displayTree(sections); // Assurez-vous que displayTree appelle handleErrors comme prévu
                break;
            case 'error':
                await displayErrorAnalysis(sections);
                break;
            default:
                console.error('Invalid display level specified.');
                break;
        }
};

/**
 *  Displays a basic analysis report of various code sections to the console.
 *  This displays the number of imports, constants, contexts, hooks, helper 
 *  functions, components, main component, and exports in the code.
 *  It also displays any errors that were encountered during the
 *  analysis process in an error section.
 * @function displayBasic
 * @param {Object} sections - An object containing arrays that represent different parts of the code.
 */
const displayBasic = (sections, errors) => {  
    console.log('--- Basic Analysis ---');  
  
    console.log('Imports:', sections.imports ? sections.imports.length : 0);  
    console.log('Local Constants:', sections.localConstants ? Array.from(sections.localConstants.values()).flat().length : 0);  
    console.log('Global Constants:', sections.constants ? sections.constants.length : 0);  
    console.log('Contexts:', sections.contexts ? sections.contexts.length : 0);  
    console.log('Hooks:', sections.hooks ? sections.hooks.length : 0);  
    console.log('State Hooks:', sections.stateHooks ? sections.stateHooks.length : 0);
    console.log('Effect Hooks:', sections.effectHooks ? sections.effectHooks.length : 0);
    console.log('Handlers:', sections.handlers ? sections.handlers.length : 0);
    console.log('Arrow Functions:', sections.arrowFunctions ? sections.arrowFunctions.length : 0);
    console.log('Helper Functions:', sections.helperFunctions ? sections.helperFunctions.length : 0);  
    console.log('Functions:', sections.functions ? sections.functions.length : 0);  
    console.log('Components:', sections.components ? sections.components.length : 0);  
    console.log('Class Components:', sections.classComponents ? sections.classComponents.length : 0);  
    console.log('Class Methods:', sections.classMethod ? sections.classMethod.length : 0);
    console.log('Class Properties:', sections.classProperty ? sections.classProperty.length : 0);
    console.log('Return Statements:', sections.returns ? sections.returns.length : 0);
    console.log('Styled Components:', sections.styledComponent ? sections.styledComponent.length : 0);
    console.log('Functional Components:', sections.functionalComponent ? sections.functionalComponent.length : 0);
    console.log(`Main Component: ${sections.mainComponent ? `${colors.fgGreen}Found${colors.reset}` : `${colors.fgRed}Not Found${colors.reset}`}`);    console.log('TS Interface Declarations:', sections.types?.TSInterfaceDeclaration ? sections.types.TSInterfaceDeclaration.length : 0);  
    console.log('TS Type Alias Declarations:', sections.types?.TSTypeAliasDeclaration ? sections.types.TSTypeAliasDeclaration.length : 0);  
    console.log('TS Enum Declarations:', sections.types?.TSEnumDeclaration ? sections.types.TSEnumDeclaration.length : 0);  
    console.log('Exports:', sections.exports ? sections.exports.length : 0);  
    console.log('Nodes:', sections.nodes ? sections.nodes.length : 0);
  
    handleErrors(errors);  
};



/**
 * Inteactively displays a detailed analysis of the various code sections.
 * Users can choose which file to analyse and which sections to highlight 
 * through a series of prompts.
 * This display should be used when a more detailed analysis of the code is required.
 * @async
 * @function displayDetailedInteractive
 * @param {Object} sections - An object containing properties that represent different parts of the code to be used in a detailed analysis.
 * @returns {Promise<void>} A Promise that resolves after the interactive detailed analysis is completed or interrupted.
 */
const displayDetailedInteractive = async (sections, errors) => {
    console.log('--- Detailed Interactive Analysis ---');

    const choices = [
        'Imports',
        'Constants',
        'Contexts',
        'Hooks',
        'Helper Functions',
        'Components',
        'Class Components',
        'Main Component',
        'TS Interface Declarations',
        'TS Type Alias Declarations',
        'TS Enum Declarations',
        'Exports',
        'Errors'
    ];

    const sectionMap = {
        'Imports': sections.imports,
        'Constants': sections.constants,
        'Contexts': sections.contexts,
        'Hooks': sections.hooks,
        'Helper Functions': sections.helperFunctions,
        'Components': sections.components,
        'Class Components': sections.classComponents,
        'Main Component': sections.mainComponent ? [sections.mainComponent] : [],
        'TS Interface Declarations': sections.types?.TSInterfaceDeclaration || [],
        'TS Type Alias Declarations': sections.types?.TSTypeAliasDeclaration || [],
        'TS Enum Declarations': sections.types?.TSEnumDeclaration || [],
        'Exports': sections.exports,
        'Errors': errors,
    };

    let continueInteraction = true;

    while (continueInteraction) {
        try {
            const { selectedSection } = await prompts({
                type: 'select',
                name: 'selectedSection',
                message: 'Select the section you want to highlight:',
                choices: choices.map(choice => ({ title: choice, value: choice })),
            });

            if (!selectedSection) break;

            console.log(`Selected section: ${selectedSection}`);
            console.log(`Section content:`, sectionMap[selectedSection]);

            if (!(sectionMap[selectedSection] && sectionMap[selectedSection].length > 0)) {
                console.log(`No ${selectedSection.toLowerCase()} found.`);
            } else {
                displayHighlightedCode(sectionMap[selectedSection]);
            }

            const result = await prompts({
                type: 'confirm',
                name: 'continueInteraction',
                message: 'Do you want to select another section?',
                initial: true,
            });

            continueInteraction = result.continueInteraction;
            console.log(`Continue interaction: ${continueInteraction}`); // Debugging log

        } catch (error) {
            console.error('Error during prompts:', error);
            break;
        }
    }
};


/**
 * Outputs to the console highlighted code snippets for a given list of nodes.
 * Each node is printed with its type, location, name (if available), and code snippet.
 * Nodes that have errors are logged using console.error, and others using console.log.
 * @function displayHighlightedCode
 * @param {Object[]} nodes - An array of node objects to display.
 */
const displayHighlightedCode = (nodes) => {
    nodes.forEach(node => {
        const location = node.loc && node.loc.start ? `Line ${node.loc.start.line}, Column ${node.loc.start.column}` : 'Location information not available';
        const codeSnippet = node.code || 'Code not available';

        const output = `
#### Node Type: ${node.type}
- **Location:** ${location}${node.name ? `- **Name:** ${node.name}` : ''}
- **Code:**
\`\`\`javascript
${codeSnippet}
\`\`\``;

console.log(output);

        // Check for error messages
        if (node.hasError) {
            handleErrors(errors)
        }
    });
};


// Todo : Rework the tree display to not show error and also to display the component in form of a tree 
// component
//      element in component
// other component

/**
 * Displays a tree analysis of various code sections together with any errors.
 * The information is formatted for command line interface output.
 * @function displayTree
 * @param {Object} sections - An object containing properties that represent different parts of the code to be analyzed in tree format.
 */
function displayTree(sections) {  
    console.log('--- Tree Analysis ---');  
  
    // Check if sections.nodes is defined and is an array  
    if (!Array.isArray(sections.nodes)) {  
        console.error("Invalid sections data. Expected 'nodes' to be an array.");  
        return;  
    }  
  
    const ui = require('cliui')({ width: 80 });  
  
    // Display the tree structure of the code  
    sections.nodes.forEach(node => {  
        if (node) {  
            ui.div({  
                text: `Node Type: ${node.type}\nLocation: Line ${node.loc.start.line}, Column ${node.loc.start.column}\n${node.name ? `Name: ${node.name}` : ''}`,  
                padding: [1, 0, 1, 0]  
            });  
        }  
    });  
  
    console.log(ui.toString());  
  
    handleErrors(errors);  
}  


/**    
 * Displays a detailed error analysis report with clickable links.    
 * Each error is displayed with a clickable link that opens the file at the specific location of the error.    
 * @async    
 * @function displayErrorAnalysis    
 * @param {Object[]} sections - The sections to be analyzed and displayed.    
 * @returns {Promise<void>} Returns a promise that resolves when the error analysis has been successfully displayed.    
 */
const displayErrorAnalysis = async (sections) => {
    console.log(`\n${colors.fgCyan}----------------------${colors.reset}`);
    console.log(`\n${colors.fgCyan}--- Error Analysis ---${colors.reset}`);
    console.log(`\n${colors.fgCyan}----------------------${colors.reset}`);

    const errorSections = errors.map((error, index) => {
        const errorFilePath = getShortenedFileName(error.filePath);
        const errorLocation = error.node && error.node.loc
            ? `${error.node.loc.start.line}:${error.node.loc.start.column}`
            : 'unknown location';

        const errorLink = `file://${path.resolve(errorFilePath)}:${errorLocation}`;

        return {
            value: errorLink,
            description: `File: ${errorFilePath}`,
            location: `Location: ${errorLocation}`,
        };
    });

    // If no errors, inform the user and exit
    if (errorSections.length === 0) {
        console.log(`${colors.fgGreen}No errors found.${colors.reset}`);
        return;
    }

    console.log(`${colors.fgBlue}Number of errors: ${errorSections.length}${colors.reset}`);

    errorSections.forEach((error, index) => {
        console.log(`${colors.fgYellow}${index + 1}.${colors.reset}`);
        console.log(`   ${error.description}`);
        console.log(`   ${error.location}`);
        console.log(`   ${error.value}\n`);
    });

    console.log(`${colors.fgCyan}End of error analysis.${colors.reset}`);
};

/**
 * Displays help information for using the script, in either English or French, 
 * based on the provided language parameter.
 * @function displayHelp
 * @param {string} language - The language in which to display the help information. 
 *                            Supported options are 'en' for English and 'fr' for French.
 */
function displayHelp(language) {  
    if (language === 'fr') {  
      console.log(`  
Usage: node structure-check.js [ACTION] [OPTION]...
Analyze the react project and check the structure of the code.

    
Actions :
    -f, --fix                    Corrige la structure de tous les fichiers .ts et .tsx dans le projet.  
    -r, --revert                 Réinitialise la structure des fichiers corrigés à partir des sauvegardes.  
    -a, --analyze                Analyse la structure des fichiers .ts et .tsx dans le projet.  
    -h, --help                   Affiche l'aide pour les commandes disponibles.  
    
Options :
    -fi=, --file=<path>          Effectue l'action uniquement sur le fichier spécifié.
    -d=,  --display=<level>      Définit le niveau d'affichage pour l'analyse. 
                                    Options disponibles : basic, detailed, tree, interactive.
                                    Par défaut : basic.
    -l=,  --langue=<lang>        Définit la langue d'affichage de l'aide. 
                                    Options disponibles : en, fr.
                                    Par défaut : en.  
    
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
Usage: node structure-check.js [ACTION] [OPTION]...
Analyze the react project and check the structure of the code.
    
Actions:  
    -f, --fix                    Fix the structure of all .ts and .tsx files in the project.  
    -r, --revert                 Revert the structure of fixed files from backups.  
    -a, --analyze                Analyze the structure of .ts and .tsx files in the project.  
    -h, --help                   Display help for available commands.  
Options:
    -fi=, --file=<path>          Make the action only on the specified file.  
    -d=,  --display=<level>      Set the display level for analysis. 
                                    Available options: basic, detailed, tree, interactive. 
                                    Default : basic.
    -l=,  --langue=<lang>        Set the language for help display. 
                                    Available options: en, fr.  
                                    Default : en.
    
Examples:  
    node script.js --fix  
    node script.js --fix --file=src/components/App.tsx  
    node script.js --revert  
    node script.js --revert --file=src/components/App.tsx  
    node script.js --analyze
    node script.js --analyze --file=src/components/App.tsx --display=interactive  
    node script.js --help  
    `);  
    }  
} 

/**
 * Displays a menu for selecting files to analyze.
 * Provides options based on the available files and allows the user to interactively select files for analysis.
 * @async
 * @function displayFilesMenu
 * @param {string[]} files - An array of file paths to display in the menu.
 * @returns {Promise<void>} A promise that resolves when the menu interaction is complete.
 */
const displayFilesMenu = async (files) => {
    // Map full paths to their shortened names for display choices
    const fileChoices = files.map(filePath => ({
        title: getShortenedFileName(filePath),
        value: filePath
    }));

    let continueInteraction = true;

    while (continueInteraction) {
        try {
            // Prompt the user to select a file from the list
            const { selectedFileFullPath } = await prompts({
                type: 'select',
                name: 'selectedFileFullPath',
                message: 'Select the file you want to analyze:',
                choices: fileChoices,
            });

            if (!selectedFileFullPath) break;

            console.log(`Selected file full path: ${selectedFileFullPath}`); // Debugging log

            // Read content of the selected file
            const content = readFileContent(selectedFileFullPath);
            const ast = parseFile(content);
            const sections = analyzeCode(ast, selectedFileFullPath);

            // Display section menu after analyzing the file
            await displaySectionsMenu(sections, selectedFileFullPath);

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

/**  
 * Displays a menu for selecting sections of code to highlight.  
 * Provides options based on the available sections and allows the user to interactively select and highlight sections.
 * @async
 * @function displaySectionsMenu
 * @param {Object} sections - An object containing arrays of different code sections.
 * @param {string} displayLevel - The level of detail for displaying the sections.
 * @param {string} filePath - The path of the file being processed.
 * @returns {Promise<void>} A promise that resolves when the menu interaction is complete.
 */
const displaySectionsMenu = async (sections, filePath) => {
    const choices = [];

    // Construction des messages de choix
    if (sections.imports && sections.imports.length > 0) choices.push(`(${sections.imports.length}) Imports`);
    if (sections.localConstants && sections.localConstants.length > 0) choices.push(`(${sections.localConstants.length}) Local Constants`);
    if (sections.constants && sections.constants.length > 0) choices.push(`(${sections.constants.length}) Constants`);
    if (sections.contexts && sections.contexts.length > 0) choices.push(`(${sections.contexts.length}) Contexts`);
    if (sections.hooks && sections.hooks.length > 0) choices.push(`(${sections.hooks.length}) Hooks`);
    if (sections.stateHooks && sections.stateHooks.length > 0) choices.push(`(${sections.stateHooks.length}) State Hooks`);
    if (sections.effectHooks && sections.effectHooks.length > 0) choices.push(`(${sections.effectHooks.length}) Effect Hooks`);
    if (sections.handlers && sections.handlers.length > 0) choices.push(`(${sections.handlers.length}) Handlers`);
    if (sections.types.TSInterfaceDeclaration && sections.types.TSInterfaceDeclaration.length > 0) choices.push(`(${sections.types.TSInterfaceDeclaration.length}) TS Interface Declarations`);
    if (sections.types.TSTypeAliasDeclaration && sections.types.TSTypeAliasDeclaration.length > 0) choices.push(`(${sections.types.TSTypeAliasDeclaration.length}) TS Type Alias Declarations`);
    if (sections.types.TSEnumDeclaration && sections.types.TSEnumDeclaration.length > 0) choices.push(`(${sections.types.TSEnumDeclaration.length}) TS Enum Declarations`);
    if (sections.helperFunctions && sections.helperFunctions.length > 0) choices.push(`(${sections.helperFunctions.length}) Helper Functions`);
    if (sections.components && sections.components.length > 0) choices.push(`(${sections.components.length}) Components`);
    if (sections.classComponents && sections.classComponents.length > 0) choices.push(`(${sections.classComponents.length}) Class Components`);
    if (sections.classMethod && sections.classMethod.length > 0) choices.push(`(${sections.classMethod.length}) Class Methods`);
    if (sections.classProperty && sections.classProperty.length > 0) choices.push(`(${sections.classProperty.length}) Class Properties`);
    if (sections.returns && sections.returns.length > 0) choices.push(`(${sections.returns.length}) Returns`);
    if (sections.styledComponent && sections.styledComponent.length > 0) choices.push(`(${sections.styledComponent.length}) Styled Components`);
    if (sections.functionalComponent && sections.functionalComponent.length > 0) choices.push(`(${sections.functionalComponent.length}) Functional Components`);
    if (sections.mainComponent) choices.push('(1) Main Component');
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
            //console.log(`Displaying section: ${cleanedSectionName}`, sectionMap[cleanedSectionName]); // Debugging log

            // Check if the cleaned section actually contains elements before displaying
            if (sectionMap[cleanedSectionName].length > 0) {
                displayHighlightedCode(sectionMap[cleanedSectionName]);
            } else {
                console.log(`No ${cleanedSectionName.toLowerCase()} found.`);
            }

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

module.exports = {
    displayAnalysis,
    displayBasic,
    displayDetailedInteractive,
    displayTree,
    displayHelp,
    displayFilesMenu,
    displaySectionsMenu,
    displayHighlightedCode,
    displayErrorAnalysis,
};