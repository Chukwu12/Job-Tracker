import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getApplicationsCollection } from "@/lib/mongodb";

const VALID_STATUSES = ["Applied", "Interviewing", "Offer", "Rejected"] as const;

type Application = {
  _id: ObjectId;
  company: string;
  role: string;
  status: (typeof VALID_STATUSES)[number];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function GET() {
  const collection = await getApplicationsCollection();
  const applications = await collection
    .find<Application>({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(
    applications.map((application) => ({
      id: application._id.toString(),
      company: application.company,
      role: application.role,
      status: application.status,
      notes: application.notes,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    })),
  );
}

export async function POST(request: Request) {
  const body = await request.json();

  const company =
    typeof body.company === "string" ? body.company.trim() : "";
  const role = typeof body.role === "string" ? body.role.trim() : "";
  const status = typeof body.status === "string" ? body.status.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";

  if (!company || !status) {
    return NextResponse.json(
      { error: "Company and status are required." },
      { status: 400 },
    );
  }

  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    return NextResponse.json(
      { error: "Status is invalid." },
      { status: 400 },
    );
  }

  const now = new Date();
  const collection = await getApplicationsCollection();
  const result = await collection.insertOne({
    company,
    role,
    status,
    notes,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json(
    {
      id: result.insertedId.toString(),
      company,
      role,
      status,
      notes,
      createdAt: now,
      updatedAt: now,
    },
    { status: 201 },
  );
}
