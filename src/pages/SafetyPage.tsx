import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SafetyGuide from "@/components/SafetyGuide";

const SafetyPage = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <SafetyGuide />
      </div>
      <Footer />
    </main>
  );
};

export default SafetyPage;
