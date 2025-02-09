import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { PlusIcon, MailIcon } from "lucide-react";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const sidebarItems = [
  {
    title: "Mail Sections",
    items: [
      {
        title: "All Mails",
        icon: <MailIcon className="mr-2 h-4 w-4" />,
        section: "all-mails",
      },
      {
        title: "First 2 Mails",
        icon: <MailIcon className="mr-2 h-4 w-4" />,
        section: "first-2-mails",
      },
      {
        title: "Last 2 Mails",
        icon: <MailIcon className="mr-2 h-4 w-4" />,
        section: "last-2-mails",
      },
    ],
  },
];

export function AppSidebar({
  activeSection,
  onSectionChange,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {sidebarItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeSection === item.section}
                    >
                      <button
                        className="flex w-full items-center px-2 py-1"
                        onClick={() => onSectionChange?.(item.section)}
                      >
                        {item.icon}
                        {item.title}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <div className="flex justify-center mt-4">
          <Button>
            <PlusIcon className="size-4" />
            Connect New Email
          </Button>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
