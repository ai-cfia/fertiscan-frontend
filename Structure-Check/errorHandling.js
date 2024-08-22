
const errors = [];  
  
//////////////////////////
//////////////////////////
//////// Todo ////////////: Make sure this function work well 
//////////////////////////  and handle different type of error
//////////////////////////  with location or witout location
//////////////////////////  and with suggestions or without suggestions
//////////////////////////  Make sure the error message is well formatted.
//////////////////////////  
//////////////////////////  Also make sure the logError work for saving 
//////////////////////////  error on a constance (Add a return) to help 
//////////////////////////  working with the menu
//////////////////////////
//////////////////////////
/**  
 * Logs an error message to the console and pushes the error details to a global errors array.  
 *   
 * @function logError  
 * @param {Object} node - The AST node where the error occurred.  
 * @param {string} node.type - The type of the AST node.  
 * @param {Object} node.loc - The location information for the node.  
 * @param {Object} node.loc.start - The starting position of the node.  
 * @param {number} node.loc.start.line - The starting line number of the node.  
 * @param {number} node.loc.start.column - The starting column number of the node.  
 * @param {string} message - The error message to log.  
 * @param {string} filePath - The path of the file where the error occurred.  
 * @param {Object} [extraInfo] - Additional information about the error.  
 * @param {string[]} [extraInfo.suggestions] - Suggestions for resolving the error.  
 * @param {string} [extraInfo.fix] - Suggested fix for the error.  
 */  
const logError = (node, message, filePath, extraInfo = {}) => {    
    const errorMessage = [    
        `[${node && node.type ? node.type : 'Error'}] - Error in ${filePath || 'Unknown file'}:${node && node.loc && node.loc.start ? `${node.loc.start.line}:${node.loc.start.column}` : 'Unknown location'}`,    
        `Message: ${message}`,    
        node && node.type ? `Node Type: ${node.type}` : '',    
        extraInfo.suggestions ? `Suggestions: ${extraInfo.suggestions.join(', ')}` : '',    
        extraInfo.fix ? `Suggested Fix: ${extraInfo.fix}` : ''    
    ].filter(Boolean).join('\n');    
    
    console.error(errorMessage);    
    errors.push({ node, errorMessage, filePath, extraInfo });    
};    
  
/**  
 * Generates an error message based on the provided description, state, and file path.  
 *   
 * @param {string} description - The description of the error.  
 * @param {object} state - The state object containing various flags indicating the presence of certain declarations.  
 * @param {string} filePath - The file path where the error occurred.  
 * @returns {string} - The generated error message.  
 */  
const generateErrorMessage = (description, state, filePath) => {  
    const descriptionMapping = {  
        // Mapping for error messages...  
        "Import statements": ["hasGlobalConstants", "hasHelperFunctions", "hasCustomHooks", "hasStyledComponents", "hasInterfaces", "hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "Global constant": ["hasHelperFunctions", "hasCustomHooks", "hasStyledComponents", "hasInterfaces", "hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "Helper Functions": ["hasCustomHooks", "hasStyledComponents", "hasInterfaces", "hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "Custom Hooks": ["hasStyledComponents", "hasInterfaces", "hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "Styled Component": ["hasInterfaces", "hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "Interface": ["hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "Type alias": ["hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "Enums": ["hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "Main function/component": ["hasHandlers", "hasHooks", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "Class component": ["hasHandlers", "hasHooks", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "React component declarations": ["hasHandlers", "hasHooks", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "PropTypes definitions": ["hasDefaultProps", "hasExports"],  
        "default props": ["hasPropTypes", "hasExports"],  
        "Constante": ["hasHelperFunctions", "hasCustomHooks", "hasStyledComponents", "hasInterfaces", "hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "Handlers": ["hasHooks", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "Hooks": ["hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
        "Exports": []  
    };  
  
    const messages = [];  
    const relevantStateKeys = descriptionMapping[description] || [];  
  
    for (const key of relevantStateKeys) {  
        if (state[key]) {  
            const readableForm = key.replace('has', '').replace(/([A-Z])/g, ' $1').toLowerCase();  
            messages.push(readableForm.trim());  
        }  
    }  
  
    if (messages.length > 0) {  
        const reasonString = messages.join(", ");  
        return `${description} should be declared before ${reasonString}.`;  
    }  
  
    return "";  
};  
  
/**  
 * Reports an error by logging it and adding it to the errors array.  
 *   
 * @param {Object} node - The AST node where the error occurred.  
 * @param {string} message - The error message.  
 * @param {string} filePath - The path of the file where the error occurred.  
 * @param {string} [type] - The type of the error.  
 * @param {Object} [extraInfo] - Additional information about the error.  
 */  
const reportError = (node, message, filePath, type = 'Error', extraInfo = {}) => {  
    logError(node, message, filePath, { type, ...extraInfo });  
};  
  
module.exports = {  
    errors,  
    logError,  
    generateErrorMessage,  
    reportError,  
};  
