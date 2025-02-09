"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { MailList } from "@/components/mail-list";
import { Search } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ReplyArea } from "@/components/reply-area";
import { useState, useCallback, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Mail } from "@/types/mail";

const sampleEmails: Mail[] = [
  {
    id: "1",
    name: "William Smith",
    subject: "Meeting Tomorrow",
    text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.",
    date: new Date("2024-02-09T09:00:00"),
    read: false,
    labels: ["meeting", "work", "important"],
    email: "william.smith@example.com",
  },
  {
    id: "2",
    name: "Alice Smith",
    subject: "Re: Project Update",
    text: "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. Keep up the good work!",
    date: new Date("2024-02-08T15:30:00"),
    read: true,
    labels: ["work", "important"],
    email: "alice.smith@example.com",
  },
  {
    id: "3",
    name: "Bob Johnson",
    subject: "Weekend Plans",
    text: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If you're interested, let me know and we can plan something.",
    date: new Date("2024-02-08T11:00:00"),
    read: true,
    labels: ["personal"],
    email: "bob.johnson@example.com",
  },
];

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedEmail, setSelectedEmail] = useState<Mail | null>(null);
  const [activeSection, setActiveSection] = useState(
    searchParams.get("section") || "all-mails"
  );
  const defaultLayout = [20, 30, 50];

  const handleSectionChange = useCallback(
    (section: string) => {
      setActiveSection(section);
      setSelectedEmail(null);
      router.push(`/dashboard?section=${section}`);
    },
    [router]
  );

  const handleEmailClick = useCallback((email: Mail) => {
    setSelectedEmail(email);
  }, []);

  const filteredEmails = useMemo(() => {
    switch (activeSection) {
      case "first-2-mails":
        return sampleEmails.slice(0, 2);
      case "last-2-mails":
        return sampleEmails.slice(-2);
      default:
        return sampleEmails;
    }
  }, [activeSection]);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  return (
    <SidebarProvider>
      <div className="grid h-screen grid-cols-[auto_1fr]">
        <AppSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
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
                    items={filteredEmails}
                    onEmailClick={handleEmailClick}
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
