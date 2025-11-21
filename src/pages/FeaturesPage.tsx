import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Features from "@/components/Features";

const FeaturesPage = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <Features />
      </div>
      <Footer />
    </main>
  );
};

export default FeaturesPage;
