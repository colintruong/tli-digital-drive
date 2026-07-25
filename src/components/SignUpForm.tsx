"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { toast } from "sonner";

export default function SignUpForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

  return (
    <div className="border border-black">
      <h1>{isLogin ? "Log in" : "Sign Up"}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
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