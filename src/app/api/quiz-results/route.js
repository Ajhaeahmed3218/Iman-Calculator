import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

// GET - Fetch quiz results for authenticated user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    const results = await db
      .collection("quizResults")
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Convert ObjectId to string for JSON serialization
    const serializedResults = results.map((result) => ({
      ...result,
      _id: result._id.toString(),
    }));

    return NextResponse.json({ results: serializedResults });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Save a new quiz result
export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { score, totalQuestions, answers } = await request.json();

    if (typeof score !== "number" || typeof totalQuestions !== "number") {
      return NextResponse.json(
        { error: "Invalid quiz data" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const percentage = Math.round((score / (totalQuestions * 4)) * 100);

    const result = await db.collection("quizResults").insertOne({
      userId: session.user.id,
      score,
      totalQuestions,
      percentage,
      answers: answers || [],
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Quiz result saved successfully",
        resultId: result.insertedId.toString(),
        percentage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving quiz result:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
