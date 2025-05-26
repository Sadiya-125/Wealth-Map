import sys
import json
import numpy as np
import pandas as pd
from homeharvest import scrape_property

import os

os.environ.pop("CURL_CA_BUNDLE", None)
os.environ["SSL_CERT_FILE"] = r"C:\Users\Lapto\anaconda3\Library\ssl\cacert.pem"

address = sys.argv[1]
parts = address.split(",")
address = ",".join(parts[:3]).strip()

listing_types = ["for_sale", "for_rent", "sold", "pending"]
results = []

def safe_value(val):
    if isinstance(val, (list, np.ndarray)):
        return val if len(val) > 0 else None
    if pd.isna(val):
        return None
    return val

found = False

for listing_type in listing_types:
    if found:
        break
    try:
        props = scrape_property(location=address, listing_type=listing_type, limit=1)
        if not props.empty:
            for _, row in props.iterrows():
                entry = {
                    "property_url": safe_value(row.get("property_url")),
                    "mls": safe_value(row.get("mls")),
                    "mls_id": safe_value(row.get("mls_id")),
                    "status": safe_value(row.get("status")),
                    "description": safe_value(row.get("text")),
                    "style": safe_value(row.get("style")),
                    "bedroom": safe_value(row.get("beds")),
                    "bathroom": (
                        (safe_value(row.get("full_baths")) or 0)
                        + (safe_value(row.get("half_baths")) or 0)
                    ),
                    "area": safe_value(row.get("sqft")),
                    "builtIn": safe_value(row.get("year_built")),
                    "days_on_mls": safe_value(row.get("days_on_mls")),
                    "price": safe_value(row.get("list_price")),
                    "sold_price": safe_value(row.get("sold_price")),
                    "assessed_value": safe_value(row.get("assessed_value")),
                    "estimated_value": safe_value(row.get("estimated_value")),
                    "tax": safe_value(row.get("tax")),
                    "tax_history": safe_value(row.get("tax_history")),
                    "new_construction": safe_value(row.get("new_construction")),
                    "lotSize": safe_value(row.get("lot_sqft")),
                    "price_per_sqft": safe_value(row.get("price_per_sqft")),
                    "neighborhoods": safe_value(row.get("neighborhoods")),
                    "county": safe_value(row.get("county")),
                    "fips_code": safe_value(row.get("fips_code")),
                    "stories": safe_value(row.get("stories")),
                    "hoa": safe_value(row.get("hoa_fee")),
                    "parking": safe_value(row.get("parking_garage")),
                    "agent_name": safe_value(row.get("agent_name")),
                    "agent_email": safe_value(row.get("agent_email")),
                    "agent_phones": safe_value(row.get("agent_phones")),
                    "agent_mls_set": safe_value(row.get("agent_mls_set")),
                    "broker_name": safe_value(row.get("broker_name")),
                    "office_mls_set": safe_value(row.get("office_mls_set")),
                    "office_name": safe_value(row.get("office_name")),
                    "office_email": safe_value(row.get("office_email")),
                    "office_phones": safe_value(row.get("office_phones")),
                    "nearby_schools": safe_value(row.get("nearby_schools")),
                    "primary_photo": safe_value(row.get("primary_photo")),
                    "alt_photos": safe_value(row.get("alt_photos"))
                }
                results.append(entry)
                found = True
                break
    except Exception as e:
        continue

print(json.dumps(results))