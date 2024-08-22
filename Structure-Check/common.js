const t = require('@babel/types');    
const { logError, generateErrorMessage, reportError } = require('./errorHandling'); 
const { generate } = require('@babel/generator');

  
module.exports = {  
    t,  
    logError,  
    generateErrorMessage,  
    reportError,  
    // Add other shared utilities if needed  
};  
