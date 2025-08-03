import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, List, User, Headphones } from "lucide-react";

const navigationItems = [
  {
    href: "/",
    icon: Home,
    label: "الرئيسية",
  },
  {
    href: "/orders",
    icon: List,
    label: "طلباتي",
  },
  {
    href: "/profile",
    icon: User,
    label: "الملف الشخصي",
  },
  {
    href: "/support",
    icon: Headphones,
    label: "الدعم",
  },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={cn(
                    "flex flex-col items-center py-2 px-4 transition-colors",
                    isActive
                      ? "text-blue-600"
                      : "text-gray-400 hover:text-blue-600"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
