import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
});

const useAxiosSecure = () => {
  const { user, logOutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // request interceptor
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        if (user) {
          const token = localStorage.getItem("access-token");
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    // response interceptor
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        // const status = error.response?.status;

        // if (status === 401 || status === 403) {
        //   await logOutUser().then(() => navigate("/login"));
        // }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, logOutUser, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
