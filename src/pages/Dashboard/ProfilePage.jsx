import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const fetchUsers = async () => {
    const res = await axiosSecure.get(`/user/${user.email}`);
    return res.data;
  };
  const { data, isLoading, error } = useQuery({
    queryKey: ["uniqueKey"],
    queryFn: fetchUsers,
  });
  console.log(data);
  const [editable, setEditable] = useState(false);
  return (
    <div>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 flex items-center gap-2">
          My Profile
        </h1>
        <p className="text-secondary opacity-80 max-w-xl mb-6">
          View and manage your personal information securely.
        </p>
      </div>
      <form>
        <div>left profile card</div>
        <div>right details card</div>
      </form>
    </div>
  );
};

export default ProfilePage;
