import useAuth from "@/Hook/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../Spinner/LoadingSpinner";

type Children = {
  children: React.ReactNode;
};

const PrivetRoute = ({ children }: Children) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to={"/login"} state={location.pathname} />;
  }
  return children;
};

export default PrivetRoute;
