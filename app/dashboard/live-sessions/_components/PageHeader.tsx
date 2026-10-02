import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function PageHeader() {
  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Live Sessions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Join your live classes, view schedule, and access recordings
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-slate-500" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-teal-500 text-xs font-semibold text-white">
              HS
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium text-slate-800 sm:inline">
            Harsh Singh
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
