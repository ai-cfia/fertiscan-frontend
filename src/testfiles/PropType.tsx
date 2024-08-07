// IncorrectPropTypesOrder.tsx

import React from 'react';


function Component(props: ComponentProps) {
  return <div>{props.message}</div>;
}
// Prop types defined after a component (Incorrect as per rules)
type ComponentProps = {
  message: string;
};


export default Component;