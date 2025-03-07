
import Nav from "@/components/Navbar";
import MainSection from "@/components/MainSection";
import Aurora from "@/components/rb/Aurora/Aurora";

export default function Home() {
  return (
    <>
      <div className="bg-slate-800">
        <Nav />
        <div className="container absolute max-w-screen max-h-screen pointer-events-none z-0">
        <Aurora colorStops={["#3471eb", "#6ce65a", "#e65a5a"]} blend={0.5} amplitude={2.0} speed={0.7} />
        </div>
        <div className="relative">
        <MainSection />
        </div>
      </div>
    </>
  );
}
