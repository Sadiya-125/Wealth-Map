"use client";

import React, { useEffect, use } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

const JoinCompanyPage = ({ params }) => {
  const unwrappedParams = use(params);
  const { companyId } = unwrappedParams;

  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    const handleJoin = async () => {
      if (!isLoaded || !user) return;

      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) {
        console.error("No User Email Found");
        return;
      }

      const { data: userInfo, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (userError) {
        console.error("User Fetch Error:", userError.message);
        return;
      }

      if (!userInfo) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            clerk_id: user.id,
            fullName: user.fullName,
            profileImage: user.imageUrl,
            email: email,
            role: "Employee",
            company_id: parseInt(companyId),
            status: "Pending",
          },
        ]);

        if (insertError) {
          console.error("User Insert Error:", insertError.message);
          return;
        }

        router.replace(`/pending/${companyId}`);
        return;
      }

      if (userInfo.status === "Accepted") {
        router.replace("/");
      } else if (userInfo.status === "Pending") {
        router.replace(`/pending/${userInfo.company_id}`);
      } else if (userInfo.status === "Revoked") {
        router.replace(`/revoked/${userInfo.company_id}`);
      }
    };

    handleJoin();
  }, [user, isLoaded, companyId, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-white mt-[-190px]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-primary font-semibold text-lg">
          Processing, Please Wait...
        </p>
      </div>
    </div>
  );
};

export default JoinCompanyPage;
