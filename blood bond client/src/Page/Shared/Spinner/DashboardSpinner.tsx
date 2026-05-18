const DashboardSpinner = () => {
  return (
    <div className=" w-full h-full flex items-center justify-center flex-col my-5">
      <div className="inline-block w-5 h-5 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-muted-foreground">Loading your requests...</p>
    </div>
  );
};

export default DashboardSpinner;
