import * as React from "react";

const FrontPage = () => {

  return (
    <main className="flex-1 bg-black">
      {/* Hero Section */}
      <section className="flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-4xl mx-auto my-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-[#f4f4f4] mt-[20%]">
              Welcome to SimpL Blogs
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A seamless blog creation, updates, and management application.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FrontPage;
