import { NextResponse } from "next/server";
import pc, { INDEX_NAME } from "../pinecone.js";

export async function GET(request) {
  try {
    const queryResponse = await pc.index(INDEX_NAME).describeIndexStats();

    return NextResponse.json(queryResponse);
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await pc.index(INDEX_NAME).deleteAll();
    return NextResponse.json({
      message: "Successfully deleted the index",
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
