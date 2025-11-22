import { AlertTriangle, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import SafetyDialog from "./SafetyDialog";

interface AlertBannerProps {
  alerts: {
    type: string;
    level: string;
    message: string;
  }[];
  onDismiss: () => void;
}

const AlertBanner = ({ alerts, onDismiss }: AlertBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<{ type: string; level: string } | null>(null);

  if (!isVisible || alerts.length === 0) return null;

  const criticalAlerts = alerts.filter(a => a.level === "High");
  const warningAlerts = alerts.filter(a => a.level === "Moderate");

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  return (
    <>
      <SafetyDialog
        isOpen={selectedAlert !== null}
        onClose={() => setSelectedAlert(null)}
        disasterType={selectedAlert?.type || ""}
        level={selectedAlert?.level || ""}
      />
      <div className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top duration-500">
        {criticalAlerts.length > 0 && (
          <div className="bg-destructive text-destructive-foreground px-4 py-3 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <AlertTriangle className="w-5 h-5 animate-pulse flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">Critical Alert!</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {criticalAlerts.map((alert, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAlert({ type: alert.type, level: alert.level })}
                        className="text-sm underline hover:no-underline cursor-pointer"
                      >
                        {alert.message}
                        {index < criticalAlerts.length - 1 && " • "}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs mt-1 opacity-90">Click on alerts to view safety precautions</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-destructive-foreground hover:bg-destructive-foreground/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        {warningAlerts.length > 0 && criticalAlerts.length === 0 && (
          <div className="bg-warning text-warning-foreground px-4 py-3 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">Weather Warning</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {warningAlerts.map((alert, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAlert({ type: alert.type, level: alert.level })}
                        className="text-sm underline hover:no-underline cursor-pointer"
                      >
                        {alert.message}
                        {index < warningAlerts.length - 1 && " • "}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs mt-1 opacity-90">Click on alerts to view safety precautions</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-warning-foreground hover:bg-warning-foreground/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AlertBanner;
