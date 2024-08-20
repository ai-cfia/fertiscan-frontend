// src/Structure-Check/__tests__/handleImportDeclaration.test.js  
const { handleImportDeclaration } = require('../astHandlers');  
const { reportError, generateErrorMessage } = require('../errorHandling');  
const t = require('@babel/types');  
  
jest.mock('../errorHandling', () => ({  
    reportError: jest.fn(),  
}));   
  
describe('handleImportDeclaration', () => {  
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
            },  
            functionComponentState: {  
                insideReactComponent: false,  
            },  
        };  
  
        jest.clearAllMocks();  
    });  
  
    it('should mark hasImports as true in the state', () => {  
        const path = {  
            node: t.importDeclaration([], t.stringLiteral('some-module')),  
            scope: {  
                getFunctionParent: jest.fn(() => null),  
            },  
        };  
  
        handleImportDeclaration(path, state, filePath);  
  
        expect(state.topLevelState.hasImports).toBe(true);  
    });  
  
    it('should report error if import is inside a function or component', () => {  
        const path = {  
            node: t.importDeclaration([], t.stringLiteral('some-module')),  
            scope: {  
                getFunctionParent: jest.fn(() => ({})),  
            },  
            findParent: jest.fn(() => true),  
        };  
  
        handleImportDeclaration(path, state, filePath);  
  
        expect(reportError).toHaveBeenCalledWith(  
            path.node,  
            'Imports should not be declared inside a function or component.',  
            filePath  
        );  
    });  
  
    it('should report error if imports are not at the top level', () => {  
        state.topLevelState.hasGlobalConstants = true;  
  
        const path = {  
            node: t.importDeclaration([], t.stringLiteral('some-module')),  
            scope: {  
                getFunctionParent: jest.fn(() => null),  
            },  
        };  
  
        generateErrorMessage.mockReturnValue('Import statements should be declared before other elements.');  
  
        handleImportDeclaration(path, state, filePath);  
  
        expect(generateErrorMessage).toHaveBeenCalledWith('Import statements', state.topLevelState, filePath);  
        expect(reportError).toHaveBeenCalledWith(  
            path.node,  
            'Import statements should be declared before other elements.',  
            filePath  
        );  
    });  
});  
