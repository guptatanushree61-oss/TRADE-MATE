import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import logo from '@/assets/trademate-logo.png';
import {
  Home,
  BarChart3,
  Package,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  Bell,
  FileText,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

const mainItems = [
  { title: 'nav.home', url: '/', icon: Home },
  { title: 'nav.dashboard', url: '/dashboard', icon: BarChart3 },
  { title: 'nav.inventory', url: '/inventory', icon: Package },
  { title: 'nav.customers', url: '/customers', icon: Users },
  { title: 'nav.payments', url: '/payments', icon: CreditCard },
];

const businessItems = [
  { title: 'nav.orders', url: '/orders', icon: ShoppingCart },
  { title: 'nav.reports', url: '/reports', icon: FileText },
  { title: 'nav.analytics', url: '/analytics', icon: TrendingUp },
  { title: 'nav.notifications', url: '/notifications', icon: Bell },
  { title: 'Messages', url: '/messages', icon: Users },
];

const otherItems = [
  { title: 'nav.settings', url: '/settings', icon: Settings },
  { title: 'nav.help', url: '/help', icon: HelpCircle },
];

export function AppSidebar() {
  const { t } = useLanguage();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;
  
  const getNavClass = (path: string) => {
    return isActive(path) 
      ? 'bg-accent text-accent-foreground font-medium' 
      : 'hover:bg-accent/50 text-foreground hover:text-accent-foreground';
  };

  return (
    // On mobile the Sidebar component will render a Sheet overlay. For desktop use fixed width.
    <Sidebar className={`border-r transition-all duration-300 ${collapsed ? 'md:w-16 w-0' : 'md:w-64 w-0'}`}>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="TradeMate Logo" className={collapsed ? "h-8 md:h-8" : "h-8 md:h-10"} />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            {t('nav.main')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild className={getNavClass(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-2 px-3 py-2 rounded-lg transition-smooth">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{t(item.title)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            {t('nav.business')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild className={getNavClass(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-2 px-3 py-2 rounded-lg transition-smooth">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{t(item.title)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            {t('nav.other')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild className={getNavClass(item.url)}>
                    <NavLink to={item.url} className="flex items-center gap-2 px-3 py-2 rounded-lg transition-smooth">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{t(item.title)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="text-xs text-muted-foreground">
          {!collapsed && <p>{t('nav.version')} 1.0.0</p>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}