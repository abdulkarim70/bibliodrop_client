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

// import { signUp, signIn } from "@/lib/auth-client"; 

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
      // --- Better Auth & MongoDB Logic ---
      /*
      const { data: authData, error: authError } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.fullName,
        image: data.photoUrl || "",
        role: data.role, 
      });

      if (authError) throw new Error(authError.message);
      */

      setTimeout(() => {
        setIsLoading(false);
        router.push("/");
      }, 2000);

    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      /*
      await signIn.social({
        provider: "google",
        callbackURL: "/"
      });
      */
      console.log("Redirecting to Google Auth...");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-10 font-sans">
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

        {/* --- গুগল লগইন --- */}
        <Button
          className="w-full bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 shadow-sm mb-6"
          size="lg"
          radius="md"
          onPress={handleGoogleLogin}
          startContent={
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          }
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </Button>

        {/* --- ডিভাইডার --- */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium tracking-wide">or register with email</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* --- HeroUI ফর্ম সেকশন --- */}
        <Form className="flex flex-col gap-4" onSubmit={onSubmit} validationBehavior="native">
          
          <TextField name="fullName" isRequired>
            <Label className="font-semibold text-gray-800 text-sm">Full Name</Label>
            <Input 
              placeholder="Your Full Name" 
              variant="bordered" 
              radius="md"
              startContent={<Person className="w-5 h-5 text-gray-400 mr-1" />}
              classNames={{ inputWrapper: "border-gray-200 shadow-none hover:border-[#312061] focus-within:!border-[#312061]" }}
            />
            <FieldError />
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

          <TextField name="photoUrl" type="url">
            <Label className="font-semibold text-gray-800 text-sm">Photo URL (optional)</Label>
            <Input 
              placeholder="https://example.com/photo.jpg" 
              variant="bordered" 
              radius="md"
              startContent={<Picture className="w-5 h-5 text-gray-400 mr-1" />}
              classNames={{ inputWrapper: "border-gray-200 shadow-none hover:border-[#312061] focus-within:!border-[#312061]" }}
            />
            <FieldError />
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
            <Label className="font-semibold text-gray-800 text-sm">Password</Label>
            <Input 
              type={isVisible ? "text" : "password"}
              placeholder="Min. 6 characters" 
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

          <TextField 
            name="confirmPassword" 
            isRequired 
            validate={(value) => {
            
              if (value !== passwordValue) return "Passwords do not match";
              return null;
            }}
          >
            <Label className="font-semibold text-gray-800 text-sm">Confirm Password</Label>
            <Input 
              type={isConfirmVisible ? "text" : "password"}
              placeholder="Confirm your password" 
              variant="bordered" 
              radius="md"
              startContent={<Lock className="w-5 h-5 text-gray-400 mr-1" />}
              endContent={
                <button type="button" onClick={toggleConfirmVisibility} className="focus:outline-none" aria-label="Toggle visibility">
                  {isConfirmVisible ? <EyeSlash className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              }
              classNames={{ inputWrapper: "border-gray-200 shadow-none hover:border-[#312061] focus-within:!border-[#312061]" }}
            />
            <FieldError />
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

     
          {serverError && <p className="text-sm text-red-500 font-semibold">{serverError}</p>}

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full  bg-[#6a46cd] text-white font-medium text-md mt-4 shadow-md"
            size="lg"
            radius="md"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </Form>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#312061] font-semibold hover:underline transition-all">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;