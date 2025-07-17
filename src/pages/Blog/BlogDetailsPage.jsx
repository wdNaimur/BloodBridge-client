import React from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "../../UI/Loader";
import ScrollFadeIn from "../../UI/ScrollFadeIn";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: blog,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/publicBlogs/${id}`
      );
      return res.data;
    },
  });
  console.log(blog);

  if (isLoading) return <Loader />;
  if (isError || !blog) return <Error message="Blog not found!" />;

  const { title, content, thumbnail, author, createdAt, tags } = blog;
  console.log(author);
  return (
    <ScrollFadeIn>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          className="flex items-center text-sm text-secondary hover:text-primary cursor-pointer mb-4"
          onClick={() => navigate("/blogs")}
        >
          <FaArrowLeft className="mr-2" /> Back to Blogs
        </button>

        <img
          src={thumbnail}
          alt={title}
          className="w-full h-72 object-cover rounded-xl mb-6"
        />
        <h1 className="text-3xl font-bold text-red-700 mb-2">{title}</h1>

        <div className="text-sm text-secondary opacity-80 mb-6">
          <span>By {author || "Unknown Author"}</span> |{" "}
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>

        <div
          className="prose max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {tags?.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Tags:</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollFadeIn>
  );
};

export default BlogDetails;
