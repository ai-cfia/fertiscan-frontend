// IncorrectTypeAliasOrder.tsx

import React from 'react';

function AliasTypeError() {
  return <div />;
}

//disable-check
type Props = {
  message: string;
};

export default AliasTypeError;