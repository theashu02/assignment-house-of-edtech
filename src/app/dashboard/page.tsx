"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, X } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function Dashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/api/blogs");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await axios.put(`/api/blogs/${editingBlog._id}`, { title, content });
      } else {
        await axios.post("/api/blogs", { title, content });
      }
      setTitle("");
      setContent("");
      setEditingBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    // <div className="max-w-4xl mx-auto p-4">
    //   <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

    //   <form onSubmit={handleSubmit} className="mb-8">
    //     <div className="mb-4">
    //       <label className="block mb-2">Title</label>
    //       <input
    //         type="text"
    //         value={title}
    //         onChange={(e) => setTitle(e.target.value)}
    //         className="w-full p-2 border rounded"
    //         required
    //       />
    //     </div>
    //     <div className="mb-4">
    //       <label className="block mb-2">Content</label>
    //       <textarea
    //         value={content}
    //         onChange={(e) => setContent(e.target.value)}
    //         className="w-full p-2 border rounded"
    //         rows={4}
    //         required
    //       />
    //     </div>
    //     <button
    //       type="submit"
    //       className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
    //     >
    //       {editingBlog ? "Update Blog" : "Create Blog"}
    //     </button>
    //   </form>

    //   <div className="space-y-4">
    //     {blogs.map((blog) => (
    //       <div key={blog._id} className="border p-4 rounded">
    //         <h2 className="text-xl font-bold">{blog.title}</h2>
    //         <p className="text-gray-600 mb-2">By {blog.author.name}</p>
    //         <p className="mb-4">{blog.content}</p>
    //       </div>
    //     ))}
    //   </div>
    // </div>

    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <PlusCircle size={20} />
            <span>Create Post</span>
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Create New Post
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={6}
                    placeholder="Write your post content..."
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  By {blog.author.name} •{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600 line-clamp-3">{blog.content}</p>
              </div>
            </article>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No blog posts yet. Create your first post!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

{
  /* <div className="flex space-x-2">
  <button
    onClick={() => handleEdit(blog)}
    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(blog._id)}
    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
  >
    Delete
  </button>
</div>; */
}
