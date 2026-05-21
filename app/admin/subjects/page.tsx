
import { SubjectSheetProvider } from "@/components/subjects/SubjecrSheetContext";
import { SubjectsHeader } from "@/components/subjects/SubjectHeader";
import { SubjectsTable } from "@/components/subjects/SubjectTable";


export default function SubjectsPage() {
  return (
    <SubjectSheetProvider>
      <main className="min-h-screen">
        <div className="space-y-6">
          <SubjectsHeader/>
          <SubjectsTable/>
        </div>
      </main>
    </SubjectSheetProvider>
  );
}