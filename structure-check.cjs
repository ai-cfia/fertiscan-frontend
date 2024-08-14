const { execSync } = require('child_process');  
const path = require('path');  
const fs = require('fs');  
const { parse } = require('@babel/parser');  
const traverse = require('@babel/traverse').default;  
const fsPromises = fs.promises;  
const t = require('@babel/types');  
const generate = require('@babel/generator').default;  
const prompts = require('prompts');  
const projectPath = 'src';  
const filePattern = /\.(ts|tsx)$/; // Use a regex pattern for matching file extensions  
const ignoreFilePath = 'structure-check.ignore';  
const util = require('util');  
const readFile = util.promisify(fs.readFile);  
const readFileSync = fs.readFileSync;  
const React = require('react');  
const { useState } = require('react');
const { readdir, stat } = fs.promises;

async function loadInk() {    
  const { render, Text, Box, useApp, useInput } = await import('ink');    
  const SelectInput = await import('ink-select-input').then(mod => mod.default); // Use dynamic import for ink-select-input  
  return { render, Text, Box, useApp, useInput, SelectInput };    
}        



// ---------------------- Is functions ----------------------
 
// ---------------------- Find functions ----------------------


function processFunctionType(type, path, state, filePath) {  
  switch (type) {  
    case 'customHook':  
      handleCustomHookDeclaration(path, state, filePath);  
      break;  
    case 'mainFunctionComponent':  
      handleMainReactComponent(path, state, filePath);  
      break;  
    case 'helperFunction':  
      handleHelperFunctionDeclaration(path, state, filePath);  
      break;  
    case 'arrowFunction':  
    case 'expressionFunction':  
      handleExpressionFunctionDeclaration(path, state, filePath);  
      break;  
    case 'globalConstant':  
      handleGlobalConstantDeclaration(path, state, filePath);  
      break;  
    case 'localConstant':  
      handlelocalConstantDeclaration(path, state, filePath);  
      break;  
    case 'variableDeclarator':  
      handleVariableDeclarator(path, state, filePath);  
      break;  
    case 'functionalComponent':  
      handleFunctionalComponent(path, state, filePath);  
      break;  
    case 'TSInterfaceDeclaration':  
      handleTSInterfaceDeclaration(path, state, filePath);  
      break;  
    case 'TSTypeAliasDeclaration':  
      handleTSTypeAliasDeclaration(path, state, filePath);  
      break;  
    case 'TSEnumDeclaration':  
      handleTSEnumDeclaration(path, state, filePath);  
      break;  
    case 'unknown':  
    default:  
      console.log('Unrecognized function type. Please add this function type to the structure code script.', path.node.type);  
      break;  
  }  
}  

// ---------------------- Traversal setup ----------------------

