import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import axios from "axios";

const BlogPage = () => {
  useEffect(() => {
    document.title = "BloodBridge | Blogs";
    window.scrollTo(0, 0);
  }, []);
  const {
    data: blogs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axios(`${import.meta.env.VITE_API_URL}/publicBlogs`);
      return res.data;
    },
  });
  if (isLoading)
    return <div className="text-center py-10">Loading blogs...</div>;

  if (isError)
    return (
      <div className="text-center py-10 text-red-500">Failed to load blogs</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow shadow-primary/5"
          >
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-48 object-cover bg-primary/10"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-1">{blog.title}</h3>
              <p className="text-gray-500 text-sm mb-2">- {blog.authorEmail}</p>
              <Link
                to={`/blogs/${blog._id}`}
                className="text-primary font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
