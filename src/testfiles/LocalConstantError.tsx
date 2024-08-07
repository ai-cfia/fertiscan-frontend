// IncorrectLocalConstantOrder.tsx

function LocalConstantError() {

  
    function innerFunction() {
      console.log('This should not appear before a local constant.');
    }

    // Local constant defined after a function inside, which is incorrect as per rules
    const someValue = 5;
  
    return innerFunction;
  }