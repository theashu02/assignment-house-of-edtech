"use client";

import { Footer } from "./common/Footer";
import { Navbar } from "./common/Navbar";
import FrontPage from "./common/FrontPage";
import { usePathname } from "next/navigation";
import Dashboard from "./dashboard/page"
import MyBlogs from "./my-blogs/page"
import { useEffect,useState } from "react";
import PageLoader from "./common/PageLoader";

export default function Home() {
   const pathname = usePathname();
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     const timer = setTimeout(() => {
       setLoading(false);
     }, 1000);

     return () => clearTimeout(timer);
   }, [pathname]);

   let content;
   if (pathname === "/my-blogs") {
     content = <MyBlogs />;
   } else if (pathname === "/dashboard") {
     content = <Dashboard />;
   } else {
     content = <FrontPage />;
   }

   return (
     <div className="min-h-screen flex flex-col">
       <Navbar />
       {loading ? <PageLoader /> : content}
       <Footer />
     </div>
   );
}
