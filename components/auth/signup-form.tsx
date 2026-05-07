"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, type UserRole } from "@/stores/auth-store";
import { createOrUpdateUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type SignupFormData = {
  name: string;
  email: string;
  role: UserRole;
};

export function SignupForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    role: "BUYER",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("[Signup] Submitting form:", formData);

      // Validate
      if (!formData.name.trim()) {
        toast.error("Please enter your name");
        setIsLoading(false);
        return;
      }

      if (!formData.email.trim() || !formData.email.includes("@")) {
        toast.error("Please enter a valid email");
        setIsLoading(false);
        return;
      }

      // Create user
      const result = await createOrUpdateUser(formData);

      if (!result.ok) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      console.log("[Signup] User created successfully:", result.user);

      // Save to store
      setUser(result.user);
      toast.success(`Welcome ${result.user.name}!`);

      // Redirect based on role
      const redirectMap: Record<UserRole, string> = {
        FARMER: "/farmer/dashboard",
        BUYER: "/buyer/dashboard",
        ADMIN: "/admin/dashboard",
      };

      const redirectUrl = redirectMap[result.user.role];
      console.log("[Signup] Redirecting to:", redirectUrl);

      router.push(redirectUrl);
    } catch (error) {
      console.error("[Signup] Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800 shadow-2xl">
        <div className="space-y-6 p-8">
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-white">FarmSetu</h1>
            <p className="text-sm text-slate-400">Welcome to the digital marketplace</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="border-slate-600 bg-slate-700 text-white placeholder-slate-500"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Gmail Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@gmail.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="border-slate-600 bg-slate-700 text-white placeholder-slate-500"
                required
              />
            </div>

            {/* Role Selector */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-200">
                I am a
              </Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              >
                <option value="BUYER">Buyer</option>
                <option value="FARMER">Farmer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              size="lg"
            >
              {isLoading ? "Creating account..." : "Continue"}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500">
            Quick signup for hackathon demo • No password needed
          </p>
        </div>
      </Card>
    </div>
  );
}
