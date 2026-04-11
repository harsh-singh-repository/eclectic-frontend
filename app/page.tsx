// app/(public)/page.tsx

import Navbar from "./_componet/Navbar";
import Landing from "./_componet/Home";
import SubjectGrid from "./_componet/SubjectGrid";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Landing/>
      <SubjectGrid/>
    </div>
  );
}