"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";

const Revoked = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      const { data, error } = await supabase
        .from("company")
        .select("*")
        .eq("id", companyId)
        .single();

      if (error) {
        console.error("Company Fetch Error:", error.message);
      } else {
        setCompany(data);
      }

      setLoading(false);
    };

    if (companyId) fetchCompany();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white mt-[-190]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-semibold text-lg">
            Loading Company Details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center mt-[-190]">
      {company?.logo && (
        <Image
          src={company.logo}
          alt={`${company.name} Logo`}
          width={100}
          height={100}
          className="mb-4 rounded-md"
          loading="lazy"
        />
      )}
      <div className="flex items-center justify-center mb-4 gap-4">
        <AlertTriangle className="w-10 h-10 text-red-600 mb-2" />
        <h1 className="text-2xl font-bold text-red-700 mb-2">
          Access Revoked from{" "}
          <span className="text-black">{company?.name}</span>
        </h1>
      </div>
      <p className="text-gray-600 max-w-md">
        Your access to the company dashboard has been revoked by the admin. If
        you believe this is a mistake, please contact your organization.
      </p>
    </div>
  );
};

export default Revoked;
