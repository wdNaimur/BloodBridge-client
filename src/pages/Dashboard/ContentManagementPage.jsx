import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { MdDelete, MdEdit } from "react-icons/md";
import DeleteBlogModal from "../../components/Modal/DeleteBlogModal";
import PublishBlogModal from "../../components/Modal/PublishBlogModal";
import useRole from "../../hooks/useRole";
import Pagination from "../../UI/Pagination";
import DashBoardLoader from "../../UI/DashBoardLoader";
import TableLoader from "../../UI/TableLoader";

const ContentManagementPage = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [role, isRoleLoading] = useRole();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [selectedAction, setSelectedAction] = useState("publish");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    document.title = "BloodBridge | Content Management";
    window.scrollTo(0, 0);
  }, []);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["blogs", currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/blogs?page=${currentPage}&limit=${itemsPerPage}`
      );
      return res.data;
    },
  });

  const blogs = data?.blogs || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const pages = [...Array(totalPages).keys()];

  const handleAddBlog = () =>
    navigate("/dashboard/content-management/add-blog");

  const handleDeleteClick = (id) => {
    setSelectedBlogId(id);
    setIsDeleteModalOpen(true);
  };

  const handleStatusClick = (id, action) => {
    setSelectedBlogId(id);
    setSelectedAction(action);
    setIsPublishModalOpen(true);
  };

  if (isRoleLoading) return <DashBoardLoader />;

  return (
    <>
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

      {isLoading ? (
        <div className="w-fit mx-auto">
          <TableLoader />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">
          Failed to fetch blogs: {error.message}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-secondary opacity-60">
          No blogs available yet.
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-base-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer shadow-primary/5 relative flex flex-col"
              >
                <img
                  src={blog.thumbnailUrl || blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded-t-md bg-secondary/30"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-medium text-secondary mb-1">
                    {blog.title}
                  </h3>

                  {role === "admin" && (
                    <button
                      className={`btn ${
                        blog.status === "draft" ? "btn-primary" : "btn-warning"
                      } rounded-lg shadow-none border-none btn-sm text-base-200 capitalize w-full mt-auto`}
                      onClick={() =>
                        handleStatusClick(
                          blog._id,
                          blog.status === "draft" ? "publish" : "unpublish"
                        )
                      }
                    >
                      {blog.status === "draft" ? "Publish" : "Unpublish"}
                    </button>
                  )}
                </div>

                <div>
                  <Link
                    to={`/dashboard/content-management/blog/${blog._id}`}
                    className="btn btn-circle shadow-none border-none btn-secondary opacity-60 btn-sm absolute top-2 left-2 hover:opacity-100 duration-300"
                  >
                    <MdEdit />
                  </Link>
                  {role === "admin" && (
                    <button
                      onClick={() => handleDeleteClick(blog._id)}
                      className="btn btn-circle shadow-none border-none btn-secondary opacity-60 btn-sm absolute top-2 right-2 hover:opacity-100 duration-300"
                    >
                      <MdDelete />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}

          <Pagination
            pages={pages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}

      {/* Modals */}
      <DeleteBlogModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBlogId(null);
          refetch();
        }}
        blogId={selectedBlogId}
      />

      <PublishBlogModal
        isOpen={isPublishModalOpen}
        onClose={() => {
          setIsPublishModalOpen(false);
          setSelectedBlogId(null);
          refetch();
        }}
        blogId={selectedBlogId}
        action={selectedAction}
      />
    </>
  );
};

export default ContentManagementPage;
