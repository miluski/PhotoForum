"use client";

import Image from "next/image";
import { Github, Facebook, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-24">
      <div className="flex items-center gap-3">
        <Image
          src="/static/logo.svg"
          alt="PhotoForum"
          width={32}
          height={32}
          className="w-8 h-8"
        />
        PhotoForum
      </div>

      <span className="text-gray-600 text-sm">© PhotoForum 2025</span>

      {/* Right Section: Social Media Icons */}
      <div className="flex items-center gap-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Github className="w-6 h-6" />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Facebook className="w-6 h-6" />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Linkedin className="w-6 h-6" />
        </a>
      </div>
    </footer>
  );
};
