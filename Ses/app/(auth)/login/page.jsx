"use client";

import React, { Suspense } from "react";
import LoginPageContent from "./login-content";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
