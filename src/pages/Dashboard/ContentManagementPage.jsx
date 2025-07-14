import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaPlus } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ContentManagementPage = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosSecure.get("/blogs");
        setBlogs(res.data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [axiosSecure]);

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

      {loading ? (
        <div className="text-center text-secondary">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-secondary opacity-60">
          No blogs available yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-base-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer shadow-primary/5"
              onClick={() =>
                navigate(`/dashboard/content-management/blog/${blog._id}`)
              } // optional: navigate to blog details
            >
              <img
                src={blog.thumbnailUrl || blog.thumbnail}
                alt={blog.title}
                className="w-full h-40 object-cover rounded-t-md bg-secondary/30"
              />
              <h3 className="text-xl font-bold text-secondary mb-1 p-4">
                {blog.title}
              </h3>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ContentManagementPage;
