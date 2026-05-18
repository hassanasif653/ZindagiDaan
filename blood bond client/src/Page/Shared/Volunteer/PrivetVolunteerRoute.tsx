import useAuth from "@/Hook/useAuth";
import useRole from "@/Hook/useRole";

import LoadingSpinner from "../Spinner/LoadingSpinner";

type Children = {
  children: React.ReactNode;
};

const PrivetVolunteerRoute = ({ children }: Children) => {
  const { role, loading: roleLoading } = useRole();
  const { loading: authLoading } = useAuth();

  if (authLoading || roleLoading) {
    return <LoadingSpinner />;
  }

  if (role !== "volunteer" && role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-xl w-full rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-foreground">
            You don't have permission to create requests
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivetVolunteerRoute;
