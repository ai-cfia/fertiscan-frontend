import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inspection details",
};

function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}

export default layout;
