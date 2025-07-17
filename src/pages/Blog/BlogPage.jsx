import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import axios from "axios";
import ScrollFadeIn from "../../UI/ScrollFadeIn";
import Loader from "../../UI/Loader";
import PageHeader from "../../UI/PageHeader";
import { FaRegNewspaper } from "react-icons/fa";

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
  if (isLoading) return <Loader />;

  if (isError)
    return (
      <div className="text-center py-10 text-red-500">Failed to load blogs</div>
    );

  return (
    <ScrollFadeIn>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          icon={FaRegNewspaper}
          title="Insights & Inspiration"
          subtitle="Explore helpful articles, real stories, and expert advice on blood donation, health, and community impact."
        />
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
    </ScrollFadeIn>
  );
};

export default BlogPage;
