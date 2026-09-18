import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

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

// PATCH /api/applications/[id] — partial update (e.g. status change)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const updates = await request.json();
    delete updates._id; // never allow overwriting the id

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
