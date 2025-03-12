// import { NextResponse } from 'next/server';

// export async function GET() {
//   if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
//     return res.status(401).end('Unauthorized');
//   }

//   return NextResponse.json({ ok: true });
// }

import type { NextRequest } from 'next/server';
 
export function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }
 
  return Response.json({ success: true });
}