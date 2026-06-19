"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Form, TextField, Label, Input, FieldError, Button, 
  RadioGroup, Radio, Description 
} from "@heroui/react";
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
        role: data.role, 
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-10 font-sans">
  
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        
        <div className="text-center mb-8">
          <Image
            src="/Logo_F.png"
            alt="Banner"
            width={150} 
            height={225}
            className="w-[120px] md:w-[180px] h-auto mx-auto mb-4" 
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-sm text-gray-500">Join the reading revolution today</p>
        </div>

        <Button
          className="w-full bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 shadow-sm mb-6"
          size="lg"
          radius="md"
          onPress={handleGoogleLogin}
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium tracking-wide">or register with email</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <Form className="flex flex-col gap-4" onSubmit={onSubmit} validationBehavior="native">
          
          <TextField name="fullName" isRequired>
            <Label className="font-semibold text-gray-800 text-sm mb-1 block">Full Name</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Person className="w-5 h-5 text-gray-400" />
              </div>
              <Input 
                placeholder="Your Full Name" 
                className="pl-10 h-10 w-full rounded-md border border-gray-200 focus-visible:outline-none focus-visible:border-[#6a46cd]"
              />
            </div>
            <FieldError className="text-red-500 text-xs mt-1" />
          </TextField>

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
            <Label className="font-semibold text-gray-800 text-sm mb-1 block">Email Address</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Envelope className="w-5 h-5 text-gray-400" />
              </div>
              <Input 
                placeholder="you@example.com" 
                className="pl-10 h-10 w-full rounded-md border border-gray-200 focus-visible:outline-none focus-visible:border-[#6a46cd]"
              />
            </div>
            <FieldError className="text-red-500 text-xs mt-1" />
          </TextField>

          <TextField name="photoUrl" type="url">
            <Label className="font-semibold text-gray-800 text-sm mb-1 block">Photo URL (optional)</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Picture className="w-5 h-5 text-gray-400" />
              </div>
              <Input 
                placeholder="https://example.com/photo.jpg" 
                className="pl-10 h-10 w-full rounded-md border border-gray-200 focus-visible:outline-none focus-visible:border-[#6a46cd]"
              />
            </div>
            <FieldError className="text-red-500 text-xs mt-1" />
          </TextField>

          <TextField 
            name="password" 
            isRequired 
            minLength={6}
            onChange={(value) => setPasswordValue(value)}
            validate={(value) => {
              if (value.length < 6) return "Password must be at least 6 characters";
              return null;
            }}
          >
            <Label className="font-semibold text-gray-800 text-sm mb-1 block">Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <Input 
                type={isVisible ? "text" : "password"}
                placeholder="Min. 6 characters" 
                className="pl-10 pr-10 h-10 w-full rounded-md border border-gray-200 focus-visible:outline-none focus-visible:border-[#6a46cd]"
              />
              <button 
                type="button" 
                onClick={toggleVisibility} 
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
              >
                {isVisible ? <EyeSlash className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            <FieldError className="text-red-500 text-xs mt-1" />
          </TextField>

          <TextField 
            name="confirmPassword" 
            isRequired 
            validate={(value) => {
              if (value !== passwordValue) return "Passwords do not match";
              return null;
            }}
          >
            <Label className="font-semibold text-gray-800 text-sm mb-1 block">Confirm Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <Input 
                type={isConfirmVisible ? "text" : "password"}
                placeholder="Confirm your password" 
                className="pl-10 pr-10 h-10 w-full rounded-md border border-gray-200 focus-visible:outline-none focus-visible:border-[#6a46cd]"
              />
              <button 
                type="button" 
                onClick={toggleConfirmVisibility} 
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
              >
                {isConfirmVisible ? <EyeSlash className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            <FieldError className="text-red-500 text-xs mt-1" />
          </TextField>

          <div className="pt-2 w-full">
            <RadioGroup defaultValue="reader" name="role" color="secondary" className="gap-4">
              <Label className="font-semibold text-gray-800 text-sm">Account Type</Label>
              <Description className="text-xs text-gray-500 -mt-2">Choose the role that best fits your needs.</Description>
              
              <div className="flex flex-col gap-3 mt-1">
                <Radio value="reader">
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    <span className="font-medium text-gray-800">User (Reader)</span>
                  </Radio.Content>
                </Radio>

                <Radio value="librarian">
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    <span className="font-medium text-gray-800">Librarian</span>
                  </Radio.Content>
                </Radio>
              </div>
            </RadioGroup>
          </div>

          {serverError && <p className="text-sm text-red-500 font-semibold text-center">{serverError}</p>}

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-[#6a46cd] hover:bg-[#312061] text-white font-medium text-md mt-4 shadow-md transition-colors"
            size="lg"
            radius="md"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </Form>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#6a46cd] font-semibold hover:underline transition-all">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;