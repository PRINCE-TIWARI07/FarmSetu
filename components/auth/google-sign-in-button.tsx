"use client";

import { useFormStatus } from "react-dom";
import { Search } from "lucide-react";
import { LoadingButton } from "@/components/shared/loading-button";

export function GoogleSignInButton() {
  const { pending } = useFormStatus();

  return (
    <LoadingButton
      type="submit"
      loading={pending}
      loadingText="Opening Google..."
      className="min-h-12 w-full rounded-full"
    >
      <Search className="size-4" aria-hidden="true" />
      Continue with Google
    </LoadingButton>
  );
}
