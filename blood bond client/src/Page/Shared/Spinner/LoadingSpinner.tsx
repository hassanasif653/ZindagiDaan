const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-card backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        {/* Animated Outer Ring (Blood Flow) */}
        <div className="absolute w-24 h-24 border-4 border-transparent border-t-[#fb2c36] border-r-[#fb2c36]/30 rounded-full animate-spin"></div>

        {/* Secondary Outer Ring (Subtle) */}
        <div className="absolute w-24 h-24 border-4 border-primary rounded-full"></div>

        {/* The Heart Container */}
        <div className="relative animate-heartbeat">
          {/* Main Heart Icon */}
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-heart">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81
                 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55
                 11.54L12 21.35z"
              fill="#fb2c36"
            />
          </svg>
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 rounded-full"></div>
        </div>
      </div>

      {/* Loading Information */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          <span className="h-1.5 w-1.5 bg-[#fb2c36] rounded-full animate-bounce-delay-1"></span>
          <span className="h-1.5 w-1.5 bg-[#fb2c36] rounded-full animate-bounce-delay-2"></span>
          <span className="h-1.5 w-1.5 bg-[#fb2c36] rounded-full animate-bounce"></span>
        </div>
        <h3 className="text-foreground/80 font-bold text-lg tracking-wide">
          Connecting Lives
        </h3>
        <p className="text-foreground/60 text-xs font-medium uppercase tracking-[3px]">
          Please Wait
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
