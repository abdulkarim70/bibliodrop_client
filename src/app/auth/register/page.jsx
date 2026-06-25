"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Input, Button } from "@heroui/react"; 
import { Eye, EyeSlash, Person, Envelope, Picture, Lock } from "@gravity-ui/icons"; 
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast"; 
import { signUp, signIn } from "@/lib/auth-client"; 

const Register = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  
  // বাই-ডিফল্ট 'reader' সিলেক্ট করা থাকবে
  const [role, setRole] = useState("reader");
  const [passwordValue, setPasswordValue] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); 

    const formData = new FormData(e.currentTarget);
    const data = {};
    
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    if (data.password !== data.confirmPassword) {
      setServerError("Passwords do not match. Please check again.");
      return; 
    }

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.fullName,
        image: data.photoUrl || "",
        role: role, // স্টেট থেকে সরাসরি রোল পাঠানো হচ্ছে
      });

      if (authError) throw new Error(authError.message);
      
      toast.success("Account created successfully! Redirecting...");

      setTimeout(() => {
        setIsLoading(false);
        router.push("/");
      }, 2000);

    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Registration failed!"); 
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/"
      });
      
      console.log("Redirecting to Google Auth...");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-gray-50 px-4 py-6 font-sans">
  
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        
        <div className="text-center mb-8">
          <Image
            src="/Logo_F.png"
            alt="Banner"
            width={150} 
            height={225}
            className="w-[120px] md:w-[180px] h-auto mx-auto mb-4" 
            priority
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-sm text-gray-500">Join the reading revolution today</p>
        </div>

        <Button
          className="w-full bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 shadow-sm mb-6 flex items-center justify-center gap-2"
          size="lg"
          radius="md"
          onPress={handleGoogleLogin}
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium tracking-wide">or register with email</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <Form className="flex flex-col gap-5 w-full" onSubmit={onSubmit} validationBehavior="native">
          
          {/* Full Name Field */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="font-semibold text-gray-800 text-sm">Full Name</label>
            <Input 
              name="fullName" 
              isRequired
              placeholder="Your Full Name" 
              variant="bordered" 
              radius="md"
              startContent={<Person className="w-5 h-5 text-gray-400 mr-1" />}
              classNames={{ inputWrapper: "border-gray-200 shadow-none hover:border-[#6a46cd] focus-within:!border-[#6a46cd]" }}
            />
          </div>

          {/* Email Field */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="font-semibold text-gray-800 text-sm">Email Address</label>
            <Input 
              name="email" 
              type="email" 
              isRequired
              validate={(value) => {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return "Please enter a valid email address";
                }
                return null;
              }}
              placeholder="you@example.com" 
              variant="bordered" 
              radius="md"
              startContent={<Envelope className="w-5 h-5 text-gray-400 mr-1" />}
              classNames={{ inputWrapper: "border-gray-200 shadow-none hover:border-[#6a46cd] focus-within:!border-[#6a46cd]" }}
            />
          </div>

          {/* Photo URL Field */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="font-semibold text-gray-800 text-sm">Photo URL (optional)</label>
            <Input 
              name="photoUrl" 
              type="url"
              placeholder="https://example.com/photo.jpg" 
              variant="bordered" 
              radius="md"
              startContent={<Picture className="w-5 h-5 text-gray-400 mr-1" />}
              classNames={{ inputWrapper: "border-gray-200 shadow-none hover:border-[#6a46cd] focus-within:!border-[#6a46cd]" }}
            />
          </div>

          {/* Password Field */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="font-semibold text-gray-800 text-sm">Password</label>
            <Input 
              name="password" 
              isRequired 
              type={isVisible ? "text" : "password"}
              onValueChange={setPasswordValue}
              validate={(value) => {
                if (value.length < 6) return "Password must be at least 6 characters";
                return null;
              }}
              placeholder="Min. 6 characters" 
              variant="bordered" 
              radius="md"
              startContent={<Lock className="w-5 h-5 text-gray-400 mr-1" />}
              endContent={
                <button type="button" onClick={toggleVisibility} className="focus:outline-none" aria-label="Toggle visibility">
                  {isVisible ? <EyeSlash className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              }
              classNames={{ inputWrapper: "border-gray-200 shadow-none hover:border-[#6a46cd] focus-within:!border-[#6a46cd]" }}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="w-full flex flex-col gap-1.5">
            <label className="font-semibold text-gray-800 text-sm">Confirm Password</label>
            <Input 
              name="confirmPassword" 
              isRequired 
              type={isConfirmVisible ? "text" : "password"}
              validate={(value) => {
                if (value !== passwordValue) return "Passwords do not match";
                return null;
              }}
              placeholder="Confirm your password" 
              variant="bordered" 
              radius="md"
              startContent={<Lock className="w-5 h-5 text-gray-400 mr-1" />}
              endContent={
                <button type="button" onClick={toggleConfirmVisibility} className="focus:outline-none" aria-label="Toggle confirm visibility">
                  {isConfirmVisible ? <EyeSlash className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              }
              classNames={{ inputWrapper: "border-gray-200 shadow-none hover:border-[#6a46cd] focus-within:!border-[#6a46cd]" }}
            />
          </div>

          {/* Role Selection (Custom Tailwind UI) */}
          <div className="w-full mt-2">
            <span className="font-semibold text-gray-800 text-sm block">Account Type</span>
            <span className="text-xs text-gray-500 block mb-3 mt-0.5">Choose the role that best fits your needs.</span>
            
            <div className="flex flex-col gap-3">
              
              {/* Reader Option */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="role" 
                  value="reader" 
                  checked={role === "reader"}
                  onChange={(e) => setRole(e.target.value)}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${role === "reader" ? "border-[#6a46cd]" : "border-gray-300 group-hover:border-gray-400"}`}>
                  <div className={`w-2.5 h-2.5 rounded-full bg-[#6a46cd] transition-all duration-200 ${role === "reader" ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
                </div>
                <span className="font-medium text-gray-800 text-sm transition-colors group-hover:text-black">User (Reader)</span>
              </label>

              {/* Librarian Option */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="role" 
                  value="librarian" 
                  checked={role === "librarian"}
                  onChange={(e) => setRole(e.target.value)}
                  className="hidden"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${role === "librarian" ? "border-[#6a46cd]" : "border-gray-300 group-hover:border-gray-400"}`}>
                  <div className={`w-2.5 h-2.5 rounded-full bg-[#6a46cd] transition-all duration-200 ${role === "librarian" ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
                </div>
                <span className="font-medium text-gray-800 text-sm transition-colors group-hover:text-black">Librarian</span>
              </label>

            </div>
          </div>

          {serverError && <p className="text-sm text-red-500 font-semibold text-center">{serverError}</p>}

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-[#6a46cd] hover:bg-[#5b3eb0] text-white font-medium text-md mt-2 shadow-md transition-colors"
            size="lg"
            radius="md"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </Form>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#6a46cd] font-semibold hover:underline transition-all">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;