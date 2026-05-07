import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign In - FarmSetu",
  description: "Quick signup for FarmSetu marketplace.",
};

export default function LoginPage() {
  return <SignupForm />;
}
