import { Button } from "./ui/button";
import { Clock } from "lucide-react";
import { MailIcon } from "lucide-react";
import { Mail } from "@/types/mail";

interface ReplyAreaProps {
  selectedEmail: Mail;
}

export function ReplyArea({ selectedEmail }: ReplyAreaProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {selectedEmail.date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </header>
      <div className="flex-1 overflow-auto">
        <div className="h-full w-full">
          <div className="mx-auto h-full w-full px-6 py-6">
            <div className="mb-6">
              <h1 className="mb-2 text-2xl font-bold">
                {selectedEmail.subject}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MailIcon className="h-4 w-4" />
                <span>
                  From: {selectedEmail.name} &lt;{selectedEmail.email}&gt;
                </span>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p>{selectedEmail.text}</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="border-t bg-background">
        <div className="w-full px-6 py-4">
          <div className="flex flex-col gap-4">
            <textarea
              placeholder="Type your reply..."
              className="min-h-[150px] w-full resize-none rounded-lg border bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline">Reply With AI</Button>
              <Button variant="outline">Discard</Button>
              <Button>Send Reply</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
