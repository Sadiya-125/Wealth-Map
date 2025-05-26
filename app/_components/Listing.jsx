import { BathIcon, BedDouble, MapPin, Ruler, Search } from "lucide-react";
import Image from "next/image";
import GoogleAddressSearch from "./GoogleAddressSearch";
import { Button } from "@/components/ui/button";
import FilterSection from "./FilterSection";
import { useState } from "react";
import Link from "next/link";

const Listing = ({
  listing,
  handleSearchClick,
  searchedAddress,
  setCoordinates,
  setBoundingBox,
  bedCount,
  bathCount,
  parkingCount,
  propertyType,
  ownerName,
  propertyValue,
  area,
  setBedCount,
  setBathCount,
  setParkingCount,
  setPropertyType,
  setOwnerName,
  setPropertyValue,
  setArea,
}) => {
  const [address, setAddress] = useState("");
  return (
    <div className="mt-[-90]">
      <div className="p-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2">
        <div className="w-auto sm:w-full">
          <GoogleAddressSearch
            onSelectAddress={(value) => {
              setAddress(value.address);
              searchedAddress(value.address);
              setCoordinates({ lat: value.lat, lon: value.lon });
              setBoundingBox(value.boundingBox);
            }}
          />
        </div>

        <Button
          className="flex gap-2 w-full sm:w-28 h-10 text-md sm:mt-10 mt-0"
          onClick={handleSearchClick}
        >
          <Search className="h-4 w-4" /> Search
        </Button>

        <div className="w-full sm:w-auto sm:mt-10 mt-0">
          <FilterSection
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
      </div>

      {address && (
        <div className="px-3 py-3">
          <h2 className="text-md">
            Found <span className="font-bold">{listing?.length}</span>{" "}
            {listing?.length !== 1 ? "Results" : "Result"} in{" "}
            <span className="text-primary font-bold">{address}</span>
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {listing?.length > 0
          ? listing.map((item, index) => (
              <Link
                href={`/edit-listing/${item.id}`}
                key={index}
                target="_blank"
                className="block"
              >
                <div className="p-3 hover:border hover:border-primary cursor-pointer rounded-lg">
                  <Image
                    src={item.primary_photo}
                    width={800}
                    height={150}
                    alt={item.address}
                    className="rounded-lg object-cover h-[170px]"
                  />
                  <div className="flex mt-2 flex-col gap-2">
                    <h2 className="font-bold text-xl">${item.price}</h2>

                    <div className="flex items-center space-x-3 text-gray-400">
                      <div className="flex-shrink-0 flex">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <p className="text-sm">{item.address}</p>
                    </div>

                    <div className="flex gap-2 mt-2 justify-between">
                      <h2 className="flex gap-2 text-sm bg-slate-100 rounded-md p-2 w-full text-gray-500 justify-center items-center">
                        <BedDouble className="h-4 w-4" />
                        {item?.bedroom}
                      </h2>
                      <h2 className="flex gap-2 text-sm bg-slate-100 rounded-md p-2 w-full text-gray-500 justify-center items-center">
                        <BathIcon className="h-4 w-4" />
                        {item?.bathroom}
                      </h2>
                      <h2 className="flex gap-2 text-sm bg-slate-100 rounded-md p-2 w-full text-gray-500 justify-center items-center">
                        <Ruler className="h-4 w-4" />
                        {item?.area}
                      </h2>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
              <div
                key={index}
                className="h-[230px] w-full mt-3 bg-slate-200 animate-pulse rounded-lg"
              ></div>
            ))}
      </div>
    </div>
  );
};

export default Listing;
