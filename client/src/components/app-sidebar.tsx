import { 
  Home, 
  Calendar, 
  Users, 
  BookOpen, 
  GraduationCap,
  UserPlus,
} from "lucide-react";
import { Link, useLocation } from "wouter";

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
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Visão Geral",
    url: "/",
    icon: Home,
    testId: "link-dashboard",
  },
  {
    title: "Substituição",
    url: "/substituicao",
    icon: UserPlus,
    testId: "link-substituicao",
  },
  {
    title: "Escala Semanal",
    url: "/escala-semanal",
    icon: Calendar,
    testId: "link-escala-semanal",
  },
  {
    title: "Professores",
    url: "/professores",
    icon: Users,
    testId: "link-professores",
  },
  {
    title: "Turmas",
    url: "/turmas",
    icon: GraduationCap,
    testId: "link-turmas",
  },
  {
    title: "Disciplinas",
    url: "/disciplinas",
    icon: BookOpen,
    testId: "link-disciplinas",
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Gestão Escolar</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url} data-testid={item.testId}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
