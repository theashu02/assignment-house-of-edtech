'use client'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
    const router = useRouter()
  return (
    <Button variant="outline" size="icon" onClick={() => router.push("/dashboard")}>
      <ChevronLeft />
    </Button>
  );
}
