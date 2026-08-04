"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { toast } from "sonner";
import { MdOutlineMailOutline, MdOutlineAccountCircle } from "react-icons/md";
import { FaLock, FaCheck } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { ImCross } from "react-icons/im";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(<IoEyeOutline />);
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { signUp } = useAuth();

  const requirements = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowInfo(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (name.trim() === "") {
        toast.error("Please enter your name!");
        return;
      }
      if (email.trim() === "") {
        toast.error("Please enter your email!");
        return;
      }
      if (password.trim() === "") {
        toast.error("Please enter your password!");
        return;
      }
      if (confirmPassword.trim() === "") {
        toast.error("Please confirm your password!");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      if (
        !requirements.length ||
        !requirements.uppercase ||
        !requirements.lowercase ||
        !requirements.number
      ) {
        setShowInfo(true);
        return;
      }

      await signUp(name, email, password);
      toast.success("Account created successfully!");
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
      {/* Name */}
      <div className="relative">
        <label htmlFor="name" className="block text-sm mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Colin Truong"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-black rounded-lg h-8 w-full mb-2 px-8"
          required
        />
        <MdOutlineAccountCircle className="absolute left-2 top-8" />
      </div>

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

        {/* Requirement info */}
        <div
          ref={popoverRef}
          className="absolute -left-7 top-8 scale-125 text-gray-400"
        >
          <IoIosInformationCircleOutline
            className="cursor-pointer"
            onClick={() => setShowInfo((prev) => !prev)}
          />

          {showInfo && (
            <div className="flex flex-col justify-between absolute -top-2 right-8 w-40 h-40 px-2 py-1 rounded-xs border bg-white text-xs">
              <div className="text-black">Password requirements:</div>
              <div
                className={`flex items-center gap-2 ${
                  requirements.length ? "text-[#16da16]" : "text-[#ee0505]"
                }`}
              >
                {requirements.length ? (
                  <FaCheck className="shrink-0" />
                ) : (
                  <ImCross className="shrink-0" />
                )}
                <p>At least 6 characters</p>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  requirements.uppercase ? "text-[#16da16]" : "text-[#ee0505]"
                }`}
              >
                {requirements.uppercase ? (
                  <FaCheck className="shrink-0" />
                ) : (
                  <ImCross className="shrink-0" />
                )}
                <p>At least one uppercase letter</p>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  requirements.lowercase ? "text-[#16da16]" : "text-[#ee0505]"
                }`}
              >
                {requirements.lowercase ? (
                  <FaCheck className="shrink-0" />
                ) : (
                  <ImCross className="shrink-0" />
                )}
                <p>At least one lowercase letter</p>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  requirements.number ? "text-[#16da16]" : "text-[#ee0505]"
                }`}
              >
                {requirements.number ? (
                  <FaCheck className="shrink-0" />
                ) : (
                  <ImCross className="shrink-0" />
                )}
                <p>At least one number</p>
              </div>
            </div>
          )}
        </div>

        <FaLock className="absolute left-2 top-8" />
        <span
          className="absolute right-3 top-8 text-gray-500 cursor-pointer"
          onClick={handleToggle}
        >
          {icon}
        </span>
      </div>

      {/* Confirm password */}
      <div className="relative">
        <label htmlFor="confirmPassword" className="block text-sm mb-1">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type={type}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-black rounded-lg h-8 w-full mb-6 px-8"
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

      <button
        type="submit"
        className="mt-auto w-full py-1 rounded-md mb-8 bg-[#de88ff] text-[#ffffff] font-bold"
        disabled={loading}
      >
        {loading ? "Loading..." : "Sign Up"}
      </button>
    </form>
  );
}
