import FeaturedBooks from "@/components/FeaturedBooks";
import HeroBanner from "@/components/HerroBanner";

export default function HomePage() {
  return (
    <main>
      {/* আপনার হিরো সেকশন বা ব্যানার এখানে থাকবে */}
      <HeroBanner/>
      
      <FeaturedBooks />
      
      {/* অন্যান্য সেকশন... */}
    </main>
  );
}