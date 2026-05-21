// app/(public)/page.tsx

import Navbar from "./_component/Navbar";
import Landing from "./_component/Home";
import SubjectGrid from "./_component/SubjectGrid";
import EliteSection from "./_component/Elite20Section";
import CoursesSection from "./_component/CourseSection/CourseSection";
import HeroSection from "./_component/HeroSection";
import Elite20Section from "./_component/Elite20Section";
import OfferingsSection from "./_component/Offerings";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      {/* 3. Elite 20 + Why Elite 20 */}
      <Elite20Section />
      <CoursesSection />
      <SubjectGrid />
      <OfferingsSection/>
    </div>
  );
}