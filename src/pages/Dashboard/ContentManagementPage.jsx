import React from "react";
import { Link, useNavigate } from "react-router";
import { FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { MdDelete, MdEdit } from "react-icons/md";

const ContentManagementPage = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/blogs");
      return res.data;
    },
  });

  const handleAddBlog = () => {
    navigate("/dashboard/content-management/add-blog");
  };

  return (
    <>
      {/* Header section with Add Blog button */}
      <div className="flex justify-between items-center mb-6 bg-base-200 p-6 rounded-xl shadow-xl shadow-primary/5">
        <h2 className="text-2xl font-bold text-primary">Content Management</h2>
        <button
          onClick={handleAddBlog}
          className="btn btn-primary gap-2 shadow-none rounded-xl border-none text-base-200"
        >
          <FaPlus />
          Add Blog
        </button>
      </div>

      {/* Content based on query states */}
      {isLoading ? (
        <div className="text-center text-secondary">Loading blogs...</div>
      ) : isError ? (
        <div className="text-center text-red-500">
          Failed to fetch blogs: {error.message}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-secondary opacity-60">
          No blogs available yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-base-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer shadow-primary/5 relative"
            >
              <img
                src={blog.thumbnailUrl || blog.thumbnail}
                alt={blog.title}
                className="w-full h-40 object-cover rounded-t-md bg-secondary/30"
              />
              <div className="p-4">
                <h3 className="text-base font-medium text-secondary mb-1">
                  {blog.title}
                </h3>
                <button className="btn btn-primary rounded-lg shadow-none border-none btn-sm text-base-200 capitalize w-full">
                  publish
                </button>
              </div>

              <div>
                <Link
                  to={`/dashboard/content-management/blog/${blog._id}`}
                  className="btn btn-circle shadow-none border-none btn-secondary opacity-60 btn-sm absolute top-2 left-2 hover:opacity-100 duration-300"
                >
                  <MdEdit />
                </Link>
                <button className="btn btn-circle shadow-none border-none btn-secondary opacity-60 btn-sm absolute top-2 right-2 hover:opacity-100 duration-300">
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ContentManagementPage;
