import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME } from "@/src/lib/s3";

export async function POST(request: NextRequest) {
    try {
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
            }
        );

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "You must be logged in" },
                { status: 401 }
            );
        }

        const { fileKeys } = await request.json();

        if (!Array.isArray(fileKeys) || fileKeys.length === 0) {
            return NextResponse.json(
                { error: "fileKeys must be a non-empty array" },
                { status: 400 }
            );
        }

        const { data: mediaRecords, error: dbError } = await supabase
            .from("media")
            .select("file_key")
            .in("file_key", fileKeys)
            .eq("user_id", user.id);

        if (dbError) {
            console.error("Database error: ", dbError);
            return NextResponse.json(
                { error: "Failed to verify files" },
                { status: 500 }
            );
        }

        const signedUrls: Record<string, string> = {};

        for (const record of mediaRecords) {
            const command = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: record.file_key,
            });

            const url = await getSignedUrl(s3Client, command, {
                expiresIn: 3600,
            });

            signedUrls[record.file_key] = url;
        }
        return NextResponse.json({ urls: signedUrls });
    } catch (error) {
        console.error("Batch signed URL error: ", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}