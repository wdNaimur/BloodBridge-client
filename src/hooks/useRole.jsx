import React from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";
import { useQuery } from "@tanstack/react-query";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const fetchRole = async () => {
    const { data } = await axiosSecure.get(`/user/role/${user.email}`);
    return data;
  };
  const { data, isLoading: isRoleLoading } = useQuery({
    queryKey: ["role", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: fetchRole,
  });
  const role = data?.role;
  return [role, isRoleLoading];
};

export default useRole;
