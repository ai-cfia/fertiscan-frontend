// IncorrectLocalConstantOrder.tsx

function LocalConstantError() {

    //disable-check
    function innerFunction() {
      console.log('This should not appear before a local constant.');
    }

    // Local constant defined after a function inside, which is incorrect as per rules
    //disable-check
    const someValue = 5;
  
    return innerFunction;
  }