"use client";

import { useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { toast } from "sonner";
import { motion } from "motion/react";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(<IoEyeOutline />);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Logged in successfully!");
      } else {
        await signUp(email, password);
        toast.success("Account created successfully!");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (type === "password") {
      setIcon(<IoEyeOffOutline />);
      setType("text");
    } else {
      setIcon(<IoEyeOutline />);
      setType("password");
    }
  };

  return (
    <div className="w-1/4 px-4 py-6 flex flex-col items-center bg-white border border-gray-300 rounded-2xl">
      <div className="flex w-9/10 rounded-xl bg-[#f9efed] p-1 mb-4">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="relative flex-1 rounded-lg py-0.5"
        >
          {isLogin && (
            <motion.div
              layoutId="auth-pill"
              transition={{
                type: "spring",
                stiffness: 700,
                damping: 50,
              }}
              className="absolute inset-0 rounded-lg bg-[#fff6f1] shadow"
            />
          )}

          <span
            className={`relative z-10 transition-colors ${
              isLogin ? "text-black" : "text-gray-500 hover:text-black"
            }`}
          >
            Log in
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className="relative flex-1 rounded-lg py-0.5"
        >
          {!isLogin && (
            <motion.div
              layoutId="auth-pill"
              transition={{
                type: "spring",
                stiffness: 700,
                damping: 50,
              }}
              className="absolute inset-0 rounded-lg bg-[#fff6f1] shadow"
            />
          )}

          <span
            className={`relative z-10 transition-colors ${
              !isLogin ? "text-black" : "text-gray-500 hover:text-black"
            }`}
          >
            Create account
          </span>
        </button>
      </div>
      <div className="text-xl font-bold self-start ml-6 mb-3">
        {isLogin ? "Welcome back! :)" : "Create your account"}
      </div>

      <form onSubmit={handleSubmit} className="self-start ml-6 w-9/10">
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
          <span className="absolute right-3 top-8 text-gray-500" onClick={handleToggle}>
            {icon}
          </span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : isLogin ? "Log in" : "Sign Up"}
        </button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Don't have an account? Sign up"
          : "Already have an account? Log in"}
      </button>
    </div>
  );
}
