
"use client";

import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth-guard';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarBrand,
} from '@/components/ui/sidebar';
import { Home, Music, Video, Newspaper, Link as LinkIcon, Star, Settings, User, LogOut } from 'lucide-react';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';

function UserNav() {
  const { logout } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Admin</p>
            <p className="text-xs leading-none text-muted-foreground">
              admin@fahmiefarhan.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/music", label: "Music", icon: Music },
    { href: "/admin/videos", label: "Videos", icon: Video },
    { href: "/admin/blog", label: "Blog", icon: Newspaper },
    { href: "/admin/social-links", label: "Social Links", icon: LinkIcon },
    { href: "/admin/testimonials", label: "Testimonials", icon: Star },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    const activeLink = navLinks.find(link => pathname.startsWith(link.href));
    if (activeLink) {
        return activeLink.label;
    }
    return "Dashboard";
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarHeader>
              <SidebarBrand>
                <Logo className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold">FahmieFarhan CMS</span>
              </SidebarBrand>
            </SidebarHeader>
            <SidebarMenu>
              {navLinks.map(link => (
                 <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton href={link.href} isActive={pathname === link.href}>
                      <link.icon />
                      {link.label}
                    </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
             <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="#">
                        <Settings />
                        Settings
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-6">
            <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold uppercase font-headline">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Logged in as <span className="font-semibold text-foreground">Admin</span></span>
                <UserNav />
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
