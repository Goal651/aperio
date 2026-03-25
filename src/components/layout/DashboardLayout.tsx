import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
 
       {/* Desktop Sidebar */}
       <Sidebar className="hidden md:flex" />
 
       {/* Mobile Header & Sidebar */}
       <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-xl z-50 flex items-center px-4 justify-between">
         <div className="flex items-center gap-2">
           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 overflow-hidden">
             <img src="/icon.png" alt="Kordian Logo" className="h-full w-full object-cover" />
           </div>
           <span className="font-semibold text-foreground tracking-tight">Kordian</span>
         </div>
         <div className="flex items-center gap-2">
           <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
             <SheetTrigger asChild>
               <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
                 <Menu className="h-5 w-5" />
               </Button>
             </SheetTrigger>
             <SheetContent side="left" className="p-0 w-72 border-r border-border/50">
               <Sidebar className="w-full h-full border-none relative" onNavigate={() => setSidebarOpen(false)} />
             </SheetContent>
           </Sheet>
         </div>
       </div>
 
       <main className="md:ml-64 min-h-screen pt-16 md:pt-0 transition-all duration-300">
         <div className="hero-glow fixed inset-0 pointer-events-none opacity-50" />
 
         <div className="relative p-4 md:p-8 w-full max-w-7xl mx-auto">
           {children}
         </div>
       </main>
     </div>
  );
}
