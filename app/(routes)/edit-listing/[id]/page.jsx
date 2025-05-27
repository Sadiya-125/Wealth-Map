"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../utils/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

import {
  ArrowLeft,
  FileQuestion,
  Link as LinkIcon,
  Share2,
} from "lucide-react";
import { CustomChartToolTipContent } from "../../../_components/CustomChartToolTipContent";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { askPropertyQuestion } from "../../../../lib/property-question";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, CartesianGrid } from "recharts";

import {
  MapPin,
  User,
  Building2,
  Calendar,
  DollarSign,
  Home,
  Layers,
  Mail,
  Phone,
  Star,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import GoogleMapSection from "../../../_components/GoogleMapSection";

const EditListing = () => {
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from("listing")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error Fetching Listing:", error);
        toast.error("Failed to Load Listing");
      } else {
        setListing(data);
      }
      setLoading(false);
    };

    if (id) fetchListing();
  }, [id]);

  if (loading) {
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

  if (!listing) {
    return (
      <div className="flex items-center justify-center h-screen bg-white mt-[-120]">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-primary font-semibold text-lg">
            Listing Not Found
          </p>
        </div>
      </div>
    );
  }

  const fieldDisplay = (label, value, Icon) => {
    if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    )
      return null;
    return (
      <div className="flex items-center space-x-3 bg-muted rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-default">
        {Icon && (
          <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center text-primary">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex flex-col justify-center">
          <Label className="text-xs uppercase text-muted-foreground">
            {label}
          </Label>
          <p className="font-medium text-sm">{value}</p>
        </div>
      </div>
    );
  };

  const coordinates = listing.coordinates
    ? `${listing.coordinates.lat}, ${listing.coordinates.lon}`
    : null;

  const formattedDate = listing.created_at
    ? (() => {
        const date = new Date(listing.created_at);
        if (isNaN(date.getTime())) return null;

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
      })()
    : null;

  const parsedSchools = listing.nearby_schools
    ? Array.isArray(listing.nearby_schools)
      ? listing.nearby_schools.join(", ")
      : listing.nearby_schools
    : null;

  const parsePhones = (phones) => {
    if (!phones || !Array.isArray(phones)) return null;
    return phones
      .map(
        (p) =>
          `${p.type}${p.ext ? ` ext.${p.ext}` : ""}: ${p.number}${
            p.primary ? " (Primary)" : ""
          }`
      )
      .join(", ");
  };

  const images = [];

  if (listing.primary_photo) {
    images.push({ src: listing.primary_photo, alt: "Primary Photo" });
  }

  if (listing.alt_photos) {
    const altPhotosArray = listing.alt_photos
      .split(",")
      .map((url) => url.trim());

    altPhotosArray.slice(1).forEach((url, idx) => {
      if (url) images.push({ src: url, alt: `Alt Photo ${idx + 1}` });
    });
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/edit-listing/${listing.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied to Clipboard");
    } catch (error) {
      toast.error("Failed to Copy");
      console.error("Clipboard Copy Failed:", error);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      toast.error("Please Enter a Question");
      return;
    }

    setAnswer("");
    setQuestionLoading(true);

    try {
      const { output } = await askPropertyQuestion(question, listing.id);
      setAnswer(output);
    } catch (error) {
      console.error("Error Asking Question:", error);
      toast.error("Failed to Ask Question");
    } finally {
      setQuestionLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{listing.address}</DialogTitle>
            <DialogDescription>{formattedDate}</DialogDescription>
          </DialogHeader>

          <p className="text-gray-600">
            {listing.coordinates
              ? `Coordinates: ${listing.coordinates.lat}, ${listing.coordinates.lon}`
              : "No Coordinates Available"}
          </p>
          <blockquote className="mt-2 border-l-4 border-gray-300 bg-gray-50 p-4">
            <span className="text-sm text-gray-600">
              {listing.createdBy
                ? `Owned by ${listing.agent_name}`
                : "Created by Unknown"}
            </span>
            <p className="leading-relaxed font-medium text-gray-900 italic">
              {listing.description.substring(0, 500) + "..."}
            </p>
          </blockquote>

          <div className="mt-2 space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Ask for Further Clarification...
            </label>
            <Textarea
              placeholder="What did you mean by..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-2"
            />
            <p className="text-muted-foreground text-xs">
              Wealth Map has context about this Property and it&apos;s Owner.
            </p>
          </div>

          {questionLoading ? (
            <div className="space-y-2 mt-4">
              <p className="text-sm font-semibold">Generating Answer...</p>
              <div className="space-y-2 animate-pulse">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-5/6 rounded bg-gray-200" />
              </div>
            </div>
          ) : (
            answer && (
              <div className="text-md whitespace-pre-wrap mt-4">
                <p className="text-sm font-semibold">Answer</p>
                {answer}
              </div>
            )
          )}

          <div className="flex justify-end">
            <Button onClick={handleAsk} disabled={questionLoading}>
              Ask Question
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Card className="bg-card shadow-xl rounded-2xl p-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-[-5]">
            <CardTitle className="text-3xl font-extrabold tracking-tight">
              Property Details
            </CardTitle>

            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-3">
              <div className="flex items-center bg-muted rounded-full px-1.5 py-1.5 shadow-sm hover:shadow-md transition-shadow cursor-default text-sm md:text-md">
                <div className="flex flex-col justify-center">
                  <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    className="bg-transparent hover:bg-muted border-none shadow-none w-10 h-10 rounded-full md:ml-0 ml-10 flex items-center justify-center"
                  >
                    <FileQuestion className="w-10 h-10 text-primary" />
                    <p className="md:hidden">Ask</p>
                  </Button>
                </div>
              </div>

              <div className="flex items-center bg-muted rounded-full px-1.5 py-1.5 shadow-sm hover:shadow-md transition-shadow cursor-default text-sm md:text-md">
                <div className="flex flex-col justify-center">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="bg-transparent hover:bg-muted border-none shadow-none w-10 h-10 rounded-full md:ml-0 ml-10 flex items-center justify-center"
                  >
                    <Share2 className="w-10 h-10 text-primary" />
                    <p className="md:hidden">Share</p>
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-muted rounded-md px-3 py-2 shadow-sm hover:shadow-md transition-shadow cursor-default text-sm md:text-md">
                <div className="w-5 h-5 flex items-center justify-center text-primary">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <Label className="text-[11px] uppercase text-muted-foreground">
                    Created At
                  </Label>
                  <p className="font-medium text-sm">{formattedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.length > 0 && (
            <div className="md:col-span-2 rounded-lg overflow-hidden shadow-lg relative">
              <Carousel>
                <CarouselContent>
                  {images.map(({ src, alt }, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative w-full h-[400px] md:h-[500px]">
                        <img
                          src={src}
                          alt={alt}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-lg pointer-events-none" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full p-2 shadow-md cursor-pointer z-10">
                  &#8592;
                </CarouselPrevious>

                <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-2 shadow-md cursor-pointer z-10">
                  &#8594;
                </CarouselNext>
              </Carousel>
            </div>
          )}
          {fieldDisplay(
            "Address",
            listing.full_street_line || listing.address,
            MapPin
          )}
          {fieldDisplay("Coordinates", coordinates, MapPin)}
          {fieldDisplay("Created By", listing.createdBy, User)}
          {fieldDisplay("MLS", listing.mls, Layers)}
          {fieldDisplay("MLS ID", listing.mls_id, Layers)}
          {fieldDisplay("Days on MLS", listing.days_on_mls, Calendar)}

          {fieldDisplay("Status", listing.status, Star)}
          {fieldDisplay("Style", listing.style, Home)}
          {fieldDisplay("Bedrooms", listing.beds ?? listing.bedroom, Building2)}
          {fieldDisplay(
            "Bathrooms",
            listing.full_baths ?? listing.bathroom,
            Building2
          )}
          {fieldDisplay("Half Baths", listing.half_baths, Building2)}
          {fieldDisplay("Area (sqft)", listing.sqft ?? listing.area, Home)}
          {fieldDisplay(
            "Lot Size (sqft)",
            listing.lot_sqft ?? listing.lotSize,
            Home
          )}

          {fieldDisplay(
            "List Price",
            listing.list_price ?? listing.price,
            DollarSign
          )}
          {fieldDisplay("Sold Price", listing.sold_price, DollarSign)}
          {fieldDisplay("Assessed Value", listing.assessed_value, DollarSign)}
          {fieldDisplay("Estimated Value", listing.estimated_value, DollarSign)}
          {fieldDisplay("Price per Sqft", listing.price_per_sqft, DollarSign)}

          {fieldDisplay("Tax", listing.tax, DollarSign)}
          {fieldDisplay(
            "Built In",
            listing.year_built ?? listing.builtIn,
            Calendar
          )}
          {fieldDisplay("Neighborhoods", listing.neighborhoods, Layers)}
          {fieldDisplay("County", listing.county, Layers)}
          {fieldDisplay("FIPS Code", listing.fips_code, Layers)}
          {fieldDisplay("HOA Fee", listing.hoa_fee ?? listing.hoa, DollarSign)}
          {fieldDisplay("Stories", listing.stories, Building2)}

          {fieldDisplay(
            "Parking Garage",
            listing.parking_garage ?? listing.parking,
            Building2
          )}

          {fieldDisplay("Agent MLS Set", listing.agent_mls_set, Layers)}
          {fieldDisplay("Agent Name", listing.agent_name, User)}
          {fieldDisplay("Agent Email", listing.agent_email, Mail)}
          {fieldDisplay(
            "Agent Phones",
            parsePhones(listing.agent_phones),
            Phone
          )}

          {fieldDisplay("Broker Name", listing.broker_name, User)}

          {fieldDisplay("Office MLS Set", listing.office_mls_set, Layers)}
          {fieldDisplay("Office Name", listing.office_name, Building2)}
          {fieldDisplay("Office Email", listing.office_email, Mail)}
          {fieldDisplay(
            "Office Phones",
            parsePhones(listing.office_phones),
            Phone
          )}

          {fieldDisplay(
            "New Construction",
            listing.new_construction ? "Yes" : "No",
            Building2
          )}

          {fieldDisplay("Nearby Schools", parsedSchools, Building2)}
          {fieldDisplay(
            "Property URL",
            <a
              href={listing.property_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-words break-all max-w-full block"
              style={{ overflowWrap: "break-word" }}
            >
              {listing.property_url}
            </a>,
            LinkIcon
          )}
          {listing.tax_history &&
            (() => {
              let parsed;
              try {
                parsed = JSON.parse(listing.tax_history);
              } catch {
                return fieldDisplay(
                  "Tax History",
                  "Invalid Format",
                  DollarSign
                );
              }

              const chartData = parsed
                .map((entry) => ({
                  year: entry.year,
                  tax: entry.tax ?? 0,
                  totalAssessment: entry.assessment?.total ?? 0,
                }))
                .sort((a, b) => a.year - b.year);

              const chartConfig = {
                tax: { label: "Tax", color: "#2563eb" },
                totalAssessment: {
                  label: "Total Assessment",
                  color: "#60a5fa",
                },
              };

              return (
                <div className="col-span-full space-y-6">
                  {/* Box 1: Table */}
                  <div className="bg-muted p-4 rounded-lg shadow-sm overflow-auto">
                    <Label className="text-xs uppercase text-muted-foreground block mb-2">
                      Tax History
                    </Label>
                    <table className="min-w-full text-sm border-collapse">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="p-2">Year</th>
                          <th className="p-2">Tax</th>
                          <th className="p-2">Assessment (Building)</th>
                          <th className="p-2">Assessment (Land)</th>
                          <th className="p-2">Assessment (Total)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsed.map((entry, i) => (
                          <tr key={i} className="border-b hover:bg-muted/40">
                            <td className="p-2">{entry.year}</td>
                            <td className="p-2">
                              ${entry.tax?.toLocaleString()}
                            </td>
                            <td className="p-2">
                              {entry.assessment?.building?.toLocaleString() ??
                                "-"}
                            </td>
                            <td className="p-2">
                              {entry.assessment?.land?.toLocaleString() ?? "-"}
                            </td>
                            <td className="p-2">
                              {entry.assessment?.total?.toLocaleString() ?? "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Box 2: Charts */}
                  <div className="bg-muted p-4 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Tax Chart */}
                      <ChartContainer
                        config={{ tax: chartConfig.tax }}
                        className="h-[300px] w-full"
                      >
                        <BarChart accessibilityLayer data={chartData}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="year"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                          />
                          <ChartTooltip
                            content={<CustomChartToolTipContent />}
                          />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Bar
                            dataKey="tax"
                            fill="var(--color-tax)"
                            radius={4}
                          />
                        </BarChart>
                      </ChartContainer>

                      {/* Total Assessment Chart */}
                      <ChartContainer
                        config={{
                          totalAssessment: chartConfig.totalAssessment,
                        }}
                        className="h-[300px] w-full"
                      >
                        <BarChart accessibilityLayer data={chartData}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="year"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                          />
                          <ChartTooltip
                            content={<CustomChartToolTipContent />}
                          />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Bar
                            dataKey="totalAssessment"
                            fill="var(--color-totalAssessment)"
                            radius={4}
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>
                  </div>
                </div>
              );
            })()}

          <div className="col-span-full">
            {fieldDisplay("Description", listing.description, null)}
          </div>

          <div className="col-span-full">
            <GoogleMapSection
              listing={[listing]}
              coordinates={{
                lon: listing.coordinates.lon,
                lat: listing.coordinates.lat,
              }}
              boundingBox={listing.boundingBox}
            />
          </div>

          <div className="flex">
            <Link
              href={"/"}
              className="inline-flex items-center gap-2 px-3 py-3 border border-input rounded-md text-sm font-medium hover:bg-muted transition w-fit"
            >
              <ArrowLeft className="w-4 h-4 text-primary" />
              Back
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditListing;
