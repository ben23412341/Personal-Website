import { AboutSection } from "@/components/site/about-section";
import { AchievementsSection } from "@/components/site/achievements-section";
import { ExperienceSection } from "@/components/site/experience-section";
import { Hero } from "@/components/site/hero";
import { WorkSection } from "@/components/site/work-section";

export default function Home() {
  return (
    <main className="flex-1 bg-black">
      <Hero />
      <AboutSection />
      <WorkSection />
      <ExperienceSection />
      <AchievementsSection />
      {/* Contact section lands here next. */}
    </main>
  );
}
