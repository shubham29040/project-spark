import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SafetyGuide from "@/components/SafetyGuide";
import PageTransition from "@/components/PageTransition";

const SafetyPage = () => {
  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1">
          <SafetyGuide />
        </div>
        <Footer />
      </main>
    </PageTransition>
  );
};

export default SafetyPage;
