"use client";
import Link from "next/link";
import React from "react";
import SparklesText from "./magicui/sparkles-text";
import ShimmerButton from "./magicui/shimmer-button";

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

const Nav = () => {
  const { user } = useAuthStore();
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {user ? (
          <>
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>
              <Link href="/add-question" passHref legacyBehavior>
                <NavigationMenuLink>Add Question</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem className={navigationMenuTriggerStyle()}>
              <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
              <NavigationMenuContent className="p-5 flex flex-col gap-2">
                <div className="flex pb-2 border-b-2">
                  <div className="">
                    <div className="w-10 h-10 rounded-full bg-gray-500 mr-2">
                      {/* <img
                      src={user?.}
                      alt="profile"
                      className="w-full h-full rounded-full"
                    /> */}
                    </div>
                  </div>
                  <span className="text-sm">{user.name}</span>
                </div>
                <Link href="/Profile" passHref legacyBehavior>
                  <NavigationMenuLink>Profile</NavigationMenuLink>
                </Link>
                <Link href="/logout" passHref legacyBehavior>
                  <NavigationMenuLink>Logout</NavigationMenuLink>
                </Link>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </>
        ) : (
          <>
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>
              <Link href="/register" passHref legacyBehavior>
                <NavigationMenuLink>Register</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>
              <Link href="/login" passHref legacyBehavior>
                <NavigationMenuLink>Login</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        )}

        {/* <NavigationMenuItem>
          <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink>Link</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
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
