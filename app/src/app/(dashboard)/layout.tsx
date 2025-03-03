import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import SidebarBar from "./_components/Side-bar";
import Header from "./_components/Header";
import PageContainer from "@/components/page-container";

const layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <SidebarProvider>
        <SidebarBar />
        <SidebarInset>
          <Header />
          <PageContainer>{children}</PageContainer>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default layout;
