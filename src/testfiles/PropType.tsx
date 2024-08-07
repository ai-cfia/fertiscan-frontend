// IncorrectPropTypesOrder.tsx

import React from 'react';

// Prop types defined after a component (Incorrect as per rules)
type ComponentProps = {
  message: string;
};

export function Component(props: ComponentProps) {
  return <div>{props.message}</div>;
}