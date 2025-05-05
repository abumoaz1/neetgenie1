import React, { useState } from "react";
import { 
  BookOpen, 
  History, 
  FileText, 
  BarChart, 
  ChevronLeft, 
  ChevronRight,
  Home,
  Bot,
  CalendarCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
  isActive?: boolean;
};

const SidebarItem = ({ icon, label, href, isCollapsed, isActive }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center py-3 px-4 rounded-lg transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted text-foreground hover:text-foreground",
        isCollapsed ? "justify-center" : "gap-3"
      )}
    >
      <div>{icon}</div>
      {!isCollapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

export default function Sidebar({ className }: { className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "h-full border-r bg-background transition-all duration-300 flex flex-col",
      isCollapsed ? "w-[70px]" : "w-[240px]",
      className
    )}>
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h2 className="font-semibold text-lg">NEET Genie</h2>}
        <button 
          onClick={toggleSidebar} 
          className="rounded-full p-1 hover:bg-muted transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <div className="flex-1 py-4 px-2 space-y-2 overflow-y-auto">
        <SidebarItem 
          icon={<Home size={20} />} 
          label="Dashboard" 
          href="/dashboard" 
          isCollapsed={isCollapsed}
          isActive={pathname === "/dashboard"}
        />
        <SidebarItem 
          icon={<History size={20} />} 
          label="History" 
          href="/dashboard/history" 
          isCollapsed={isCollapsed}
          isActive={pathname?.includes("/dashboard/history")}
        />
        <SidebarItem 
          icon={<BookOpen size={20} />} 
          label="Study Materials" 
          href="/study-materials" 
          isCollapsed={isCollapsed}
          isActive={pathname?.includes("/study-materials")}
        />
        <SidebarItem 
          icon={<FileText size={20} />} 
          label="Mock Tests" 
          href="/mock-tests" 
          isCollapsed={isCollapsed}
          isActive={pathname?.includes("/mock-tests")}
        />
        <SidebarItem 
          icon={<CalendarCheck size={20} />} 
          label="Study Plans" 
          href="/study-plans" 
          isCollapsed={isCollapsed}
          isActive={pathname?.includes("/study-plans")}
        />
        <SidebarItem 
          icon={<BarChart size={20} />} 
          label="Analytics" 
          href="/dashboard/analytics" 
          isCollapsed={isCollapsed}
          isActive={pathname?.includes("/dashboard/analytics")}
        />
        
        {/* AI Assistant Item - Now navigates to a dedicated page */}
        <SidebarItem 
          icon={<Bot size={20} />}
          label="AI Assistant"
          href="/assistant"
          isCollapsed={isCollapsed}
          isActive={pathname?.includes("/assistant")}
        />
      </div>
    </div>
  );
}