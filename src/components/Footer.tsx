import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-hero text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8" />
              <span className="text-2xl font-bold">DisasterSense</span>
            </div>
            <p className="text-blue-100">
              AI-powered natural disaster early warning system keeping communities safe worldwide.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-blue-100">
              <li><a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#safety" className="hover:text-white transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
            <ul className="space-y-2 text-blue-100">
              <li><strong>Emergency:</strong> 112</li>
              <li><strong>Ambulance:</strong> 108</li>
              <li><strong>Fire:</strong> 101</li>
              <li><strong>Police:</strong> 100</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-blue-100">
          <p>&copy; {new Date().getFullYear()} DisasterSense. All rights reserved. Stay Safe, Stay Informed.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
