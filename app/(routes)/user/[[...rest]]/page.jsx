"use client";

import { UserProfile } from "@clerk/nextjs";

const User = () => {
  return (
    <div className="flex justify-center px-2.5 md:px-3 lg:px-10 my-6">
      <div className="w-full max-w-4xl">
        <UserProfile routing="path" />
      </div>
    </div>
  );
};

export default User;