function hasDisableCheckComment(path) {
  // Check if a comment array contains 'disable-check'
  const containsDisableCheck = (comments) => {
    return Array.isArray(comments) && comments.some(
      (comment) => comment.type === 'CommentLine' && comment.value.trim() === 'disable-check'
    );
  };

  if (path) {
      // Check leadingComments of the current node
      if (containsDisableCheck(path.node.leadingComments)) {
        return true;
      }

    // If the node is a JSXElement or is within a JSXElement,
    // check 'disable-check' comment for its closest parent
    if (path.node.type === 'JSXElement' || path.findParent((p) => p.node.type === 'JSXElement')) {
      let containerPath = path.findParent(
        (p) => p.isReturnStatement() || p.node.type === 'VariableDeclaration'
      );
      // Check leadingComments of the container node
      if (containsDisableCheck(containerPath?.node.leadingComments)) { // Using optional chaining operator
        return true;
      }
    }
  }

  return false;




function setupTraverse(state, filePath) {  
  return {  
      ImportDeclaration(path) {  
          if (!hasDisableCheckComment(path)) {  
            //  handleImportDeclaration(path, state, filePath);  
          }  
      },  
      VariableDeclaration(path) {  
          if (!hasDisableCheckComment(path)) {  
            if (isMainFunctionComponent(path, state, filePath)) {  
              handleMainReactComponent(path, state, filePath);  
            } //else {
             // path.get('declarations').forEach((declaratorPath) => {  
             //     const type = recognizeType(declaratorPath, state, filePath);  
             //     processFunctionType(type, declaratorPath, state, filePath);  
             // });  
          //}  
        }
      },  

      TSTypeAliasDeclaration(path) {  
          if (!hasDisableCheckComment(path)) {  
            //  handleTSTypeAliasDeclaration(path, state, filePath);  
          }  
      },  
      TSInterfaceDeclaration(path) {  
          if (!hasDisableCheckComment(path)) {  
            //  handleTSInterfaceDeclaration(path, state, filePath);  
          }  
      },  
      TSEnumDeclaration(path) {  
          if (!hasDisableCheckComment(path)) {  
            //  handleTSEnumDeclaration(path, state, filePath);  
          }  
      },  
      FunctionDeclaration(path) {  
          if (!hasDisableCheckComment(path)) {  
             // if (isMainFunctionComponent(path, state, filePath)) {  
               //   handleMainReactComponent(path, state, filePath);  
             // }
              if {  
                  const type = recognizeType(path, state, filePath);  
                  processFunctionType(type, path, state, filePath);  
              }  
          }  
      },  
      'ArrowFunctionExpression|FunctionExpression': {  
          enter(path) {  
              if (!hasDisableCheckComment(path)) {  
                  if (path.parentPath.isVariableDeclarator()) {  
                      //const type = recognizeType(path.parentPath, state, filePath);  
                      //processFunctionType(type, path.parentPath, state, filePath);  
                  }  
              }  
          }  
      },  
      ClassDeclaration(path) {  
        if (!hasDisableCheckComment(path)) {    
          if (isMainFunctionComponent(path, state, filePath)) {  
            handleMainReactComponent(path, state, filePath);    
          } else {  
          //  handleClassComponent(path, state, filePath);  
          }  
        }    
      }, 
      CallExpression(path) {  
          if (!hasDisableCheckComment(path)) {  
            //  handleHooksAndEffects(path, state, filePath);  
          }  
      },  
      TaggedTemplateExpression(path) {  
          if (!hasDisableCheckComment(path)) {  
             // handleStyledComponent(path, state, filePath);  
          }  
      },  
      'ExportNamedDeclaration|ExportDefaultDeclaration'(path) {  
          if (!hasDisableCheckComment(path)) {  
             // handleExportDeclarations(path, state, filePath);  
          }  
      },  
  };  
}  

// ---------------------- fix AST function ----------------------
function analyzeCode(ast, filePath) {  
  const sections = {  
    imports: [],  
    localConstants: new Map(),  
    constants: [],  
    contexts: [], // Added contexts to separate context creations  
    hooks: [],    // Added hooks to separate hooks  
    helperFunctions: [], // Ensure helper functions are initialized as arrays  
    functions: [],  
    components: [],  
    classComponents: [], 
    types: [],  
    exports: [],  
    mainComponent: null,  
  };  
    
  traverse(ast, {  
    ImportDeclaration(path) {  
      sections.imports.push(path.node);  
      path.remove();  
    },  
    VariableDeclaration(path) {  
      if (isGlobalConstant(path)) {  
        sections.constants.push(path.node);  
      } else if (isLocalConstant(path)) {  
        const parentFunction = path.getFunctionParent();  
        if (parentFunction) {  
          const functionBodyNode = parentFunction.node.body;  
          if (sections.localConstants.has(functionBodyNode)) {  
            sections.localConstants.get(functionBodyNode).push(path.node);  
          } else {  
            sections.localConstants.set(functionBodyNode, [path.node]);  
          }  
        } else {  
          sections.constants.push(path.node);  
        }  
      } else if (isContextCreation(path)) {  
        sections.contexts.push(path.node);  
      } else {  
        sections.constants.push(path.node);  
      }  
      path.remove();  
    },  
    TSTypeAliasDeclaration(path) {  
      sections.types.push(path.node);  
      path.remove();  
    },  
    TSInterfaceDeclaration(path) {  
      sections.types.push(path.node);  
      path.remove();  
    },  
    TSEnumDeclaration(path) {  
      sections.types.push(path.node);  
      path.remove();  
    },  
    FunctionDeclaration(path) {  
      if (isMainFunctionComponent(path, {}, getMainComponentNameFromFileName(filePath))) {  
        sections.mainComponent = path.node;  
      } else {  
        sections.helperFunctions.push(path.node); // Adjusted to push helper functions here  
      }  
      path.remove();  
    },  
    ArrowFunctionExpression(path) {  
      if (isReactComponent(path.parentPath) && path.parentPath.isVariableDeclarator()) {  
        if (isMainFunctionComponent(path.parentPath, {}, getMainComponentNameFromFileName(filePath))) {  
          sections.mainComponent = path.parentPath.parent;  
        } else {  
          sections.components.push(path.parentPath.node);  
        }  
      } else if (isCustomHook(path.parentPath)) {  
        sections.helperFunctions.push(path.parentPath.node); // Adjusted to push custom hooks here  
      } else {  
        sections.helperFunctions.push(path.parentPath.node); // Adjusted to push expression functions here  
      }  
      path.parentPath.remove();  
    },  
    ClassDeclaration(path) {  
      if (isClassComponent(path)) {  
        sections.classComponents.push(path.node);  // Push the class component to the classComponents section  
      } else {  
        sections.helperFunctions.push(path.node);  
      }  
      path.remove();  
    }, 
    ExportNamedDeclaration(path) {  
      sections.exports.push(path.node);  
      path.remove();  
    },  
    ExportDefaultDeclaration(path) {  
      sections.exports.push(path.node);  
      path.remove();  
    },  
  });  
  
  return sections;  
}   
async function analyzeAllFiles(displayLevel) {    
  console.log('Recherche des fichiers .ts et .tsx dans le projet...');    
  errors.length = 0;  
  const ignorePattern = await compileIgnorePattern(ignoreFilePath);    
  const files = await findFilesRecursive(projectPath, filePattern, [], ignorePattern);    
    
  if (files.length === 0) {    
    console.log(`Aucun fichier correspondant trouvé avec le motif "${filePattern}".`);    
  } else {    
    console.log(`Fichiers trouvés pour l'analyse de structure:`, files);    
    const allSections = {};  
    for (const filePath of files) {    
      const content = readFileSync(filePath, 'utf-8');    
      const ast = parse(content, { sourceType: 'module', plugins: ['jsx', 'typescript'] });    
      const sections = analyzeCodeWithDetails(ast, filePath);    
      allSections[filePath] = sections;  
    }  
    await displayFilesMenu(allSections, displayLevel);  
  }    
}  
function analyzeFile(filePath, displayLevel) {  
  console.log(`Analysing file: ${filePath}`);  
  errors.length = 0;  
  const content = readFileSync(filePath, 'utf-8');  
  const ast = parse(content, { sourceType: 'module', plugins: ['jsx', 'typescript'] });  
  const sections = analyzeCodeWithDetails(ast, filePath);  
  displayAnalysis(sections, displayLevel);  
}   
function analyzeCodeWithDetails(ast, filePath) {      
  if (!filePath) {      
    console.error('No file path provided for analysis.');      
    process.exit(1);      
  }      
      
  if (!fs.statSync(filePath).isFile()) {      
    console.error(`${filePath} is not a file.`);      
    process.exit(1);      
  }      
      
  const sections = {      
    imports: [],      
    localConstants: new Map(),      
    constants: [],      
    contexts: [],      
    hooks: [],      
    helperFunctions: [],      
    functions: [],      
    components: [],      
    classComponents: [],      
    types: [],      
    enums: [], // Explicitly add an enum section    
    exports: [],      
    mainComponent: null,      
    nodes: [],    
    ArrowFunction: [],    
    FunctionDeclaration: [],    
    FunctionExpression: [],    
    ClassMethod: [],    
  };      
      
  const state = createStateTracker();  // Create state tracker here    
      
  traverse(ast, {      
    enter(path) {      
      const nodeDetails = {      
        type: path.node.type,      
        loc: path.node.loc,      
        name: path.node.id ? path.node.id.name : null,      
        code: generate(path.node).code,      
        hasError: false // Initialize hasError to false      
      };      
      
      // Use existing functions to detect errors      
      if (path.isVariableDeclaration()) {      
        handleVariableDeclarator(path, state, filePath);      
      } else if (path.isFunctionDeclaration()) {      
        handleHelperFunctionDeclaration(path, state, filePath);      
      } else if (path.isArrowFunctionExpression() || path.isFunctionExpression()) {      
        handleFunctionExpressionsAndArrowFunctions(path, state, filePath);      
      } else if (path.isClassDeclaration()) {      
        handleClassComponent(path, state, filePath);      
      } else if (path.isImportDeclaration()) {      
        handleImportDeclaration(path, state, filePath);      
      } else if (path.isExportNamedDeclaration() || path.isExportDefaultDeclaration()) {      
        handleExportDeclarations(path, state, filePath);      
      } else if (path.isTSTypeAliasDeclaration()) {      
        handleTSTypeAliasDeclaration(path, state, filePath);
      }
      else if (path.isTSEnumDeclaration()) {    
          handleTSEnumDeclaration(path, state, filePath);    
      }
      else if(path.isInterfaceDeclaration()) {
          handleInterfaceDeclaration(path, state, filePath);
      } else if (path.isCallExpression()) {      
        handleHooksAndEffects(path, state, filePath);      
      } else if (path.isTaggedTemplateExpression()) {      
        handleStyledComponent(path, state, filePath);      
      }    
          
      // Track various function types    
      if (['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression', 'ClassMethod'].includes(path.node.type)) {    
        sections[path.node.type].push(nodeDetails);    
      }    
      
      // Check if the state has any errors      
      if (state.functionComponentState.hasErrors || state.topLevelState.hasErrors) {      
        nodeDetails.hasError = true;      
        console.log('Error detected:', path.node.type);      
      }      
      
      sections.nodes.push(nodeDetails);      
    },      
    ImportDeclaration(path) {      
      sections.imports.push({      
        type: path.node.type,      
        loc: path.node.loc,      
        code: generate(path.node).code,      
        hasError: false      
      });      
      path.remove();      
    },      
    VariableDeclaration(path) {      
      const details = {      
        type: path.node.type,      
        loc: path.node.loc,      
        code: generate(path.node).code,      
        hasError: false      
      };      
      if (isGlobalConstant(path)) {      
        sections.constants.push(details);      
      } else if (isLocalConstant(path)) {      
        const parentFunction = path.getFunctionParent();      
        if (parentFunction) {      
          const functionBodyNode = parentFunction.node.body;      
          if (sections.localConstants.has(functionBodyNode)) {      
            sections.localConstants.get(functionBodyNode).push(details);      
          } else {      
            sections.localConstants.set(functionBodyNode, [details]);      
          }      
        } else {      
          sections.constants.push(details);      
        }      
      } else if (isContextCreation(path)) {      
        sections.contexts.push(details);      
      } else {      
        sections.constants.push(details);      
      }      
      path.remove();      
    },      
    TSTypeAliasDeclaration(path) {      
      sections.types.push({      
        type: path.node.type,      
        loc: path.node.loc,      
        code: generate(path.node).code,      
        hasError: false      
      });      
      path.remove();      
    },      
    TSInterfaceDeclaration(path) {      
      sections.types.push({      
        type: path.node.type,      
        loc: path.node.loc,      
        code: generate(path.node).code,      
        hasError: false      
      });      
      path.remove();      
    },      
    TSEnumDeclaration(path) {      
      sections.enums.push({    
        type: path.node.type,      
        loc: path.node.loc,      
        code: generate(path.node).code,      
        hasError: false      
      });      
      path.remove();      
    },      
    FunctionDeclaration(path) {      
      const details = {      
        type: path.node.type,      
        loc: path.node.loc,      
        name: path.node.id.name,      
        code: generate(path.node).code,      
        hasError: false      
      };      
      if (isMainFunctionComponent(path, {}, getMainComponentNameFromFileName(filePath))) {      
        sections.mainComponent = details;      
      } else {      
        sections.helperFunctions.push(details);      
      }      
      path.remove();      
    },      
    ArrowFunctionExpression(path) {      
      const details = {      
        type: path.node.type,      
        loc: path.node.loc,      
        name: path.parent.id ? path.parent.id.name : null,      
        code: generate(path.node).code,      
        hasError: false      
      };      
      if (isReactComponent(path.parentPath) && path.parentPath.isVariableDeclarator()) {      
        if (isMainFunctionComponent(path.parentPath, {}, getMainComponentNameFromFileName(filePath))) {      
          sections.mainComponent = details;      
        } else {      
          sections.components.push(details);      
        }      
      } else if (isCustomHook(path.parentPath)) {      
        sections.helperFunctions.push(details);      
      } else {      
        sections.helperFunctions.push(details);      
      }      
      path.parentPath.remove();      
    },      
    ClassDeclaration(path) {      
      const details = {      
        type: path.node.type,      
        loc: path.node.loc,      
        name: path.node.id.name,      
        code: generate(path.node).code,      
        hasError: false      
      };      
      if (isClassComponent(path)) {      
        sections.classComponents.push(details);      
      } else {      
        sections.helperFunctions.push(details);      
      }      
      path.remove();      
    },      
    ExportNamedDeclaration(path) {      
      sections.exports.push({      
        type: path.node.type,      
        loc: path.node.loc,      
        code: generate(path.node).code,      
        hasError: false      
      });      
      path.remove();      
    },      
    ExportDefaultDeclaration(path) {      
      sections.exports.push({      
        type: path.node.type,      
        loc: path.node.loc,      
        code: generate(path.node).code,      
        hasError: false      
      });      
      path.remove();      
    },      
  });      
      
  return sections;      
}  
const runApp = async (sections) => {  
  InkComponents = await loadInk();  
  InkComponents.render(React.createElement(App, { sections }));  
};   

  




// ---------------------- Revert fix option ----------------------
const backupDir = 'backup';  
  

  


  


// Export the necessary functions for use in structure-check-terminal.js  


function truncateLabel(label, maxLength = 15) {  
  return label.length > maxLength ? label.substring(0, maxLength - 3) + '...' : label;  
}  


let InkComponents;  
  
// Function to handle selection and display detailed code information  
function handleSelect(item, sections) {  
  console.clear();  
  console.log(`Selected: ${item.label}`);  
  
  const sectionNodes = sections[item.value] || [];  
  
  sectionNodes.forEach(node => {  
    const location = node.loc && node.loc.start  
      ? `Line ${node.loc.start.line}, Column ${node.loc.start.column}`  
      : 'Location information not available';  
  
    const output = [  
      `\n#### Node Type: ${node.type}`,  
      `- **Location:** ${location}`,  
      node.name ? `- **Name:** ${node.name}` : '',  
      `- **Code:**\n\`\`\`javascript\n${node.code || 'Code not available'}\n\`\`\`` // Handle case where code is not available  
    ].filter(Boolean).join('\n');  
  
    if (node.hasError || node.message) { // Check for error messages  
      console.error(output);  
      if (node.message) {  
        console.error(`- **Error Message:** ${node.message}`);  
      }  
    } else {  
      console.log(output);  
    }  
  });  
}  

  
const App = ({ sections }) => {    
  const items = [    
    { label: 'Imports', value: 'imports' },    
    { label: 'Constants', value: 'constants' },    
    { label: 'Contexts', value: 'contexts' },    
    { label: 'Hooks', value: 'hooks' },    
    { label: 'Helper Functions', value: 'helperFunctions' },    
    { label: 'Components', value: 'components' },    
    { label: 'Class Components', value: 'classComponents' },    
    { label: 'Main Component', value: 'mainComponent' },    
    { label: 'Types', value: 'types' },    
    { label: 'Exports', value: 'exports' }    
  ];    
    
  // Function to check if a section has problems    
  const hasProblems = (section) => {    
    // Implement your logic to check if there are problems in the section    
    // For now, let's assume sections with more than 0 items have problems    
    return sections[section] && sections[section].length > 0;    
  };    
    
  // Add badges to items    
  const itemsWithBadges = items.map(item => ({    
    ...item,    
    label: hasProblems(item.value) ? `🔴 ${item.label}` : `🟢 ${item.label}` // Red dot for problems, green dot for no problems    
  }));    
    
  return (    
    React.createElement(    
      InkComponents.Box,    
      { flexDirection: 'column', padding: 1 },    
      React.createElement(InkComponents.Text, { color: 'green' }, 'Select an option to view detailed analysis:'),    
      React.createElement(    
        InkComponents.SelectInput, // Use InkComponents.SelectInput here    
        {    
          items: itemsWithBadges,    
          onSelect: item => handleSelect(item, sections),    
        }    
      )    
    )    
  );    
};   
  
const { fix, revert, analyze, help, filePath, displayLevel, language } = parseCommandLineArguments();  
  
if (help) {  
  displayHelp(language);  
} else if (revert) {  
  revertProjectStructure(filePath);  
} else if (fix) {  
  fixProjectStructure(filePath);  
} else if (analyze) {  
  if (filePath) {  
    analyzeFile(filePath, displayLevel);  
  } else {  
    /// Not implemented in the refactor
    analyzeAllFiles(displayLevel);  
  }  
}

// ---------------------- Disabled functions ----------------------

/**
 * checkHoistingAwareness returns a list of issues related to hoisting. The function checks for three main problems related to hoisting:
 * Usage of var that could lead to unexpected behavior due to function-wide scoping.
 * Function declarations within blocks which, while valid in modern JavaScript, may lead to unpredictable behavior when transpiled for older environments that only support hoisting to the top of the containing function or global scope.
 * Function expressions invoiced before defining assignments, which are not hoisted like function declarations, and could lead to a reference error if used prematurely.
 * Currently not activate since need more specification
function checkHoistingAwareness(path) {
  let issues = [];

  // Check for 'var' usage that could lead to hoisting issues
  if (path.node.kind === 'var') {
    // If 'var' is used, check where it's declared within the current function or globally
    let scopePath = path.scope.getFunctionParent() || path.scope.getProgramParent();
    if (scopePath && !isAtScopeTop(path, scopePath)) {
      issues.push({
        kind: 'var',
        message: 'Variable declared with "var" may be hoisted to the top of its function scope.',
        location: path.node.loc,
      });
    }
  }

  // Check for function declarations within blocks, which might lead to confusing behavior in pre-ES6 environments
  if (path.parentPath.isBlockStatement()) {
    let siblings = path.parentPath.container;
    for (let sibling of siblings) {
      if (sibling.type === 'FunctionDeclaration') {
        issues.push({
          kind: 'function',
          message: 'Function declarations in blocks are hoisted to the function scope and can lead to unexpected behaviors in pre-ES6 environments.',
          location: sibling.loc,
        });
      }
    }
  }

  // Check for function expressions used before their defining assignment, similar to var
  path.scope.traverse(path.node, {
    Identifier(identifierPath) {
      if (isUsedBeforeDefined(identifierPath, path)) {
        issues.push({
          kind: 'function-expression',
          message: 'Function expression used before its defining assignment can lead to undefined function errors.',
          location: identifierPath.node.loc,
        });
      }
    }
  });

  return issues;
}

function isAtScopeTop(variablePath, scopePath) {
  // Check if this variablePath is the first statement within scopePath's block
  let body = scopePath.node.body;
  return Array.isArray(body) ? body[0] === variablePath.node : body === variablePath.node;
}

function isUsedBeforeDefined(identifierPath, variableDeclaratorPath) {
  if (identifierPath.node.name !== variableDeclaratorPath.node.id.name) {
    return false; // Different variable, ignore
  }

  let binding = identifierPath.scope.getBinding(identifierPath.node.name);
  if (!binding || binding.kind !== 'var' || binding.path.type !== 'VariableDeclaration') {
    return false; // Not a function expression or not var binding
  }

  let bindingIdentifiers = binding.path.getBindingIdentifiers();
  if (bindingIdentifiers[identifierPath.node.name] !== identifierPath.node) {
    return false; // The binding is not connected to this identifier
  }

  // Check the position in the code to determine if it's being used before the declaration
  let bindingPosition = binding.path.node.start;
  let usagePosition = identifierPath.node.start;
  return usagePosition < bindingPosition;
}

// A placeholder for reporting the issues found; implement it as needed
function reportHoistingIssues(issues) {
  issues.forEach((issue) => {
    console.warn(`${issue.kind} hoisting issue: ${issue.message} at line ${issue.location.start.line}, column ${issue.location.start.column}`);
  });
}

// Usage example
const issues = checkHoistingAwareness(someVariablePath);
if (issues.length > 0) {
  reportHoistingIssues(issues);
}
*/

/**
 * This checkExported function does the following:
 * Starts by checking whether the VariableDeclarator is a direct child of an ExportNamedDeclaration or ExportDefaultDeclaration.
 * If the variable is not immediately exported, it searches for a named export that matches the variable's name. This is necessary for cases where variables are first declared inside the module and then exported within an export specifier list.
 * If the name wasn't found in a named export, it checks for a separate default export statement that may match the variable name. This is for cases where the variable is exported default after declaration.
 * Not working currently causing some errors
 * /
function checkExported(path) {
  
  // Ensure the `path` has a valid `id` before proceeding.
  if (!path.get('id').node) {
    console.error('The path does not have an id node.');
    return false;
  }
  
  // Retrieve the variable name from the path.
  const variableName = path.get('id').node.name;  // This line should be at the start of the function

  // First, check if the VariableDeclarator's parent is an ExportNamedDeclaration or ExportDefaultDeclaration.
  let isExported = path.findParent((p) =>
    p.isExportNamedDeclaration() || p.isExportDefaultDeclaration()
  ) !== null;

  // No need to check further if `isExported` is already true.
  if (isExported) {
    return true;
  }

  // Retrieve the program path to iterate over all body nodes.
  const programPath = path.scope.getProgramParent().path;
  const bodyNodes = programPath.node.body;

  // Check if the variable is exported in any named export declarations.
  for (const node of bodyNodes) {
    if (node.type === 'ExportNamedDeclaration' && node.specifiers) {
      for (const specifier of node.specifiers) {
        if (specifier.exported.name === variableName) {
          return true;  // Variable is exported.
        }
      }
    }
  }

  // Check for default export that may refer to our variable.
  for (const node of bodyNodes) {
    if (node.type === 'ExportDefaultDeclaration') {
      const declaration = node.declaration;
      // Checking for different possible default export types.
      if ((declaration.type === 'Identifier' && declaration.name === variableName) ||
          (declaration.type === 'VariableDeclarator' && declaration.id.name === variableName)) {
        return true;  // Variable is the default export.
      }
    }
  }

  // Variable is not exported if none of the above checks return true.
  return false;
}
*/