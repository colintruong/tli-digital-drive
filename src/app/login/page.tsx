"use client";

import AuthForm from "@/src/components/AuthForm";
import { LuHardDrive } from "react-icons/lu";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fff6f1]">
      <div className="px-4 py-4 rounded-2xl mb-4 bg-[#de88ff]">
        <LuHardDrive className="text-white size-7"/>
      </div>
      <h1 className="font-heading text-3xl font-bold mb-4">tLi&apos;s Digital Drive</h1>
      <AuthForm />
    </div>
  );
}
