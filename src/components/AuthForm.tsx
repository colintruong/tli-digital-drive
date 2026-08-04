"use client";

import { useState } from "react";
import { motion } from "motion/react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-w-md min-h-[55vh] px-4 py-6 flex flex-col items-center bg-white border border-gray-300 rounded-2xl">
      {/* Log in or sign up toggle */}
      <div className="flex w-9/10 rounded-xl bg-[#f9efed] p-1 mb-4">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className="relative flex-1 rounded-lg py-0.5"
        >
          {isLogin && (
            <motion.div
              layoutId="auth-pill"
              transition={{ type: "spring", stiffness: 700, damping: 50 }}
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
              transition={{ type: "spring", stiffness: 700, damping: 50 }}
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

      <div className="font-heading text-3xl font-bold self-start ml-6 mb-3">
        {isLogin ? "Welcome back! :)" : "Create your account"}
      </div>

      {isLogin ? <LoginForm /> : <SignupForm />}

      <span className="text-sm text-[#7c7373]">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#372cce] underline"
        >
          {isLogin ? "Sign up" : "Log in"}
        </button>
      </span>
    </div>
  );
}