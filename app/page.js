"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import ListingMapView from "./_components/ListingMapView";
import { useState } from "react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      setLoading(true);
      if (!user) return;

      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) {
        console.error("No User Email Found");
        return;
      }

      const { data: userInfo, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (userError) {
        console.error("User Fetch Error:", userError.message);
        return;
      }

      if (userInfo.status === "Pending") {
        router.replace(`/pending/${userInfo.company_id}`);
      } else if (userInfo.status === "Revoked") {
        router.replace(`/revoked/${userInfo.company_id}`);
      } else {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [user, isLoaded, router]);

  if (loading) {
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
  }

  return (
    <div className="px-10 p-10">
      <ListingMapView />
    </div>
  );
}
