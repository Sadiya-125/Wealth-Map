import { spawn } from "child_process";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const address = body.address;

  if (!address) {
    return NextResponse.json(
      { message: "Address is Required", listings: [] },
      { status: 400 }
    );
  }

  const scriptPath = path.join(
    process.cwd(),
    "scripts",
    "scrape_homeharvest.py"
  );

  return new Promise((resolve) => {
    const python = spawn("python3", [scriptPath, address]);

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      console.log("stdout:", data.toString());
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      console.error("stderr:", data.toString());
      errorOutput += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0 || errorOutput) {
        return resolve(
          NextResponse.json(
            { message: "Python Script Error", listings: [] },
            { status: 500 }
          )
        );
      }

      try {
        const lines = output.trim().split("\n");
        const lastLine = lines[lines.length - 1];
        const parsedListings = JSON.parse(lastLine);
        resolve(
          NextResponse.json({ listings: parsedListings }, { status: 200 })
        );
      } catch (e) {
        console.error("JSON Parse Error:", e.message);
        resolve(
          NextResponse.json(
            { message: "Failed to Parse JSON", listings: [] },
            { status: 500 }
          )
        );
      }
    });
  });
}
