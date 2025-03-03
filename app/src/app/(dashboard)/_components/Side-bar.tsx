"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HomeIcon, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarBar = () => {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Dashboard"}
                isActive={pathname === "/dashboard"}
              >
                <Link href={"/dashboard"}>
                  <HomeIcon />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarBar;
