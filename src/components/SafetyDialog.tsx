import { Shield, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";

interface SafetyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  disasterType: string;
  level: string;
}

const SafetyDialog = ({ isOpen, onClose, disasterType, level }: SafetyDialogProps) => {
  const guidelines: Record<string, string[]> = {
    Flood: [
      "Move to higher ground immediately",
      "Avoid walking or driving through flood waters",
      "Disconnect electrical appliances and turn off utilities",
      "Keep emergency supplies ready (water, food, first aid)",
      "Stay informed via emergency broadcasts",
    ],
    Heatwave: [
      "Stay indoors during peak heat hours (12 PM - 4 PM)",
      "Drink plenty of water even if not thirsty",
      "Wear light-colored, loose-fitting clothing",
      "Check on elderly and vulnerable neighbors",
      "Never leave children or pets in vehicles",
    ],
    "Air Quality": [
      "Stay indoors and keep windows closed",
      "Use air purifiers if available",
      "Wear N95 masks when going outside",
      "Avoid outdoor exercise and strenuous activities",
      "Monitor air quality index regularly",
    ],
    Storm: [
      "Secure loose outdoor items",
      "Stay away from windows and glass doors",
      "Unplug electrical appliances",
      "Have flashlights and batteries ready",
      "Identify the safest room in your home",
    ],
  };

  const items = guidelines[disasterType] || [];

  const getLevelColor = (level: string) => {
    return level === "High"
      ? "bg-destructive text-destructive-foreground"
      : "bg-warning text-warning-foreground";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <DialogTitle className="text-2xl">{disasterType} Safety Protocol</DialogTitle>
                <DialogDescription>Follow these steps to stay safe</DialogDescription>
              </div>
            </div>
            <Badge className={getLevelColor(level)}>{level} Risk</Badge>
          </div>
        </DialogHeader>
        <div className="mt-4">
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 p-4 bg-muted rounded-lg border border-border"
              >
                <AlertCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Emergency Services
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><strong>Emergency:</strong> 112</p>
            <p><strong>Ambulance:</strong> 108</p>
            <p><strong>Fire:</strong> 101</p>
            <p><strong>Police:</strong> 100</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SafetyDialog;