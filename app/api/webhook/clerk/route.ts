import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
 
export async function POST(req: Request) {
  // Webhookシークレットを取得
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }
 
  // リクエストヘッダーを取得
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
 
  // 必要なヘッダーが存在することを確認
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }
 
  // リクエストボディを取得
  const payload = await req.json();
  const body = JSON.stringify(payload);
 
  // Webhookインスタンスを作成
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt: WebhookEvent;
 
  // Webhookを検証
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }
 
  // イベントタイプに基づいて処理
  const eventType = evt.type;
 
  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(' ');

    // ユーザーをデータベースに作成
    await prisma.user.create({
      data: {
        clerkId: id,
        email: primaryEmail,
        name: name || null,
        imageUrl: image_url,
        subscription: {
          create: {
            plan: 'free',
            status: 'active'
          }
        },
        preferences: {
          create: {
            articlesPerSource: 5,
            darkMode: false
          }
        }
      }
    });
  }
 
  return new Response('', { status: 200 });
}