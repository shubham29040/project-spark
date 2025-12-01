import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Features from "@/components/Features";
import PageTransition from "@/components/PageTransition";

const FeaturesPage = () => {
  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1">
          <Features />
        </div>
        <Footer />
      </main>
    </PageTransition>
  );
};

export default FeaturesPage;
