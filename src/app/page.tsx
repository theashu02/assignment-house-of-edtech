"use client";

import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  createdAt: string;
}

export default function Home() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = getCookie("token");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/api/blogs");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Blog Platform</h1>
            <div className="space-x-4">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => router.push("/login")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push("/signup")}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Blog Posts
            </h2>

            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading blogs...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No blogs posted yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {blogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      By {blog.author.name} •{" "}
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      {blog.content.length > 200
                        ? `${blog.content.substring(0, 200)}...`
                        : blog.content}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {!isLoggedIn && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Want to share your own stories?
            </p>
            <button
              onClick={() => router.push("/signup")}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Join Now
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
