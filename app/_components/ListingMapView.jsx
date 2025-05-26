"use client";

import Listing from "./Listing";
import { supabase } from "../../utils/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GoogleMapSection from "./GoogleMapSection";

const ListingMapView = () => {
  const [listing, setListing] = useState([]);
  const [searchedAddress, setSearchedAddress] = useState("");
  const [coordinates, setCoordinates] = useState();
  const [boundingBox, setBoundingBox] = useState();

  const [bedCount, setBedCount] = useState("");
  const [bathCount, setBathCount] = useState("");
  const [parkingCount, setParkingCount] = useState("");
  const [area, setArea] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [propertyValue, setPropertyValue] = useState([0, 5000000]);

  useEffect(() => {
    getLatestListing();
  }, []);

  const getLatestListing = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select("*")
      .order("id", { ascending: false });
    if (data) {
      setListing(data);
    }
    if (error) {
      toast("Server Side Error");
    }
  };

  const handleSearchClick = async () => {
    const parts = searchedAddress.split(",").map((p) => p.trim());

    let searchTerm = searchedAddress;
    for (const part of parts) {
      const match = part.match(/^([\w\s.'-]+?)\s+County$/i);
      if (match) {
        searchTerm = `${match[1]} County`;
        break;
      }
    }

    let query = supabase
      .from("listing")
      .select("*")
      .gte("bedroom", Number(bedCount))
      .gte("bathroom", Number(bathCount))
      .gte("parking", Number(parkingCount))
      .like("address", `%${searchTerm}%`)
      .order("id", { ascending: false });

    if (propertyType) {
      query = query.eq("status", propertyType);
    }

    if (ownerName?.trim()) {
      query = query.ilike("agent_name", `%${ownerName.trim()}%`);
    }

    if (area) {
      if (area === "< 3000 sqft") {
        query = query.lt("area_sqft", 3000);
      } else if (area === "3000 - 5000 sqft") {
        query = query.gte("area_sqft", 3000).lte("area_sqft", 5000);
      } else if (area === "5000 - 7000 sqft") {
        query = query.gt("area_sqft", 5000).lte("area_sqft", 7000);
      } else if (area === "> 7000 sqft") {
        query = query.gt("area_sqft", 7000);
      }
    }

    if (propertyValue?.length === 2) {
      query = query
        .gte("price", propertyValue[0])
        .lte("price", propertyValue[1]);
    }

    const { data, error } = await query;

    if (data) {
      setListing(data);
    }
  };
  return (
    <div className="relative">
      <div className="hidden md:flex">
        <div className="w-full pr-[350px] lg:pr-[550px] xl:pr-[650px]">
          <Listing
            listing={listing}
            handleSearchClick={handleSearchClick}
            searchedAddress={(address) => setSearchedAddress(address)}
            setCoordinates={setCoordinates}
            setBoundingBox={setBoundingBox}
            bedCount={bedCount}
            bathCount={bathCount}
            parkingCount={parkingCount}
            propertyType={propertyType}
            ownerName={ownerName}
            propertyValue={propertyValue}
            area={area}
            setBedCount={setBedCount}
            setBathCount={setBathCount}
            setParkingCount={setParkingCount}
            setPropertyType={setPropertyType}
            setOwnerName={setOwnerName}
            setPropertyValue={setPropertyValue}
            setArea={setArea}
          />
        </div>

        <div className="fixed right-0 top-33 bottom-10 w-[350px] lg:w-[550px] xl:w-[650px] z-10">
          <GoogleMapSection
            listing={listing}
            coordinates={coordinates}
            boundingBox={boundingBox}
          />
        </div>
      </div>

      <div className="md:hidden space-y-8">
        <Listing
          listing={listing}
          handleSearchClick={handleSearchClick}
          searchedAddress={(address) => setSearchedAddress(address)}
          setCoordinates={setCoordinates}
          setBoundingBox={setBoundingBox}
          bedCount={bedCount}
          bathCount={bathCount}
          parkingCount={parkingCount}
          propertyType={propertyType}
          ownerName={ownerName}
          propertyValue={propertyValue}
          area={area}
          setBedCount={setBedCount}
          setBathCount={setBathCount}
          setParkingCount={setParkingCount}
          setPropertyType={setPropertyType}
          setOwnerName={setOwnerName}
          setPropertyValue={setPropertyValue}
          setArea={setArea}
        />
        <GoogleMapSection
          listing={listing}
          coordinates={coordinates}
          boundingBox={boundingBox}
        />
      </div>
    </div>
  );
};

export default ListingMapView;
