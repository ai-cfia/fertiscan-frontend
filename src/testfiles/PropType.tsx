// IncorrectPropTypesOrder.tsx

import React from 'react';


function PropType(props: ComponentProps) {
  return <div>{props.message}</div>;
}
// Prop types defined after a component (Incorrect as per rules)
type ComponentProps = {
  message: string;
};

const test = 'test';


export default PropType;