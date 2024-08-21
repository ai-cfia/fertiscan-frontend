const t = require('@babel/types');    
const { logError, generateErrorMessage, reportError } = require('./errorHandling');   
  
module.exports = {  
    t,  
    logError,  
    generateErrorMessage,  
    reportError,  
    // Add other shared utilities if needed  
};  
