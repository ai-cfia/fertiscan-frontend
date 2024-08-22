/**
 * Creates a state tracker to monitor changes in particular code analysis states.
 * 
 * This function initializes a state tracker object with predefined states for both top-level and
 * function component analysis. Each state represents a boolean indicating the presence of
 * particular code features. No initial state customization is supported.
 *
 * @function createStateTracker
 * @returns {Object} An object with two properties: `topLevelState` and `functionComponentState`.
 *                   Each property holds an object representing analysis states with boolean values.
 */
const createStateTracker = () => {  
    return {  
        topLevelState: {  
            hasImports: false,                              // Check for import statements in the file
            hasExports: false,                              // Check for import statements in the file
            hasGlobalConstants: false,                      // Check for constants used throughout the file  
            hasHelperFunctions: false,                      // Check for pure functions that are not React components  
            hasCustomHooks: false,                          // Check for hooks specific to the component but separated for reusability  
            hasStyledComponents: false,                     // Check for styled-components (this is marked as not implemented yet)  
            hasInterfaces: false,                           // Check for TypeScript interface definitions specific to the component  
            hasTypes: false,                                // Check for TypeScript type alias definitions specific to the component  
            hasEnums: false,                                // Check for TypeScript enum definitions specific to the component  
            hasMainComponent: false,                        // Check if the main React component is present  
            hasReactComponent: false,                       // Check if React components (besides the main one) are present  
            hasPropTypes: false,                            // Check for PropTypes definitions (if not using TypeScript)  
            hasDefaultProps: false,                         // Check for DefaultProps definitions (if not using TypeScript)  
        },  
        functionComponentState: {  
            hasConstants: false,                            // Check for local constants specific to the component  
            hasHandlers: false,                             // Check for handler functions  
            hasHooks: false,                                // Check if any React hooks are used  
            hasReturnInSameComponent: false,                // Check for return statement within the same React component, to ensure it is rendering JSX  
            insideReactComponent: false,                    // Flag to indicate if currently traversing inside React component  
            hasEncounteredOtherComponent: false,            // Check if other React components have been encountered (switched off if main component is found)  
            dontContainMainComponentSameNameAsFile: false,  // Check if there is no main component with the same name as the file  
            mainComponentPath: null,                        // Store path of the main component, if found  
            hasGlobalConstants: false,                      // Include top-level state checks for misplaced declarations   
            hasHelperFunctions: false,  
            hasCustomHooks: false,  
            hasStyledComponents: false,  
            hasInterfaces: false,  
            hasTypes: false,  
            hasEnums: false,  
            hasMainComponent: false,  
            hasReactComponent: false,  
            hasClassComponent: false,  
            hasPropTypes: false,  
            hasDefaultProps: false,  
        }  
    };  
};

/**
 * Sets the state properties to track that traversal has entered a React component context. It flags that the traversal
 * is currently within a React component and resets the flag for detecting multiple return statements in a single component.
 *
 * @param {State} state - The state object to be updated when entering a React component during AST traversal.
 */
const enterReactComponent = (state) => {  
    state.functionComponentState = {  
        ...state.functionComponentState,   
        hasReturnInSameComponent: false,  
        insideReactComponent: true,  
    };  
};  
  
/**
 * Updates the traversal state object to indicate that the AST traversal has exited the context of a React component. 
 * This assists in keeping track of when to apply React-specific checks and rules during code analysis.
 *
 * @param {State} state - The state object to be updated upon exiting a React component during AST traversal.
 */
const exitReactComponent = (state) => {  
    state.functionComponentState.insideReactComponent = false;  
};  
  
module.exports = {  
    createStateTracker,  
    enterReactComponent,  
    exitReactComponent,  
};  
