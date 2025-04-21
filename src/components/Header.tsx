"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import SparklesText from "./magicui/sparkles-text";
import { ShimmerButton } from "./magicui/shimmer-button";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { useAuthStore } from "@/store/Auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/utils/nameUtils";

const Nav = () => {
  const { user, logout } = useAuthStore();

  const initials = useMemo(
    () => getInitials(user?.name!) || "AM",
    [user?.name]
  );
  const handleLogout = () => {
    logout();
  };
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className={navigationMenuTriggerStyle()}>
          <Link href="/questions" legacyBehavior passHref>
            <NavigationMenuLink>All questions</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {user ? (
          <>
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>
              <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
              <NavigationMenuContent className="p-5 flex flex-col gap-2">
                <div className="flex pb-2 border-b-2 gap-1 ">
                  <Avatar className="size-10">
                    {/* <AvatarImage src={user.avatar} /> */}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user.name}</span>
                </div>
                <Link href="/Profile" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Profile
                  </NavigationMenuLink>
                </Link>
                <NavigationMenuLink onClick={handleLogout}>
                  Logout
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </>
        ) : (
          <NavigationMenuItem className={navigationMenuTriggerStyle()}>
            <Link href="/login" legacyBehavior passHref>
              <NavigationMenuLink>Login</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const NavButton = ({}) => {
  const links = [
    {
      name: "Login",
      href: "/login",
      current: false,
    },
    {
      name: "Register",
      href: "/register",
      current: false,
    },
  ];
  return (
    <nav className="flex gap-2 py-2 px-2 text-lg font-semibold">
      {links.map((link) => (
        <ShimmerButton key={link.name}>
          <Link shallow href={link.href}>
            {link.name}
          </Link>
        </ShimmerButton>
      ))}
    </nav>
  );
};

const Header = () => {
  return (
    <div className="flex justify-center py-5">
      <div className="flex justify-between w-11/12">
        <Link href="/">
          <SparklesText className="text-3xl" text="Codeoverflow" />
        </Link>
        <Nav />
      </div>
    </div>
  );
};

export default Header;
