// IncorrectTypeAliasOrder.tsx

import React from 'react';

export function Component() {
  return <div />;
}

// Type alias defined after a component
type Props = {
  message: string;
};