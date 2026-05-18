import useAuth from "@/Hook/useAuth";
import useRole from "@/Hook/useRole";

import DashboardSpinner from "../Spinner/DashboardSpinner";

type Children = {
  children: React.ReactNode;
};

const AdminPrivetRoute = ({ children }: Children) => {
  const { role, loading: roleLoading } = useRole();
  const { loading: authLoading } = useAuth();

  if (authLoading || roleLoading) {
    return <DashboardSpinner />;
  }

  if (role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-xl w-full rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-foreground">
            You don't have permission to access this page
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminPrivetRoute;
