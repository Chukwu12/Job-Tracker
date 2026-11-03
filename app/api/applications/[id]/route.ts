import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { STATUS_OPTIONS, SOURCE_OPTIONS } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/applications/[id]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const application = await db
      .collection("applications")
      .findOne({ _id: new ObjectId(id) });

    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Failed to fetch application:", error);
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 });
  }
}

// Fields a client is allowed to change. Anything else in the body
// (_id, createdAt, stray keys) is ignored.
const EDITABLE_FIELDS = [
  "company",
  "role",
  "status",
  "dateApplied",
  "salaryRange",
  "source",
  "contactEmail",
  "url",
  "notes",
] as const;

const REQUIRED_FIELDS = ["company", "role", "dateApplied"] as const;

// PATCH /api/applications/[id] — partial update (status change or full edit)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const updates: Record<string, string> = {};
    for (const field of EDITABLE_FIELDS) {
      if (typeof body[field] === "string") {
        updates[field] = body[field].trim();
      }
    }

    for (const field of REQUIRED_FIELDS) {
      if (field in updates && !updates[field]) {
        return NextResponse.json({ error: `${field} can't be empty` }, { status: 400 });
      }
    }

    if (body.status !== undefined && !STATUS_OPTIONS.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    if (body.source !== undefined && !SOURCE_OPTIONS.includes(body.source)) {
      return NextResponse.json({ error: "Invalid source" }, { status: 400 });
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("applications").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update application:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

// DELETE /api/applications/[id]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const result = await db
      .collection("applications")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete application:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
