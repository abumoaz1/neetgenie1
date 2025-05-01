"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { endpoints, apiRequest } from "@/lib/baseUrl";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is not valid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setApiError("");
      
      try {
        const response = await apiRequest.post(endpoints.signup, {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        // Store the token in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        router.push("/dashboard");
      } catch (error) {
        console.error("Signup error:", error);
        setApiError(
          error instanceof Error 
            ? error.message 
            : "Failed to create account. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left side with image (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h1 className="text-3xl font-bold mb-6">Start Your NEET Preparation Journey</h1>
          <p className="mb-8 text-blue-100">
            Join thousands of students who have achieved their NEET goals with NEETGenie.
            Access mock tests, study materials, and personalized analytics.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-500/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">700+ Mock Tests</h3>
              <p className="text-sm text-blue-100">Practice with our extensive library of mock tests</p>
            </div>
            <div className="bg-blue-500/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Expert Guidance</h3>
              <p className="text-sm text-blue-100">Get personalized guidance from NEET experts</p>
            </div>
            <div className="bg-blue-500/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Study Materials</h3>
              <p className="text-sm text-blue-100">Access comprehensive study materials</p>
            </div>
            <div className="bg-blue-500/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Performance Analytics</h3>
              <p className="text-sm text-blue-100">Track your progress with detailed analytics</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side with signup form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="flex items-center text-slate-600 mb-6 hover:bg-slate-100"
              onClick={() => router.push("/")}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to home
            </Button>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Create an account</h1>
            <p className="text-slate-600 mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
          
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={cn(errors.name && "border-red-500")}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className={cn(errors.email && "border-red-500")}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        className={cn(errors.password && "border-red-500")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-500" />
                        )}
                      </Button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    <p className="text-xs text-slate-500">
                      Must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={cn(errors.confirmPassword && "border-red-500")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                  
                  {apiError && <p className="text-sm text-red-500">{apiError}</p>}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating account...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Sign up
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-lg">
              <p className="text-xs text-center text-slate-500">
                By clicking "Sign up", you agree to our{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}