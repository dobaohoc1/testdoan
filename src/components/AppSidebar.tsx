import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Home, 
  User, 
  Calendar, 
  ChefHat, 
  Settings, 
  Shield,
  Users,
  BarChart3,
  FileText,
  Heart,
  LayoutDashboard,
  History,
  Camera,
  TrendingUp,
  Plus,
  Globe,
  Activity,
  ShoppingBag,
  Droplets,
  Scale,
  CreditCard,
  Apple,
  List
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

// Organized menu groups
const dashboardItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

const mealPlanItems = [
  { title: "Thực đơn của tôi", url: "/my-meal-plans", icon: Calendar },
  { title: "Tạo thực đơn", url: "/create-meal-plan", icon: Plus },
  { title: "Công thức", url: "/recipes", icon: ChefHat },
  { title: "Cộng đồng", url: "/community-recipes", icon: Globe },
  { title: "Nguyên liệu", url: "/ingredients", icon: Apple },
];

const nutritionItems = [
  { title: "Theo dõi dinh dưỡng", url: "/nutrition-tracking", icon: Heart },
  { title: "Quét thực phẩm AI", url: "/food-scanner", icon: Camera },
];

const healthItems = [
  { title: "Công cụ sức khỏe", url: "/health-tools", icon: Activity },
  { title: "Theo dõi cân nặng", url: "/weight-tracking", icon: Scale },
  { title: "Theo dõi nước uống", url: "/water-tracking", icon: Droplets },
];

const otherItems = [
  { title: "Danh sách mua sắm", url: "/shopping-list", icon: ShoppingBag },
  { title: "Gói đăng ký", url: "/my-subscription", icon: CreditCard },
];

const adminItems = [
  { title: "Dashboard Admin", url: "/admin", icon: Shield },
  { title: "Quản lý người dùng", url: "/admin?tab=users", icon: Users },
  { title: "Quản lý công thức", url: "/admin?tab=recipes", icon: ChefHat },
  { title: "Thống kê", url: "/admin?tab=analytics", icon: BarChart3 },
  { title: "Báo cáo", url: "/admin?tab=reports", icon: FileText },
  { title: "Danh mục bữa ăn", url: "/meal-categories", icon: List },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { isAdmin } = useUserRole();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar
      className={state === "collapsed" ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupLabel>Tổng quan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Meal Plans */}
        <SidebarGroup>
          <SidebarGroupLabel>Thực đơn</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mealPlanItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Nutrition */}
        <SidebarGroup>
          <SidebarGroupLabel>Dinh dưỡng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nutritionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Health */}
        <SidebarGroup>
          <SidebarGroupLabel>Sức khỏe</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {healthItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other */}
        <SidebarGroup>
          <SidebarGroupLabel>Khác</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Quản trị hệ thống</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) => getNavCls({ isActive })}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {state !== "collapsed" && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}