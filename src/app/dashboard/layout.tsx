import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * A functional component that serves as a layout wrapper for its children.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the layout.
 * @returns {JSX.Element} The rendered children elements.
 */
function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

export default layout;
