import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS } from "../data";

export function SessionTabs() {
  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl border bg-white p-1 sm:w-auto">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-lg px-6 py-2 text-sm text-slate-700 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-none"
          >
            {tab.live && <span className="mr-2 h-2 w-2 rounded-full bg-red-500" />}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}