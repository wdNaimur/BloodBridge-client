import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import uploadImageToImgBB from "../../utils/uploadImageToImgBB";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";

const AddBlogPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  useEffect(() => {
    document.title = "BloodBridge | Add Blog";
    window.scrollTo(0, 0);
  }, []);

  const handleBlogSubmit = async (data) => {
    setLoading(true);

    try {
      const imageFile = data.thumbnail[0];
      const imageUrl = await uploadImageToImgBB(imageFile);

      if (!imageUrl) {
        throw new Error("Image upload failed");
      }

      const blogData = {
        title: data.title,
        thumbnail: imageUrl,
        content,
        createdAt: new Date(),
      };

      const res = await axiosSecure.post("/blogs", blogData);

      if (res.data.blogId) {
        toast.success("Blog created successfully!");
        navigate("/dashboard/content-management");
        reset();

        setContent("");
      } else {
        toast.error("Failed to create blog");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-200 p-6 rounded-xl shadow-md shadow-primary/5">
      <h2 className="text-3xl font-bold text-primary mb-6">Add New Blog</h2>

      <form onSubmit={handleSubmit(handleBlogSubmit)} className="space-y-3">
        {/* Title */}
        <div className="form-control">
          <label className="label font-medium mb-2 text-primary">
            Blog Title
          </label>
          <input
            type="text"
            {...register("title", { required: true })}
            placeholder="Enter blog title"
            className="input border-none bg-primary/10 w-full focus:outline-primary/40"
          />
        </div>

        {/* Thumbnail Image */}
        <div className="form-control">
          <label className="label font-medium mb-2 text-primary">
            Thumbnail Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("thumbnail", { required: true })}
            className="file-input bg-primary/10 w-full focus:outline-primary/40 border-primary/10"
          />
        </div>

        {/* Rich Text Content */}
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
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlogPage;
