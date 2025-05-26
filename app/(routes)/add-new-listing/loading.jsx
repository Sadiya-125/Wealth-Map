import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white mt-[-190]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary font-semibold text-lg">
          Loading, Please Wait...
        </p>
      </div>
    </div>
  );
};

export default Loading;
