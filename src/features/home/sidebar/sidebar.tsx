"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconHome, IconSettings, IconUser } from "@tabler/icons-react";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const links = [
    {
      label: "Home",
      href: "/",
      icon: <IconHome className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <IconUser className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />,
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar>
        <SidebarBody>
          <div className="flex flex-col gap-2">
            {links.map((link, i) => (
              <SidebarLink key={i} link={link} />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}