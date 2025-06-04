"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FileUpload from "./_components/FileUpload";
import { Loader } from "lucide-react";
import RegisterCompany from "./_components/RegisterCompany";

const CompanyDetails = () => {
  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    const checkUserExistence = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .maybeSingle();

      if (data) {
        if (data.status === "Accepted") {
          router.replace("/");
        } else if (data.status === "Pending") {
          router.replace(`/pending/${data.company_id}`);
        } else if (data.status === "Revoked") {
          router.replace(`/revoked/${data.company_id}`);
        }
      } else {
        setCheckingUser(false);
      }
    };
    checkUserExistence();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("User Not Authenticated");
      return;
    }
    setLoading(true);
    try {
      let imageUrl = "";

      if (images.length > 0) {
        const file = images[0];
        const fileExt = file.name.split(".").pop();
        const sanitizedCompanyName = formData.name.replace(/[^a-z0-9\-]/gi, "");

        const fileName = `${sanitizedCompanyName}-Logo.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("company-logo")
          .upload(fileName, file, {
            contentType: file.type,
            upsert: true,
          });

        if (uploadError) {
          toast.error("Error Uploading Company Logo");
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("company-logo").getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const { data: companyData, error: companyError } = await supabase
        .from("company")
        .insert([
          {
            ...formData,
            logo: imageUrl,
          },
        ])
        .select()
        .single();

      if (companyError) {
        toast.error("Failed to Save Company");
        console.log(companyError);
        return;
      }

      const { error: userError } = await supabase.from("users").insert([
        {
          clerk_id: user.id,
          fullName: user.fullName,
          profileImage: user.imageUrl,
          email: user.primaryEmailAddress?.emailAddress,
          role: "Admin",
          company_id: companyData.id,
          status: "Accepted",
        },
      ]);

      if (userError) {
        toast.error("Failed to Save Admin User");
        console.log(userError);
        return;
      }

      toast.success("Company and Admin Created Successfully");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error("Unexpected Error Occurred");
    } finally {
      setLoading(false);
    }
  };

  if (checkingUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-white mt-[-150]">
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
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">
        Register Your Company
      </h1>
      <RegisterCompany />
      <div className="space-y-5">
        <div>
          <Label htmlFor="name" className="mb-3">
            Company Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter the Company Name"
          />
        </div>

        <div>
          <Label htmlFor="logo" className="mb-3">
            Company Logo
          </Label>
          <FileUpload setImages={(value) => setImages(value)} />
        </div>

        <div>
          <Label htmlFor="address" className="mb-3">
            Address
          </Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter the Company Address"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="mb-3">
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter the Company Phone Number"
            type="tel"
          />
        </div>

        <div>
          <Label htmlFor="email" className="mb-3">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter the Company Email Address"
            type="email"
          />
        </div>

        <div>
          <Label htmlFor="website" className="mb-3">
            Official Website
          </Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Enter the Company Website URL"
          />
        </div>

        <Button className="mt-2" onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader className="animate-spin" /> : "Save Details"}
        </Button>
      </div>
    </div>
  );
};

export default CompanyDetails;
