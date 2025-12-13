import { useState } from "react";
import { Plus, X, Camera, Utensils, Droplets, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const actions = [
  { icon: Camera, label: "Quét thực phẩm", path: "/health-tools", color: "bg-primary" },
  { icon: Utensils, label: "Log bữa ăn", path: "/nutrition-tracking", color: "bg-secondary" },
  { icon: Droplets, label: "Log nước", path: "/water-tracking", color: "bg-info" },
  { icon: Scale, label: "Log cân nặng", path: "/weight-tracking", color: "bg-accent" },
];

export function QuickActionFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 hidden md:block">
      {/* Action buttons */}
      <div className={cn(
        "flex flex-col-reverse gap-3 mb-3 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {actions.map((action, index) => (
          <button
            key={action.path}
            onClick={() => handleAction(action.path)}
            className={cn(
              "group flex items-center gap-3 transition-all duration-200",
              "animate-scale-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="bg-card px-3 py-1.5 rounded-lg shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {action.label}
            </span>
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover-scale",
              action.color
            )}>
              <action.icon className="h-5 w-5" />
            </div>
          </button>
        ))}
      </div>

      {/* Main FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300",
          "bg-primary text-primary-foreground hover:shadow-glow active-scale",
          isOpen && "rotate-45 bg-destructive"
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/50 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
