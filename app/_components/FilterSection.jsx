"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import clsx from "clsx";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import {
  Bath,
  BedDouble,
  CarFront,
  Ruler,
  User,
  DollarSign,
  Home,
  MoveHorizontal,
  TimerReset,
  CircleDollarSign,
} from "lucide-react";
import { useState } from "react";

const FilterSection = ({
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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 w-full sm:w-28 h-10 text-md"
        >
          <Filter className="h-4 w-4 text-primary" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-xl font-extrabold tracking-tight">
            Property Filters
          </SheetTitle>
        </SheetHeader>

        <div className="mt-[-20]">
          <div className="px-3 py-4 grid grid-cols-1 gap-4">
            <Select value={bedCount?.toString()} onValueChange={setBedCount}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex gap-2 items-center">
                      <BedDouble className="h-5 w-5 text-primary" /> {num}+
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={bathCount?.toString()} onValueChange={setBathCount}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bathrooms" />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex gap-2 items-center">
                      <Bath className="h-5 w-5 text-primary" /> {num}+
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={parkingCount?.toString()}
              onValueChange={setParkingCount}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Parking" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    <div className="flex gap-2 items-center">
                      <CarFront className="h-5 w-5 text-primary" /> {num}+
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={area?.toString()} onValueChange={setArea}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "< 3000 sqft",
                  "3000 - 5000 sqft",
                  "5000 - 7000 sqft",
                  "> 7000 sqft",
                ].map((area, i) => (
                  <SelectItem key={i} value={area}>
                    <div className="flex gap-2 items-center">
                      <Ruler className="h-5 w-5 text-primary" /> {area}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={propertyType?.toString()}
              onValueChange={(value) =>
                value == "ALL" ? setPropertyType(null) : setPropertyType(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "ALL", label: "All Types", icon: <User /> },
                  { value: "FOR_SALE", label: "For Sale", icon: <Home /> },
                  {
                    value: "FOR_RENT",
                    label: "For Rent",
                    icon: <MoveHorizontal />,
                  },
                  { value: "SOLD", label: "Sold", icon: <TimerReset /> },
                  {
                    value: "PENDING",
                    label: "Pending",
                    icon: <CircleDollarSign />,
                  },
                  {
                    value: "CONTINGENT",
                    label: "Contingent",
                    icon: <DollarSign />,
                  },
                ].map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex gap-2 items-center">
                      {type.icon} {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div
              className={clsx(
                "flex items-center h-9 px-3 py-2 rounded-md border border-input bg-background text-sm shadow-sm",
                "focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1"
              )}
            >
              <User className="h-4 w-4 text-primary mr-2" />
              <Input
                type="text"
                placeholder="Owner Name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="border-none shadow-none text-sm focus-visible:ring-0 focus-visible:ring-transparent focus:outline-none p-0 w-full bg-transparent"
              />
            </div>

            <div className="col-span-full">
              <div className="rounded-md border bg-background p-4 shadow-sm w-full">
                <div className="ml-[-5px]">
                  <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Property Value
                    <div className="ml-auto text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        ${propertyValue[0].toLocaleString()} – $
                        {propertyValue[1].toLocaleString()}
                      </span>
                    </div>
                  </label>
                  <Slider
                    min={0}
                    max={5000000}
                    step={10000}
                    value={propertyValue}
                    onValueChange={(value) => setPropertyValue(value)}
                    className="w-full mb-2"
                  />
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full mt-2"
              onClick={() => {
                setBedCount("");
                setBathCount("");
                setParkingCount("");
                setPropertyType(null);
                setOwnerName("");
                setPropertyValue([0, 5000000]);
                setArea("");
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSection;
