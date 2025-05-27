import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { supabase } from "../utils/supabase/client";

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export async function askPropertyQuestion(question: string, listingId: string) {
  const { data: listing, error } = await supabase
    .from("listing")
    .select("*")
    .eq("id", listingId)
    .single();

  if (!listing) {
    return {
      output: "Listing Not Found",
    };
  }

  const context = `
  Real Estate Listing Information:
  - Address: ${listing.address}
  - Coordinates: ${listing.coordinates.lat}, ${listing.coordinates.lon}
  - Bounding Box: ${listing.boundingBox}
  - Created By: ${listing.createdBy}
  - Property URL: ${listing.property_url}
  - MLS: ${listing.mls}
  - MLS ID: ${listing.mls_id}
  - Status: ${listing.status}
  - Description: ${listing.description}
  - Style: ${listing.style}
  - Bedrooms: ${listing.bedroom}
  - Bathrooms: ${listing.bathroom}
  - Area: ${listing.area} sqft
  - Built In: ${listing.builtIn}
  - Days on MLS: ${listing.days_on_mls}
  - Price: $${listing.price}
  - Sold Price: $${listing.sold_price}
  - Assessed Value: $${listing.assessed_value}
  - Estimated Value: $${listing.estimated_value}
  - Tax: $${listing.tax}
  - Tax History: ${listing.tax_history}
  - New Construction: ${listing.new_construction ? "Yes" : "No"}
  - Lot Size: ${listing.lotSize} Acres
  - Price per Sqft: $${listing.price_per_sqft}
  - Neighborhoods: ${listing.neighborhoods}
  - County: ${listing.county}
  - FIPS Code: ${listing.fips_code}
  - Stories: ${listing.stories}
  - HOA: ${listing.hoa}
  - Parking: ${listing.parking}
  - Agent Name: ${listing.agent_name}
  - Agent Email: ${listing.agent_email}
  - Agent Phones: ${listing.agent_phones}
  - Agent MLS Set: ${listing.agent_mls_set}
  - Broker Name: ${listing.broker_name}
  - Office MLS Set: ${listing.office_mls_set}
  - Office Name: ${listing.office_name}
  - Office Email: ${listing.office_email}
  - Office Phones: ${listing.office_phones}
  - Nearby Schools: ${listing.nearby_schools}
  - Primary Photo URL: ${listing.primary_photo}
  - Alternative Photos: ${listing.alt_photos}
  `;

  const { text } = await generateText({
    model: google("gemini-1.5-flash"),
    prompt: `
      You are a highly knowledgeable and helpful AI real estate assistant. You analyze real estate listings and provide clear, concise answers to questions about properties.
      Your job is to provide accurate, insightful, and beginner-friendly answers to questions about a real estate property based on the listing context provided.

      The assistant is:
      - Professional, friendly, and informative.
      - Focused strictly on the context provided — never guessing or fabricating details.
      - Able to break down complex real estate terms and implications for home buyers, sellers, or investors.
      - Helpful for both first-time homebuyers and experienced investors seeking market data.

      START CONTEXT BLOCK
      ${context}
      END CONTEXT BLOCK

      START QUESTION
      ${question}
      END OF QUESTION

      Please base your answer entirely on the CONTEXT BLOCK. If the context does not provide the answer to the question, respond with:
      "I'm sorry, but I don't know the answer based on the provided information."
      Do not speculate or infer beyond the given data.
      `,
  });

  return {
    output: text,
  };
}
