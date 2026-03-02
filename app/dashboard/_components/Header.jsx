"use client";

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

function Header() {
 const pathname = usePathname();
  const [activePath, setActivePath] = useState("");
  const router =useRouter();

  // 🔁 Update active path on route change
  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const linkBase =
    "cursor-pointer transition-all duration-200 hover:text-emerald-400 px-3 py-2 rounded-lg hover:bg-zinc-800/50";

  const activeLink =
    "text-emerald-400 bg-zinc-800/50 font-medium";

  return (
    <div className="flex p-4 items-center justify-between bg-black border-b border-zinc-800">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          MockMate
        </span>
      </div>

      {/* Nav */}
      <ul className="hidden md:flex gap-2 items-center text-gray-400">
        <li
          className={`${linkBase} ${
            activePath === "/dashboard" && activeLink
          }`}
          onClick={()=>router.push("/dashboard")}
        >
          Dashboard
        </li>

        <li
          className={`${linkBase} ${
            activePath === "/questions" && activeLink
          }`}
           onClick={()=>router.push("/quiz")}
          
        >
          Quizes
        </li>

     {/*   <li
          className={`${linkBase} ${
            activePath === "/upgrade" && activeLink
          }`}
        >
          Upgrade
        </li>*/}

        <li
          className={`${linkBase} ${
            activePath === "/how-it-works" && activeLink
          }`}
          onClick={()=>router.push("/works")}
        >
          How it Works
        </li>
      </ul>

      {/* User Button */}
      <div className="flex items-center gap-3">
        {/* In your actual code, replace this with: <UserButton /> */}
        <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition-transform">
          <UserButton/>
        </div>
      </div>
    </div>
  );
}

export default Header;