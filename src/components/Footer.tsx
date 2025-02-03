'use client'
import * as React from "react";
import { Github, Linkedin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FooterProps {
  githubRepoUrl: string;
  linkedinProfileUrl: string;
}

const Footer: React.FC<FooterProps> = ({
  githubRepoUrl,
  linkedinProfileUrl,
}) => {
  const openGitHubRepo = () => {
    window.open(githubRepoUrl, "_blank", "noopener,noreferrer");
  };

  const openLinkedIn = () => {
    window.open(linkedinProfileUrl, "_blank", "noopener,noreferrer");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Copyright */}
        <div className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
          © {currentYear} Ashu Chauhan. All rights reserved.
        </div>

        {/* Social Links */}
        <div className="flex items-center space-x-4">
          {/* GitHub Repo Star Button */}
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={openGitHubRepo}
          >
            <Github className="h-5 w-5" />
            <span>GitHub</span>
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </Button>

          {/* LinkedIn Button */}
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={openLinkedIn}
          >
            <Linkedin className="h-5 w-5 text-blue-600" />
            <span>LinkedIn</span>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
