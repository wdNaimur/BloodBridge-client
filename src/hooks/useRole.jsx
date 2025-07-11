import React, { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const axiosSecure = useAxiosSecure();
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchUserRole = async () => {
      try {
        const { data } = await axiosSecure.get(`/user/role/${user.email}`);
        setRole(data?.role);
        setIsRoleLoading(false);
      } catch (error) {
        console.error("Failed to fetch role:", error);
      } finally {
        setIsRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.email, axiosSecure]);

  return [role, isRoleLoading];
};

export default useRole;
