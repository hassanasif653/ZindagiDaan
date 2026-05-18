import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email || authLoading) return;

    axiosSecure
      .get(`/user/${user.email}/role`)
      .then((res) => {
        setRole(res.data.role);
        setStatus(res.data.status);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user?.email, authLoading, axiosSecure]);

  return { role, status, loading };
};

export default useRole;
