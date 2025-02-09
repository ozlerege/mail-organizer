"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MailList } from "@/components/mail-list";
import { Search } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReplyArea } from "@/components/reply-area";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface Mail {
  id: string;
  name: string;
  subject: string;
  text: string;
  date: Date;
  read: boolean;
  labels: string[];
  email?: string;
}

const sampleEmails = [
  {
    id: "1",
    name: "William Smith",
    subject: "Meeting Tomorrow",
    text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.",
    date: new Date("2024-02-09T09:00:00"),
    read: false,
    labels: ["meeting", "work", "important"],
  },
  {
    id: "2",
    name: "Alice Smith",
    subject: "Re: Project Update",
    text: "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. Keep up the good work!",
    date: new Date("2024-02-08T15:30:00"),
    read: true,
    labels: ["work", "important"],
  },
  {
    id: "3",
    name: "Bob Johnson",
    subject: "Weekend Plans",
    text: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If you're interested, let me know and we can plan something.",
    date: new Date("2024-02-08T11:00:00"),
    read: true,
    labels: ["personal"],
  },
  {
    id: "4",
    name: "Bob Johnson",
    subject: "Weekend Plans",
    text: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If you're interested, let me know and we can plan something.",
    date: new Date("2024-02-08T11:00:00"),
    read: true,
    labels: ["personal"],
  },
  {
    id: "5",
    name: "Bob Johnson",
    subject: "Weekend Plans",
    text: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If you're interested, let me know and we can plan something.",
    date: new Date("2024-02-08T11:00:00"),
    read: true,
    labels: ["personal"],
  },
  {
    id: "6",
    name: "Bob Johnson",
    subject: "Weekend Plans",
    text: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If you're interested, let me know and we can plan something.",
    date: new Date("2024-02-08T11:00:00"),
    read: true,
    labels: ["personal"],
  },
];

export default function DashboardPage() {
  const [selectedEmail, setSelectedEmail] = useState<Mail | null>(null);
  const defaultLayout = [20, 30, 50];

  return (
    <SidebarProvider>
      <div className="grid h-screen grid-cols-[auto_1fr]">
        <AppSidebar />
        <SidebarInset>
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full rounded-lg"
          >
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
              <div className="flex h-full flex-col">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <div className="relative w-full">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search emails..."
                      className="w-full pl-8"
                    />
                  </div>
                </header>
                <div className="flex-1 overflow-hidden">
                  <MailList
                    items={sampleEmails}
                    onEmailClick={(email) => setSelectedEmail(email)}
                  />
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
              {selectedEmail ? (
                <ReplyArea selectedEmail={selectedEmail} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Select an email to view
                  </p>
                </div>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
