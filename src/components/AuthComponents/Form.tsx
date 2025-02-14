import React from "react";

const Form = ({
  className = "",
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>) => (
  <form
    {...props}
    className={`px-8 flex flex-col justify-between gap-4 ${className}`}
  />
);

export default Form;
