"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Form, TextField, Label, Input, FieldError, Button 
} from "@heroui/react";
import { Eye, EyeSlash, Envelope, Lock } from "@gravity-ui/icons"; 
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

 import { signIn } from "@/lib/auth-client"; 
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); 

    const formData = new FormData(e.currentTarget);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    setIsLoading(true);

    try {
      
      
      const { data: authData, error: authError } = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (authError) throw new Error(authError.message || "Invalid email or password");
      toast.success("Login successful! Redirecting...");

      //redirect
      setTimeout(() => {
        setIsLoading(false);
        router.push("/");
      }, 2000);

    } catch (err) {
      setServerError(err.message || "Invalid credentials. Please try again.");
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
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-10 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <Toaster position="top-right" reverseOrder={false} />

        <div className="text-center mb-8">
          <Image
            src="/Logo_F.png"
            alt="BiblioDrop Logo"
            width={150} 
            height={225}
            className="w-[120px] md:w-[180px] h-auto mx-auto mb-4" 
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
          <p className="text-sm text-gray-500">Please enter your details to sign in</p>
        </div>

        {/* --- Google login--- */}
        <Button
          className="w-full bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 shadow-sm mb-6"
          size="lg"
          radius="md"
          onPress={handleGoogleLogin}
          startContent={<FcGoogle className="w-5 h-5" />}
        >
         <FcGoogle/> Continue with Google
        </Button>

      
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium tracking-wide">or login with email</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

      
        <Form className="flex flex-col gap-5" onSubmit={onSubmit} validationBehavior="native">
          
          <TextField 
            name="email" 
            type="email" 
            isRequired
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="font-semibold text-gray-800 text-sm">Email Address</Label>
            <Input 
              placeholder="you@example.com" 
              variant="bordered" 
              radius="md"
              startContent={<Envelope className="w-5 h-5 text-gray-400 mr-1" />}
              classNames={{ inputWrapper: "border-gray-200 shadow-none hover:border-[#312061] focus-within:!border-[#312061]" }}
            />
            <FieldError />
          </TextField>

          <TextField 
            name="password" 
            isRequired 
          >
            <div className="flex items-center justify-between w-full">
              <Label className="font-semibold text-gray-800 text-sm">Password</Label>
              <Link href="/forgot-password" className="text-xs font-semibold text-[#6a46cd] hover:underline hover:text-[#312061] transition-all">
                Forgot password?
              </Link>
            </div>
            <Input 
              type={isVisible ? "text" : "password"}
              placeholder="Enter your password" 
              variant="bordered" 
              radius="md"
              startContent={<Lock className="w-5 h-5 text-gray-400 mr-1" />}
              endContent={
                <button type="button" onClick={toggleVisibility} className="focus:outline-none" aria-label="Toggle visibility">
                  {isVisible ? <EyeSlash className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              }
              classNames={{ inputWrapper: "border-gray-200 shadow-none hover:border-[#312061] focus-within:!border-[#312061]" }}
            />
            <FieldError />
          </TextField>

          {serverError && <p className="text-sm text-red-500 font-semibold">{serverError}</p>}

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-[#6a46cd] text-white font-medium text-md mt-2 shadow-md"
            size="lg"
            radius="md"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Form>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Do not have an account?{" "}
          <Link href="/auth/register" className="text-[#312061] font-semibold hover:underline transition-all">
Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;