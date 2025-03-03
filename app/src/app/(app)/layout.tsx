import React from "react";
import Header from "./_components/Header";

const layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default layout;
