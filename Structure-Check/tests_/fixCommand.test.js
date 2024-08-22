const { readFileContent, parseFile } = require('../fileOperations');  
const { analyzeCode, reorderCode, createNewAST, fixFile } = require('../astTraversal');  
const { generate } = require('@babel/generator').default;  
const { writeFileContent } = require('../fileOperations');  
  
test('should read and parse file content correctly', () => {  
  const filePath = 'src/testfiles/AliasTypeError.tsx';  
  const content = readFileContent(filePath);  
  const ast = parseFile(content);  
  expect(ast).toBeDefined();  
});  

test('should analyze and classify code sections correctly file: AliasTypeError', () => {  
    const filePath = 'src/testfiles/AliasTypeError.tsx';  
    const content = readFileContent(filePath);

    const ast = parseFile(content);
    const sections = analyzeCode(ast, filePath);

    // Check all expected sections
    expect(sections).toHaveProperty('imports');
    expect(sections.imports.length).toBe(1);

    expect(sections).toHaveProperty('constants');
    expect(sections.constants.length).toBe(0);

    expect(sections).toHaveProperty('localConstants');
    expect(sections.localConstants.size).toBe(0);

    expect(sections).toHaveProperty('contexts');
    expect(sections.contexts.length).toBe(0);

    expect(sections).toHaveProperty('hooks');
    expect(sections.hooks.length).toBe(0);

    expect(sections).toHaveProperty('handlers');
    expect(sections.handlers.length).toBe(0);

    expect(sections).toHaveProperty('helperFunctions');
    expect(sections.helperFunctions.length).toBe(0);
    
    expect(sections).toHaveProperty('components');
    expect(sections.components.length).toBe(0);

    expect(sections).toHaveProperty('classComponents');
    expect(sections.classComponents.length).toBe(0);

    expect(sections).toHaveProperty('classMethod');
    expect(sections.classMethod.length).toBe(0);

    expect(sections).toHaveProperty('classProperty');
    expect(sections.classProperty.length).toBe(0);

    //expect(sections).toHaveProperty('return');
    //expect(sections.return.length).toBe(1);

    expect(sections).toHaveProperty('styledComponent');
    expect(sections.styledComponent.length).toBe(0);

    expect(sections).toHaveProperty('functionalComponent');
    expect(sections.functionalComponent.length).toBe(0);

    // Check types section
    expect(sections.types).toHaveProperty('TSInterfaceDeclaration');
    expect(sections.types.TSInterfaceDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSTypeAliasDeclaration');
    expect(sections.types.TSTypeAliasDeclaration.length).toBe(1);

    expect(sections.types).toHaveProperty('TSEnumDeclaration');
    expect(sections.types.TSEnumDeclaration.length).toBe(0);

    expect(sections).toHaveProperty('exports');
    expect(sections.exports.length).toBe(1);

    expect(sections).toHaveProperty('mainComponent');
    expect(sections.mainComponent).not.toBeNull();

    expect(sections).toHaveProperty('nodes');
    expect(sections.nodes.length).toBeGreaterThan(0);

    console.log(sections);
});

  test('should analyze and classify code sections correctly file: CustomHookAndHandlerOrder', () => {  
    const filePath = 'src/testfiles/CustomHookAndHandlerOrder.tsx';
    const content = readFileContent(filePath);

    const ast = parseFile(content);
    const sections = analyzeCode(ast, filePath);

    // Check all expected sections
    expect(sections).toHaveProperty('imports');
    expect(sections.imports.length).toBe(1);

    expect(sections).toHaveProperty('constants');
    expect(sections.constants.length).toBe(0);

    expect(sections).toHaveProperty('localConstants');
    expect(sections.localConstants.size).toBe(1);

    expect(sections).toHaveProperty('contexts');
    expect(sections.contexts.length).toBe(0);

    expect(sections).toHaveProperty('hooks');
    expect(sections.hooks.length).toBe(1);

    expect(sections).toHaveProperty('handlers');
    expect(sections.handlers.length).toBe(1);

    expect(sections).toHaveProperty('helperFunctions');
    expect(sections.helperFunctions.length).toBe(0);

    expect(sections).toHaveProperty('components');
    expect(sections.components.length).toBe(0);

    expect(sections).toHaveProperty('classComponents');
    expect(sections.classComponents.length).toBe(0);

    expect(sections).toHaveProperty('classMethod');
    expect(sections.classMethod.length).toBe(0);

    expect(sections).toHaveProperty('classProperty');
    expect(sections.classProperty.length).toBe(0);

    //expect(sections).toHaveProperty('return');
    //expect(sections.return.length).toBe(1);

    expect(sections).toHaveProperty('styledComponent');
    expect(sections.styledComponent.length).toBe(0);

    expect(sections).toHaveProperty('functionalComponent');
    expect(sections.functionalComponent.length).toBe(1);

    // Check types section
    expect(sections.types).toHaveProperty('TSInterfaceDeclaration');
    expect(sections.types.TSInterfaceDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSTypeAliasDeclaration');
    expect(sections.types.TSTypeAliasDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSEnumDeclaration');
    expect(sections.types.TSEnumDeclaration.length).toBe(0);

    expect(sections).toHaveProperty('exports');
    expect(sections.exports.length).toBe(1);

    expect(sections).toHaveProperty('mainComponent');
    expect(sections.mainComponent).not.toBeNull();
    expect(sections).toHaveProperty('nodes');
    expect(sections.nodes.length).toBeGreaterThan(0);

    console.log(sections);
});

test('should analyze and classify code sections correctly file: CustomHookDefinedError', () => {
    const filePath = 'src/testfiles/CustomHookDefinedError.tsx';
    const content = readFileContent(filePath);

    const ast = parseFile(content);
    const sections = analyzeCode(ast, filePath);

    // Check all expected sections
    expect(sections).toHaveProperty('imports');
    expect(sections.imports.length).toBe(1);

    expect(sections).toHaveProperty('constants');
    expect(sections.constants.length).toBe(0);

    expect(sections).toHaveProperty('localConstants');
    expect(sections.localConstants.size).toBe(1);

    expect(sections).toHaveProperty('contexts');
    expect(sections.contexts.length).toBe(0);

    expect(sections).toHaveProperty('hooks');
    expect(sections.hooks.length).toBe(1);


    expect(sections).toHaveProperty('handlers');
    expect(sections.handlers.length).toBe(0);

    expect(sections).toHaveProperty('helperFunctions');
    expect(sections.helperFunctions.length).toBe(0);

    expect(sections).toHaveProperty('components');
    expect(sections.components.length).toBe(0);

    expect(sections).toHaveProperty('classComponents');
    expect(sections.classComponents.length).toBe(0);

    expect(sections).toHaveProperty('classMethod');
    expect(sections.classMethod.length).toBe(0);

    expect(sections).toHaveProperty('classProperty');
    expect(sections.classProperty.length).toBe(0);

    //expect(sections).toHaveProperty('return');
    //expect(sections.return.length).toBe(1);

    expect(sections).toHaveProperty('styledComponent');
    expect(sections.styledComponent.length).toBe(0);

    expect(sections).toHaveProperty('functionalComponent');
    expect(sections.functionalComponent.length).toBe(0);

    // Check types section
    expect(sections.types).toHaveProperty('TSInterfaceDeclaration');
    expect(sections.types.TSInterfaceDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSTypeAliasDeclaration');
    expect(sections.types.TSTypeAliasDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSEnumDeclaration');
    expect(sections.types.TSEnumDeclaration.length).toBe(0);

    expect(sections).toHaveProperty('exports');
    expect(sections.exports.length).toBe(1);

    expect(sections).toHaveProperty('mainComponent');
    expect(sections.mainComponent).not.toBeNull();

    expect(sections).toHaveProperty('nodes');
    expect(sections.nodes.length).toBeGreaterThan(0);

    console.log(sections);
});
/*
// Test to analyze and classify code sections correctly in file: DisorganizedComponent1

test('should analyze and classify code sections correctly in file: DisorganizedComponent1', () => {
    const filePath = 'src/testfiles/DisorganizedComponent1.tsx';
    const content = readFileContent(filePath);

    const ast = parseFile(content);
    const sections = analyzeCode(ast, filePath);

    // Check all expected sections
    expect(sections).toHaveProperty('imports');
    expect(sections.imports.length).toBe(4);

    expect(sections).toHaveProperty('localConstants');
    expect(sections.localConstants.size).toBe(1);

    expect(sections).toHaveProperty('constants');
    expect(sections.constants.length).toBe(1);

    expect(sections).toHaveProperty('contexts');
    expect(sections.contexts.length).toBe(1);

    expect(sections).toHaveProperty('hooks');
    expect(sections.hooks.length).toBe(3);

    expect(sections).toHaveProperty('handlers');
    expect(sections.handlers.length).toBe(1);

    expect(sections).toHaveProperty('helperFunctions');
    expect(sections.helperFunctions.length).toBe(0);
    
    expect(sections).toHaveProperty('components');
    expect(sections.components.length).toBe(0);

    expect(sections).toHaveProperty('classComponents');
    expect(sections.classComponents.length).toBe(0);

    expect(sections).toHaveProperty('classMethod');
    expect(sections.classMethod.length).toBe(0);

    expect(sections).toHaveProperty('classProperty');
    expect(sections.classProperty.length).toBe(0);

    expect(sections).toHaveProperty('return');
    expect(sections.return.length).toBe(1);

    expect(sections).toHaveProperty('styledComponent');
    expect(sections.styledComponent.length).toBe(1);

    expect(sections).toHaveProperty('functionalComponent');
    expect(sections.functionalComponent.length).toBe(0);

    // Check types section
    expect(sections.types).toHaveProperty('TSInterfaceDeclaration');
    expect(sections.types.TSInterfaceDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSTypeAliasDeclaration');
    expect(sections.types.TSTypeAliasDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSEnumDeclaration');
    expect(sections.types.TSEnumDeclaration.length).toBe(0);

    expect(sections).toHaveProperty('exports');
    expect(sections.exports.length).toBe(1);

    expect(sections).toHaveProperty('mainComponent');
    expect(sections.mainComponent).toBeNull();

    expect(sections).toHaveProperty('nodes');
    expect(sections.nodes.length).toBeGreaterThan(0);

    console.log(sections);
});
/*
test('should analyze and classify code sections correctly in file: DisorganizedComponent2', () => {
    const filePath = 'src/testfiles/DisorganizedComponent2.tsx';
    const content = readFileContent(filePath);

    const ast = parseFile(content);
    const sections = analyzeCode(ast, filePath);

    // Check all expected sections
    expect(sections).toHaveProperty('imports');
    expect(sections.imports.length).toBe(2);

    expect(sections).toHaveProperty('constants');
    expect(sections.constants.length).toBe(0);

    expect(sections).toHaveProperty('localConstants');
    expect(sections.localConstants.size).toBe(0);

    expect(sections).toHaveProperty('contexts');
    expect(sections.contexts.length).toBe(1);

    expect(sections).toHaveProperty('hooks');
    expect(sections.hooks.length).toBe(0);

    expect(sections).toHaveProperty('handlers');
    expect(sections.handlers.length).toBe(0);

    expect(sections).toHaveProperty('helperFunctions');
    expect(sections.helperFunctions.length).toBe(1);

    expect(sections).toHaveProperty('functions');
    expect(sections.functions.length).toBe(0);

    expect(sections).toHaveProperty('components');
    expect(sections.components.length).toBe(1);

    expect(sections).toHaveProperty('classComponents');
    expect(sections.classComponents.length).toBe(0);

    expect(sections).toHaveProperty('classMethod');
    expect(sections.classMethod.length).toBe(0);

    expect(sections).toHaveProperty('classProperty');
    expect(sections.classProperty.length).toBe(0);

    expect(sections).toHaveProperty('return');
    expect(sections.return.length).toBe(1);

    expect(sections).toHaveProperty('styledComponent');
    expect(sections.styledComponent.length).toBe(0);

    expect(sections).toHaveProperty('functionalComponent');
    expect(sections.functionalComponent.length).toBe(1);

    // Check types section
    expect(sections.types).toHaveProperty('TSInterfaceDeclaration');
    expect(sections.types.TSInterfaceDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSTypeAliasDeclaration');
    expect(sections.types.TSTypeAliasDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSEnumDeclaration');
    expect(sections.types.TSEnumDeclaration.length).toBe(0);

    expect(sections).toHaveProperty('exports');
    expect(sections.exports.length).toBe(1);

    expect(sections).toHaveProperty('mainComponent');
    expect(sections.mainComponent).toBeNull();

    expect(sections).toHaveProperty('nodes');
    expect(sections.nodes.length).toBeGreaterThan(0);

    console.log(sections);
});
*/
test('should analyze and classify code sections correctly in file: EnumError', () => {
    const filePath = 'src/testfiles/EnumError.tsx';
    const content = readFileContent(filePath);

    const ast = parseFile(content);
    const sections = analyzeCode(ast, filePath);

    // Check all expected sections
    expect(sections).toHaveProperty('imports');
    expect(sections.imports.length).toBe(1);

    expect(sections).toHaveProperty('constants');
    expect(sections.constants.length).toBe(0);

    expect(sections).toHaveProperty('localConstants');
    expect(sections.localConstants.size).toBe(0);

    expect(sections).toHaveProperty('contexts');
    expect(sections.contexts.length).toBe(0);

    expect(sections).toHaveProperty('hooks');
    expect(sections.hooks.length).toBe(0);

    expect(sections).toHaveProperty('handlers');
    expect(sections.handlers.length).toBe(0);

    expect(sections).toHaveProperty('helperFunctions');
    expect(sections.helperFunctions.length).toBe(0);

    expect(sections).toHaveProperty('components');
    expect(sections.components.length).toBe(0);

    expect(sections).toHaveProperty('classComponents');
    expect(sections.classComponents.length).toBe(0);

    expect(sections).toHaveProperty('classMethod');
    expect(sections.classMethod.length).toBe(0);

    expect(sections).toHaveProperty('classProperty');
    expect(sections.classProperty.length).toBe(0);

    //expect(sections).toHaveProperty('return');
    //expect(sections.return.length).toBe(1);

    expect(sections).toHaveProperty('styledComponent');
    expect(sections.styledComponent.length).toBe(0);

    expect(sections).toHaveProperty('functionalComponent');
    expect(sections.functionalComponent.length).toBe(0);

    // Check types section
    expect(sections.types).toHaveProperty('TSInterfaceDeclaration');
    expect(sections.types.TSInterfaceDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSTypeAliasDeclaration');
    expect(sections.types.TSTypeAliasDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSEnumDeclaration');
    expect(sections.types.TSEnumDeclaration.length).toBe(1);

    expect(sections).toHaveProperty('exports');
    expect(sections.exports.length).toBe(1);

    expect(sections).toHaveProperty('mainComponent');
    expect(sections.mainComponent).not.toBeNull();

    expect(sections).toHaveProperty('nodes');
    expect(sections.nodes.length).toBeGreaterThan(0);

    console.log(sections);
});

test('should analyze and classify code sections correctly in file: GlobalConstError', () => {
    const filePath = 'src/testfiles/GlobalConstError.tsx';
    const content = readFileContent(filePath);

    const ast = parseFile(content);
    const sections = analyzeCode(ast, filePath);

    // Check all expected sections
    expect(sections).toHaveProperty('imports');
    expect(sections.imports.length).toBe(1);

    expect(sections).toHaveProperty('constants');
    expect(sections.constants.length).toBe(1);

    expect(sections).toHaveProperty('localConstants');
    expect(sections.localConstants.size).toBe(0);

    expect(sections).toHaveProperty('contexts');
    expect(sections.contexts.length).toBe(0);

    expect(sections).toHaveProperty('hooks');
    expect(sections.hooks.length).toBe(0);

    expect(sections).toHaveProperty('handlers');
    expect(sections.handlers.length).toBe(0);

    expect(sections).toHaveProperty('helperFunctions');
    expect(sections.helperFunctions.length).toBe(0);

    expect(sections).toHaveProperty('components');
    expect(sections.components.length).toBe(0);

    expect(sections).toHaveProperty('classComponents');
    expect(sections.classComponents.length).toBe(0);

    expect(sections).toHaveProperty('classMethod');
    expect(sections.classMethod.length).toBe(0);

    expect(sections).toHaveProperty('classProperty');
    expect(sections.classProperty.length).toBe(0);

    expect(sections).toHaveProperty('return');
    expect(sections.return.length).toBe(1);

    expect(sections).toHaveProperty('styledComponent');
    expect(sections.styledComponent.length).toBe(0);

    expect(sections).toHaveProperty('functionalComponent');
    expect(sections.functionalComponent.length).toBe(0);

    // Check types section
    expect(sections.types).toHaveProperty('TSInterfaceDeclaration');
    expect(sections.types.TSInterfaceDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSTypeAliasDeclaration');
    expect(sections.types.TSTypeAliasDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSEnumDeclaration');
    expect(sections.types.TSEnumDeclaration.length).toBe(0);

    expect(sections).toHaveProperty('exports');
    expect(sections.exports.length).toBe(1);

    expect(sections).toHaveProperty('mainComponent');
    expect(sections.mainComponent).not.toBeNull();

    expect(sections).toHaveProperty('nodes');
    expect(sections.nodes.length).toBeGreaterThan(0);

    console.log(sections);
});

test('should analyze and classify code sections correctly in file: GoodClassInclude', () => {
    const filePath = 'src/testfiles/GoodClassInclude.tsx';
    const content = readFileContent(filePath);

    const ast = parseFile(content);
    const sections = analyzeCode(ast, filePath);

    // Check all expected sections
    expect(sections).toHaveProperty('imports');
    expect(sections.imports.length).toBe(2);

    expect(sections).toHaveProperty('constants');
    expect(sections.constants.length).toBe(1);

    expect(sections).toHaveProperty('localConstants');
    expect(sections.localConstants.size).toBe(0);

    expect(sections).toHaveProperty('contexts');
    expect(sections.contexts.length).toBe(1);

    expect(sections).toHaveProperty('hooks');
    expect(sections.hooks.length).toBe(1);

    expect(sections).toHaveProperty('handlers');
    expect(sections.handlers.length).toBe(2);

    expect(sections).toHaveProperty('helperFunctions');
    expect(sections.helperFunctions.length).toBe(1);

    expect(sections).toHaveProperty('components');
    expect(sections.components.length).toBe(0);

    expect(sections).toHaveProperty('classComponents');
    expect(sections.classComponents.length).toBe(1);

    expect(sections).toHaveProperty('classMethod');
    expect(sections.classMethod.length).toBe(3);

    expect(sections).toHaveProperty('classProperty');
    expect(sections.classProperty.length).toBe(0);

    expect(sections).toHaveProperty('return');
    expect(sections.return.length).toBe(2);

    expect(sections).toHaveProperty('styledComponent');
    expect(sections.styledComponent.length).toBe(1);

    expect(sections).toHaveProperty('functionalComponent');
    expect(sections.functionalComponent.length).toBe(1);

    // Check types section
    expect(sections.types).toHaveProperty('TSInterfaceDeclaration');
    expect(sections.types.TSInterfaceDeclaration.length).toBe(1);

    expect(sections.types).toHaveProperty('TSTypeAliasDeclaration');
    expect(sections.types.TSTypeAliasDeclaration.length).toBe(1);

    expect(sections.types).toHaveProperty('TSEnumDeclaration');
    expect(sections.types.TSEnumDeclaration.length).toBe(1);

    expect(sections).toHaveProperty('exports');
    expect(sections.exports.length).toBe(6);

    expect(sections).toHaveProperty('mainComponent');
    expect(sections.mainComponent).not.toBeNull();

    expect(sections).toHaveProperty('nodes');
    expect(sections.nodes.length).toBeGreaterThan(0);

    console.log(sections);
});

test('should analyze and classify code sections correctly in file: HandlerAfterRender', () => {
    const filePath = 'src/testfiles/HandlerAfterRender.tsx';
    const content = readFileContent(filePath);

    const ast = parseFile(content);
    const sections = analyzeCode(ast, filePath);

    // Check all expected sections
    expect(sections).toHaveProperty('imports');
    expect(sections.imports.length).toBe(1);

    expect(sections).toHaveProperty('constants');
    expect(sections.constants.length).toBe(0);

    expect(sections).toHaveProperty('localConstants');
    expect(sections.localConstants.size).toBe(0);

    expect(sections).toHaveProperty('contexts');
    expect(sections.contexts.length).toBe(0);

    expect(sections).toHaveProperty('hooks');
    expect(sections.hooks.length).toBe(0);

    expect(sections).toHaveProperty('handlers');
    expect(sections.handlers.length).toBe(1);

    expect(sections).toHaveProperty('helperFunctions');
    expect(sections.helperFunctions.length).toBe(0);

    expect(sections).toHaveProperty('components');
    expect(sections.components.length).toBe(1);

    expect(sections).toHaveProperty('classComponents');
    expect(sections.classComponents.length).toBe(0);

    expect(sections).toHaveProperty('classMethod');
    expect(sections.classMethod.length).toBe(0);

    expect(sections).toHaveProperty('classProperty');
    expect(sections.classProperty.length).toBe(0);

    expect(sections).toHaveProperty('return');
    expect(sections.return.length).toBe(1);

    expect(sections).toHaveProperty('styledComponent');
    expect(sections.styledComponent.length).toBe(0);

    expect(sections).toHaveProperty('functionalComponent');
    expect(sections.functionalComponent.length).toBe(1);

    // Check types section
    expect(sections.types).toHaveProperty('TSInterfaceDeclaration');
    expect(sections.types.TSInterfaceDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSTypeAliasDeclaration');
    expect(sections.types.TSTypeAliasDeclaration.length).toBe(0);

    expect(sections.types).toHaveProperty('TSEnumDeclaration');
    expect(sections.types.TSEnumDeclaration.length).toBe(0);

    expect(sections).toHaveProperty('exports');
    expect(sections.exports.length).toBe(1);

    expect(sections).toHaveProperty('mainComponent');
    expect(sections.mainComponent).toBeNull();

    expect(sections).toHaveProperty('nodes');
    expect(sections.nodes.length).toBeGreaterThan(0);

    console.log(sections);
});