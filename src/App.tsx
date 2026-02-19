import { useState } from 'react';
import {
  LayoutDashboard,
  PawPrint,
  Users,
  Calendar,
  Phone,
  Mail,
  Mic,
  Menu,
  X,
  Heart,
  Stethoscope,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import DashboardOverview from '@/sections/DashboardOverview';
import ClientDashboard from '@/sections/ClientDashboard';
import PetRecords from '@/sections/PetRecords';
import AppointmentManagement from '@/sections/AppointmentManagement';
import CallLogs from '@/sections/CallLogs';
import EmailTemplates from '@/sections/EmailTemplates';
import VoiceSimulator from '@/sections/VoiceSimulator';

export type ViewType =
  | 'dashboard'
  | 'pets'
  | 'clients'
  | 'appointments'
  | 'calls'
  | 'emails'
  | 'voice';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pets', label: 'Pet Records', icon: PawPrint },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'appointments', label: 'Appointments', icon: Calendar, badge: '3' },
  { id: 'calls', label: 'Call Logs', icon: Phone },
  { id: 'emails', label: 'Email Templates', icon: Mail },
  { id: 'voice', label: 'Voice Call', icon: Mic },
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    setMobileOpen(false);
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Heart className="h-5 w-5 text-primary-foreground" />
        </div>
        {(!sidebarCollapsed || isMobile) && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg leading-tight tracking-tight">Paw & Care</h1>
            <p className="text-xs text-muted-foreground">VetAssist AI</p>
          </div>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3 h-10',
                  isActive && 'bg-primary/10 text-primary font-medium',
                  sidebarCollapsed && !isMobile && 'justify-center px-2'
                )}
                onClick={() => handleNavigate(item.id)}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {(!sidebarCollapsed || isMobile) && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs h-5 px-1.5">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Footer */}
      <div className="p-4">
        {(!sidebarCollapsed || isMobile) ? (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium">Luna</p>
              <p className="text-xs text-green-600">AI Active 24/7</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview onNavigate={handleNavigate} />;
      case 'pets':
        return <PetRecords />;
      case 'clients':
        return <ClientDashboard />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'calls':
        return <CallLogs />;
      case 'emails':
        return <EmailTemplates />;
      case 'voice':
        return <VoiceSimulator />;
      default:
        return <DashboardOverview onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r bg-card transition-all duration-300',
          sidebarCollapsed ? 'w-[68px]' : 'w-[260px]'
        )}
      >
        <SidebarContent />
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
          </Button>
        </div>
      </aside>

      {/* Mobile Header & Sheet */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SidebarContent isMobile />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-bold">Paw & Care</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-7xl p-6">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}
