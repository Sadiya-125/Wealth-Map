"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const InviteButton = dynamic(() => import("./_components/invite-button"), {
  ssr: false,
});
import dynamic from "next/dynamic";

const CompanyDashboard = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      const { data: userInfo, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.primaryEmailAddress.emailAddress)
        .single();

      if (userError || !userInfo) {
        console.error("User Fetch Error:", userError);
        return;
      }

      setUserData(userInfo);

      if (userInfo.company_id) {
        const { data: company, error: companyError } = await supabase
          .from("company")
          .select("*")
          .eq("id", userInfo.company_id)
          .single();

        if (companyError) {
          console.error("Company Fetch Error:", companyError);
        } else {
          setCompanyData(company);
        }

        const { data: employeeList, error: empError } = await supabase
          .from("users")
          .select("*")
          .eq("company_id", userInfo.company_id);

        if (empError) {
          console.error("Employee List Fetch Error:", empError);
        } else {
          setEmployees(employeeList);
        }
      }
    };

    fetchData();
  }, [user]);

  const updateEmployeeStatus = async (employeeId, newStatus) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ status: newStatus })
        .eq("id", employeeId);

      if (error) {
        console.error("Failed to Update Status:", error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">
        Company Dashboard
      </h1>

      {companyData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {companyData.logo && (
                <img
                  src={companyData.logo}
                  alt={`${companyData.name} logo`}
                  className="h-16 w-16 object-contain rounded-md"
                  loading="lazy"
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-bold">{companyData.name}</p>
            <p>
              <strong>Email:</strong> {companyData.email}
            </p>
            <p>
              <strong>Phone:</strong> {companyData.phone}
            </p>
            <p>
              <strong>Website:</strong> {companyData.website}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight">Employees</h2>
        <InviteButton companyId={userData?.company_id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {employees.map((emp) => (
          <Card key={emp.id}>
            <CardHeader>
              <CardTitle>{emp.fullName || emp.email}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Email:</strong> {emp.email}
              </p>

              <p>
                <strong>Status:</strong>
              </p>
              <select
                disabled={emp.role === "Admin"}
                className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                value={emp.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  const success = await updateEmployeeStatus(emp.id, newStatus);
                  if (success) {
                    setEmployees((prev) =>
                      prev.map((user) =>
                        user.id === emp.id
                          ? { ...user, status: newStatus }
                          : user
                      )
                    );
                  } else {
                    alert("Failed to Update Status");
                  }
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Revoked">Revoked</option>
              </select>

              <p>
                <strong>Role:</strong> {emp.role || "Employee"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompanyDashboard;
