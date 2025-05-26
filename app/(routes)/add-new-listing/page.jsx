"use client";

import { useState } from "react";
import GoogleAddressSearch from "../../_components/GoogleAddressSearch";
import { Button } from "@/components/ui/button";
import { supabase } from "../../../utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

const AddNewListing = () => {
  const { user } = useUser();
  const [selectedAddress, setSelectedAddress] = useState();
  const [coordinates, setCoordinates] = useState();
  const [boundingBox, setBoundingBox] = useState();
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const nextHandler = async () => {
    try {
      setLoader(true);

      const res = await fetch(
        "https://wealth-map-backend-m9ew.onrender.com/api/scrape",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: selectedAddress }),
        }
      );

      const { listings } = await res.json();

      if (!listings || listings.length === 0) {
        toast("No Listings Found for this Address");
        setLoader(false);
        return;
      }

      const { data, error } = await supabase
        .from("listing")
        .insert(
          listings.map((item) => ({
            address: selectedAddress,
            coordinates: coordinates,
            boundingBox: boundingBox,
            createdBy: user?.primaryEmailAddress.emailAddress,
            property_url: item.property_url,
            mls: item.mls,
            mls_id: item.mls_id,
            status: item.status,
            description: item.description,
            style: item.style,
            bedroom: item.bedroom,
            bathroom: item.bathroom,
            area: item.area,
            builtIn: item.builtIn,
            days_on_mls: item.days_on_mls,
            price: item.price,
            sold_price: item.sold_price,
            assessed_value: item.assessed_value,
            estimated_value: item.estimated_value,
            tax: item.tax,
            tax_history: item.tax_history,
            new_construction: item.new_construction,
            lotSize: item.lotSize,
            price_per_sqft: item.price_per_sqft,
            neighborhoods: item.neighborhoods,
            county: item.county,
            fips_code: item.fips_code,
            stories: item.stories,
            hoa: item.hoa,
            parking: item.parking,
            agent_name: item.agent_name,
            agent_email: item.agent_email,
            agent_phones: item.agent_phones,
            agent_mls_set: item.agent_mls_set,
            broker_name: item.broker_name,
            office_mls_set: item.office_mls_set,
            office_name: item.office_name,
            office_email: item.office_email,
            office_phones: item.office_phones,
            nearby_schools: item.nearby_schools,
            primary_photo: item.primary_photo,
            alt_photos: item.alt_photos,
          }))
        )
        .select();

      if (error) {
        toast("Failed to Save Listings in Supabase");
      } else {
        toast("Scraped Listings Saved");
        router.replace("/edit-listing/" + data[0].id);
      }
    } catch (err) {
      console.error("Error details:", err);
      const errorMessage =
        err?.message || err?.response?.statusText || "Something Went Wrong";
      toast(errorMessage);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="mt-10 md:mx-56 lg:mx-80">
      <div className="p-10 flex flex-col items-center justify-center">
        <h2 className="font-bold text-2xl mb-5">Add New Listing</h2>

        <div className="p-10 md:px-28 rounded-lg border shadow-md w-full flex flex-col gap-5">
          <h2 className="text-gray-500 mb-[-45]">
            Enter the Address to Search
          </h2>
          <GoogleAddressSearch
            onSelectAddress={(value) => {
              setSelectedAddress(value.address);
              setCoordinates({ lat: value.lat, lon: value.lon });
              setBoundingBox(value.boundingBox);
            }}
          />
          <Button
            disabled={!selectedAddress || !coordinates || loader}
            onClick={nextHandler}
          >
            {loader ? <Loader className="animate-spin" /> : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddNewListing;
