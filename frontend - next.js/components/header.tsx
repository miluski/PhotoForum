"use client";

import { useState, useEffect } from "react";
import { useIsAuthorizedQuery } from "@/hooks/queries/is-authorized.query";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import {
  User,
  Key,
  UserPlus,
  LogOut,
  Plus,
  Menu,
  X,
  Search,
} from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/interceptor";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export const Header = () => {
  const { data: isAuthorized } = useIsAuthorizedQuery();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      if (response.status === 200) {
        queryClient.setQueryData(["isAuthorized"], false);
        router.push("/login");
      } else {
        console.error(
          "Failed to log out:",
          response.data?.message || "Unknown error"
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`min-h-[100px] fixed top-0 left-0 right-0 p-4 flex items-center gap-8 justify-between z-50 transition-colors duration-300 ${
        isScrolled ? "backdrop-blur bg-white/70 shadow-md" : "bg-transparent"
      }`}
    >
      {/* Logo and Hamburger */}
      <div className="flex items-center gap-8 justify-between w-full md:w-auto">
        <a href="/" className="text-lg font-bold flex items-center gap-3">
          <Image
            src="/static/logo.svg"
            alt="PhotoForum"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          PhotoForum
        </a>
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {isAuthorized && (
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/add-photo"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-yellow-600 shadow-md"
              title="Create"
            >
              <Plus className="w-6 h-6" />
            </a>
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-8">
        {isAuthorized && (
          <div className="flex items-center border border-gray-300 rounded-xl shadow-sm bg-white focus-within:ring-2 focus-within:ring-yellow-500 focus-within:border-yellow-500 max-w-md">
            <Search className="w-5 h-5 text-gray-500 ml-3" />
            <input
              type="text"
              placeholder="wyszukaj zdjęcie..."
              className="flex-1 px-4 py-2 focus:outline-none bg-transparent"
            />
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-12 justify-between">
        <Popover className="relative">
          {({ open, close }) => (
            <>
              <PopoverButton className="focus:outline-none hover:cursor-pointer">
                <User className="w-6 h-6 text-gray-700 hover:text-gray-900" />
              </PopoverButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel className="absolute right-0 mt-2 w-48 bg-yellow-50 rounded-lg shadow-lg z-10">
                  <div className="py-2">
                    {isAuthorized ? (
                      <>
                        <Link
                          href="/account-settings"
                          className="flex items-center px-4 py-2 text-gray-800 cursor-pointer hover:bg-yellow-100 w-full text-left"
                          onClick={() => close()}
                        >
                          <User className="w-5 h-5" />
                          Ustawienia konta
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            close();
                          }}
                          className="flex items-center px-4 py-2 text-gray-800 cursor-pointer hover:bg-yellow-100 w-full text-left"
                        >
                          <LogOut className="w-5 h-5 mr-2" />
                          Wyloguj się
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="flex items-center px-4 py-2 text-gray-800 cursor-pointer hover:bg-yellow-100"
                        >
                          <Key className="w-5 h-5 mr-2" />
                          Logowanie
                        </Link>
                        <Link
                          href="/register"
                          className="flex items-center px-4 py-2 text-gray-800 cursor-pointer hover:bg-yellow-100"
                        >
                          <UserPlus className="w-5 h-5 mr-2" />
                          Rejestracja
                        </Link>
                      </>
                    )}
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 md:hidden z-40">
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-4">
            <div className="flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {isAuthorized ? (
                <>
                  <Link
                    href="/add-photo"
                    className="flex items-center gap-2 text-gray-800 hover:text-yellow-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Plus className="w-5 h-5" />
                    Dodaj zdjęcie
                  </Link>
                  <Link
                    href="/account-settings"
                    className="flex items-center gap-2 text-gray-800 hover:text-yellow-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Plus className="w-5 h-5" />
                    Ustawienia konta
                  </Link>
                  <div className="flex items-center border border-gray-300 rounded-xl shadow-sm bg-white">
                    <Search className="w-5 h-5 text-gray-500 ml-3" />
                    <input
                      type="text"
                      placeholder="wyszukaj zdjęcie..."
                      className="flex-1 px-4 py-2 focus:outline-none bg-transparent"
                    />
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-gray-800 hover:text-yellow-600 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Wyloguj się
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-gray-800 hover:text-yellow-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Key className="w-5 h-5" />
                    Logowanie
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 text-gray-800 hover:text-yellow-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPlus className="w-5 h-5" />
                    Rejestracja
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
