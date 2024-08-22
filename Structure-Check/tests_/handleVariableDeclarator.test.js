// src/Structure-Check/__tests__/handleVariableDeclarator.test.js  
const { handleVariableDeclarator } = require('../astHandlers');  
const { reportError, generateErrorMessage } = require('../errorHandling');  
const t = require('@babel/types');  
  
jest.mock('../errorHandling', () => ({  
    reportError: jest.fn(),  
    generateErrorMessage: jest.fn(),  
}));  
  
describe('handleVariableDeclarator', () => {  
    const filePath = 'src/testfiles/someTestFile.js';  
  
    let state;  
  
    beforeEach(() => {  
        state = {  
            topLevelState: {  
                hasGlobalConstants: false,  
                hasHelperFunctions: false,  
                hasCustomHooks: false,  
                hasStyledComponents: false,  
                hasInterfaces: false,  
                hasTypes: false,  
                hasEnums: false,  
                hasMainComponent: false,  
                hasReactComponent: false,  
                hasPropTypes: false,  
                hasDefaultProps: false,  
                hasExports: false,  
                hasImports: false,  
                hasDeclarations: false,  
            },  
            functionComponentState: {  
                insideReactComponent: false,  
                hasConstants: false,  
                hasHooks: false,  
                hasHandlers: false,  
                hasReactComponent: false,  
                hasPropTypes: false,  
                hasDefaultProps: false,  
                hasExports: false,  
            },  
        };  
  
        jest.clearAllMocks();  
    });  
  
    it('should handle global constant declaration correctly', () => {  
        const path = {  
            node: t.variableDeclarator(t.identifier('GLOBAL_CONSTANT'), t.numericLiteral(10)),  
            scope: { path: { type: 'Program' } },  
            isVariableDeclarator: jest.fn(() => true),  
            findParent: jest.fn(() => null), // Simulate top-level scope  
        };  
  
        handleVariableDeclarator(path, state, filePath);  
  
        expect(state.topLevelState.hasGlobalConstants).toBe(true);  
        expect(state.topLevelState.hasDeclarations).toBe(false);  
    });  
  
    it('should handle local constant declaration correctly', () => {  
        const path = {  
            node: t.variableDeclarator(t.identifier('localConstant'), t.numericLiteral(10)),  
            scope: { path: { type: 'BlockStatement' }, getFunctionParent: jest.fn(() => ({})) },  
            isVariableDeclarator: jest.fn(() => true),  
            findParent: jest.fn(() => ({})), // Simulate function/block scope  
        };  
  
        handleVariableDeclarator(path, state, filePath);  
  
        expect(state.functionComponentState.hasConstants).toBe(true);  
        expect(state.topLevelState.hasDeclarations).toBe(false);  
    });  
  
    it('should report error if variable declaration is at the top level and not a global constant', () => {  
        const path = {  
            node: t.variableDeclarator(t.identifier('someVar'), t.numericLiteral(10)),  
            scope: { path: { type: 'Program' } },  
            isVariableDeclarator: jest.fn(() => true),  
            findParent: jest.fn(() => null), // Simulate top-level scope  
        };  
  
        generateErrorMessage.mockReturnValue('Variable declaration at the top level should be properly placed.');  
  
        handleVariableDeclarator(path, state, filePath);  
  
        expect(generateErrorMessage).toHaveBeenCalledWith('Variable declaration at the top level', state, filePath);  
        expect(reportError).toHaveBeenCalledWith(  
            path.node,  
            'Variable "someVar" should not be at the top level.',  
            filePath,  
            'Variable',  
            {  
                suggestions: 'Ensure this variable is either a global constant or moved to an appropriate scope.',  
                fix: 'Consider moving the variable "someVar" into an appropriate function or block scope.'  
            }  
        );  
    });  
  
    it('should report error if local constant declaration is not properly placed', () => {  
        state.functionComponentState.hasHooks = true;  
  
        const path = {  
            node: t.variableDeclarator(t.identifier('localConstant'), t.numericLiteral(10)),  
            scope: { path: { type: 'BlockStatement' }, getFunctionParent: jest.fn(() => ({})) },  
            isVariableDeclarator: jest.fn(() => true),  
            findParent: jest.fn(() => ({})), // Simulate function/block scope  
        };  
  
        generateErrorMessage.mockReturnValue('Local constant declaration should be properly placed.');  
  
        handleVariableDeclarator(path, state, filePath);  
  
        expect(generateErrorMessage).toHaveBeenCalledWith('Local constant declaration', state.functionComponentState, filePath);  
        expect(reportError).toHaveBeenCalledWith(  
            path.node,  
            'Local constant "localConstant" should be declared properly.',  
            filePath,  
            'Constant',  
            {  
                suggestions: 'Ensure local constants are declared before hooks, handlers, render logic, and export statements.',  
                fix: 'Consider relocating the constant "localConstant" to the top of its scope.'  
            }  
        );  
    });  
  
    it('should handle variable declaration inside function or block correctly', () => {  
        const path = {  
            node: t.variableDeclarator(t.identifier('someVar'), t.numericLiteral(10)),  
            scope: { path: { type: 'FunctionDeclaration' }, getFunctionParent: jest.fn(() => ({})) },  
            isVariableDeclarator: jest.fn(() => true),  
            findParent: jest.fn(() => ({})), // Simulate function/block scope  
        };  
  
        handleVariableDeclarator(path, state, filePath);  
  
        expect(state.topLevelState.hasDeclarations).toBe(false);  
        expect(state.functionComponentState.hasConstants).toBe(false);  
    });  
});  
