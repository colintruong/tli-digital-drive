"use client";

import { useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { toast } from "sonner";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(<IoEyeOutline />);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleToggle = () => {
    if (type === "password") {
      setIcon(<IoEyeOffOutline />);
      setType("text");
    } else {
      setIcon(<IoEyeOutline />);
      setType("password");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (email.trim() === "") {
        toast.error("Please enter your email!");
        return;
      }
      if (password.trim() === "") {
        toast.error("Please enter your password!");
        return;
      }

      await signIn(email, password);
      toast.success("Logged in successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 w-9/10"
      noValidate
    >
      {/* Email */}
      <div className="relative">
        <label htmlFor="email" className="block text-sm mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-black rounded-lg h-8 w-full mb-2 px-8"
          required
        />
        <MdOutlineMailOutline className="absolute left-2 top-8" />
      </div>

      {/* Password */}
      <div className="relative">
        <label htmlFor="password" className="block text-sm mb-1">
          Password
        </label>
        <input
          id="password"
          type={type}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-black rounded-lg h-8 w-full mb-2 px-8"
          required
          minLength={6}
        />
        <FaLock className="absolute left-2 top-8" />
        <span
          className="absolute right-3 top-8 text-gray-500 cursor-pointer"
          onClick={handleToggle}
        >
          {icon}
        </span>
      </div>
      <div className="relative">
        <p className="absolute right-0">Forgot password?</p>
      </div>

      <button
        type="submit"
        className="mt-auto w-full py-1 rounded-md mb-8 bg-[#de88ff] text-[#ffffff] font-bold"
        disabled={loading}
      >
        {loading ? "Loading..." : "Log in"}
      </button>
    </form>
  );
}
