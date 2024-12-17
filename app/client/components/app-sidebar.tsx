"use client";

import { Home, ChartArea, CircleDollarSign } from "lucide-react";
import { usePathname } from "next/navigation";
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

const items = [
  {
    title: "Introduction",
    url: "/",
    icon: Home,
  },
  {
    title: "Data Visualization",
    url: "/visualization",
    icon: ChartArea,
  },
  {
    title: "Price Predictor",
    url: "/price_predictor",
    icon: CircleDollarSign,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="!border-slate-700">
      <SidebarContent className="!bg-[#060B10] !border-none">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3 mt-3">Nitro AI</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`
                      hover:!bg-slate-500/5 
                      !text-slate-200 
                      !py-5
                      ${
                        pathname === item.url
                          ? "!bg-indigo-500/40 hover:!bg-indigo-500/30"
                          : ""
                      }
                    `}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
