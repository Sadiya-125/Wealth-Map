"use client";

import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BathIcon, BedDouble, MapPin, Ruler } from "lucide-react";
import Link from "next/link";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MyListings = () => {
  const { user } = useUser();
  const [listing, setListing] = useState([]);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [open, setOpen] = useState(false);

  const getUserListing = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("listing")
      .select("*")
      .eq("createdBy", user?.primaryEmailAddress?.emailAddress);

    if (error) {
      console.error("Error Fetching Listings:", error.message);
      return;
    }

    setListing(data);
  };

  useEffect(() => {
    getUserListing();
  }, [user]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <h2 className="font-bold text-3xl text-center mb-8">
        Manage Your Listings
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {listing?.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition-shadow duration-300 hover:border hover:border-primary"
          >
            <div className="relative w-full h-[200px]">
              <Image
                src={item.primary_photo}
                fill
                alt={item.address}
                className="rounded-lg object-cover"
              />
            </div>
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
              <div className="flex gap-4 mt-4">
                <Link
                  href={`/edit-listing/${item.id}`}
                  target="_blank"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    View
                  </Button>
                </Link>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex-1 w-full"
                      onClick={() => {
                        setSelectedListingId(item.id);
                        setOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Do you really want to delete this listing?
                      </DialogTitle>
                      <DialogDescription>
                        You will lose all data associated with this listing.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setOpen(false) && setSelectedListingId(null)
                          }
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          if (!selectedListingId) return;
                          const { error } = await supabase
                            .from("listing")
                            .delete()
                            .eq("id", selectedListingId);
                          if (error) {
                            console.error("Delete Error:", error.message);
                          } else {
                            setOpen(false);
                            await getUserListing();
                            setSelectedListingId(null);
                          }
                        }}
                      >
                        Confirm Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
        {listing?.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No Listings Found
          </p>
        )}
      </div>
    </div>
  );
};

export default MyListings;
