import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Clock, Search, Star } from "lucide-react";

const FrontPage = () => {

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to SimpL Blogs</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the latest insights, tutorials, and best practices in web
            development, design, and technology.
          </p>
        </div>
      </section>
    </div>
  );
};

export default FrontPage;
