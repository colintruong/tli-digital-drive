import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "@/src/lib/s3";
import {
  generateFileKey,
  getFileType,
  isValidFileType,
  isValidFileSize,
} from "@/src/utils/file";

export async function POST(request: NextRequest) {
  try {
    // Authenticating the request
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      },
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "You must be logged in",
        },
        { status: 401 },
      );
    }

    // Extract file
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate server side
    if (!isValidFileType(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images and videos are allowed" },
        { status: 400 },
      );
    }

    if (!isValidFileSize(file.size)) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5GB." },
        { status: 400 },
      );
    }

    // Generate S3 key
    const fileKey = generateFileKey(user.id, file.name);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Uplaod to S3
    try {
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      });

      await s3Client.send(uploadCommand);
    } catch (s3Error) {
      console.error("S3 upload error:", s3Error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // Save metadata to Supabase
    const { data: mediaData, error: dbError } = await supabase
      .from("media")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_key: fileKey,
        file_type: getFileType(file.type),
        mime_type: file.type,
        file_size: file.size,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save file info" },
        { status: 500 },
      );
    }

    // Success
    return NextResponse.json({ success: true, media: mediaData });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
