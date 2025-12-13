import { Home, Utensils, Camera, Apple, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Trang chủ", path: "/dashboard" },
  { icon: Utensils, label: "Kế hoạch", path: "/my-meal-plans" },
  { icon: Camera, label: "Quét", path: "/health-tools", highlight: true },
  { icon: Apple, label: "Dinh dưỡng", path: "/nutrition-tracking" },
  { icon: User, label: "Hồ sơ", path: "/profile" },
];

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-card border-t border-border/50 px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            if (item.highlight) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center -mt-6"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-smooth active-scale",
                    "bg-primary text-primary-foreground",
                    isActive && "shadow-glow"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={cn(
                    "text-[10px] mt-1 font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center py-1 px-3 tap-highlight"
              >
                <div className={cn(
                  "p-2 rounded-xl transition-smooth",
                  isActive ? "bg-primary/10" : "bg-transparent"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] mt-0.5 font-medium",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
