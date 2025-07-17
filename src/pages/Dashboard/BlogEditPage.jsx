import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import uploadImageToImgBB from "../../utils/uploadImageToImgBB";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BlogEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [currentThumbnail, setCurrentThumbnail] = useState("");

  const { register, handleSubmit, setValue } = useForm();
  useEffect(() => {
    document.title = "BloodBridge | Edit Blog";
    window.scrollTo(0, 0);
  }, []);

  // Fetch blog data with TanStack Query
  const {
    data: blog,
    isLoading: isBlogLoading,
    error,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/blogs/${id}`);
      return res.data;
    },
  });

  // Sync fetched blog to form
  useEffect(() => {
    if (blog) {
      setValue("title", blog.title);
      setContent(blog.content);
      setCurrentThumbnail(blog.thumbnail);
    }
  }, [blog, setValue]);

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      let imageUrl = currentThumbnail;

      if (data.thumbnail.length > 0) {
        const imageFile = data.thumbnail[0];
        imageUrl = await uploadImageToImgBB(imageFile);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      const updatedBlog = {
        title: data.title,
        content,
        thumbnail: imageUrl,
        status: "draft",
      };

      const res = await axiosSecure.patch(`/blogs/${id}`, updatedBlog);

      if (res.data.modifiedCount > 0) {
        toast.success("Blog updated successfully!");
        navigate("/dashboard/content-management");
      } else {
        toast.error("No changes made");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isBlogLoading) {
    return <div className="text-center text-xl py-12">Loading blog...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Failed to load blog.</div>;
  }

  return (
    <div className="bg-base-200 p-6 rounded-xl shadow-md shadow-primary/5">
      <h2 className="text-3xl font-bold text-primary mb-6">Edit Blog</h2>

      <form onSubmit={handleSubmit(handleUpdate)} className="space-y-3">
        {/* Title */}
        <div className="form-control">
          <label className="label font-medium mb-2 text-primary">
            Blog Title
          </label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="input border-none bg-primary/10 w-full focus:outline-primary/40"
          />
        </div>

        {/* Current Thumbnail Preview */}
        {currentThumbnail && (
          <div className="form-control">
            <label className="label font-medium mb-2 text-primary">
              Current Thumbnail
            </label>
            <img
              src={currentThumbnail}
              alt="Current Thumbnail"
              className="w-full h-40 object-cover rounded mb-2"
            />
          </div>
        )}

        {/* Thumbnail Upload */}
        <div className="form-control">
          <label className="label font-medium mb-2 text-primary">
            Change Thumbnail (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("thumbnail")}
            className="file-input bg-primary/10 w-full focus:outline-primary/40 border-primary/10"
          />
        </div>

        {/* Blog Content */}
        <div className="form-control">
          <label className="label font-medium mb-2 text-primary">
            Blog Content
          </label>
          <JoditEditor
            ref={editor}
            value={content}
            tabIndex={1}
            onBlur={(newContent) => setContent(newContent)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full rounded-xl text-base-100"
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogEditPage;
