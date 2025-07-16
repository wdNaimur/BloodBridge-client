import React from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";
import { useQuery } from "@tanstack/react-query";

const useStatus = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const fetchStatus = async () => {
    const { data } = await axiosSecure.get(`/user/status/${user.email}`);
    return data;
  };

  const { data, isLoading: isStatusLoading } = useQuery({
    queryKey: ["status", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: fetchStatus,
  });

  const status = data?.status;
  return [status, isStatusLoading];
};

export default useStatus;
