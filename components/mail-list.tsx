"use client";

import { ComponentProps } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail } from "@/types/mail";

interface MailListProps {
  items: Mail[];
  onEmailClick: (email: Mail) => void;
}

export function MailList({ items, onEmailClick }: MailListProps) {
  return (
    <ScrollArea className="flex-1 overflow-y-auto h-[calc(100vh-100px)]">
      <div className="flex flex-col">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 border-b p-4 text-left text-sm transition-all hover:bg-muted/50",
              !item.read && "bg-muted/30"
            )}
            onClick={() => onEmailClick(item)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.name}</div>
                  {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDistanceToNow(item.date, { addSuffix: true })}
                </div>
              </div>
              <div className="text-sm font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-sm text-muted-foreground">
              {item.text}
            </div>
            {item.labels?.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
