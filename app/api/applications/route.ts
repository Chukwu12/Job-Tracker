import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import type { Application } from "@/lib/types";

// GET /api/applications — list all applications, most recently applied first
export async function GET() {
  try {
    const db = await getDb();
    const applications = await db
      .collection<Application>("applications")
      .find({})
      .sort({ dateApplied: -1 })
      .toArray();

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// POST /api/applications — create a new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.company || !body.role || !body.dateApplied) {
      return NextResponse.json(
        { error: "company, role, and dateApplied are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newApplication: Omit<Application, "_id"> = {
      company: body.company,
      role: body.role,
      status: body.status || "Applied",
      dateApplied: body.dateApplied,
      salaryRange: body.salaryRange || "",
      source: body.source || "Other",
      contactEmail: body.contactEmail || "",
      url: body.url || "",
      notes: body.notes || "",
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDb();
    const result = await db.collection("applications").insertOne(newApplication);

    return NextResponse.json(
      { ...newApplication, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
