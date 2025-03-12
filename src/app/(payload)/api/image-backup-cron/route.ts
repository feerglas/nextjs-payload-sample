import { Readable } from "node:stream";
import { S3Client } from "@aws-sdk/client-s3";
import { list } from "@vercel/blob";
import { Upload } from "@aws-sdk/lib-storage";
import type { NextRequest } from "next/server";
import type { ReadableStream } from "node:stream/web";
 
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
 
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.OVH_OS_ACCESS_PUBLIC_KEY || '',
      secretAccessKey: process.env.OVH_OS_ACCESS_PRIVATE_KEY || '',

    },
    endpoint: process.env.OVH_OS_IMAGES_BACKUP_CONTAINER_ENDPOINT,
  });
 
  let cursor: string | undefined;
 
  do {
    const listResult = await list({
      cursor,
      limit: 250,
    });
 
    if (listResult.blobs.length > 0) {
      await Promise.all(
        listResult.blobs.map(async (blob) => {
          const res = await fetch(blob.url);
          if (res.body) {
            const parallelUploads3 = new Upload({
              client: s3,
              params: {
                Bucket: process.env.OVH_OS_IMAGES_BACKUP_CONTAINER_ID,
                Key: blob.pathname,
                Body: Readable.fromWeb(res.body as ReadableStream),
              },
              leavePartsOnError: false,
            });
 
            await parallelUploads3.done();
          }
        })
      );
    }
 
    cursor = listResult.cursor;
  } while (cursor);
 
  return new Response("Backup done!");
}