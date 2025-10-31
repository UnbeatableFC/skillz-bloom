// app/api/clerk-webhook/route.ts (or pages/api/clerk-webhook.ts)
import { Webhook } from 'svix';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const payload = await req.json();
  const headers = req.headers;
  
  if (!WEBHOOK_SECRET) {
    throw new Error('Please set CLERK_WEBHOOK_SECRET in your .env');
  }

  const svix_id = headers.get("svix-id");
  const svix_timestamp = headers.get("svix-timestamp");
  const svix_signature = headers.get("svix-signature");
  
  // Verify the webhook signature for security
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- missing svix headers', { status: 400 });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt :any;
  
  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Error occured', { status: 400 });
  }

  console.log('Webhook Verified. Event Type:', evt.type);

  // Handle the 'user.created' event
  if (evt.type === 'user.created') {
    const { id, email_addresses } = evt.data;
    const userEmail = email_addresses[0].email_address;
    
    // ⭐️ Key Step: Create the user document in Firestore
    await setDoc(doc(db, "users", id), {
      clerkId: id,
      email: userEmail,
      onboardingComplete: false, // ⬅️ IMPORTANT: Flag to control redirection
      createdAt: new Date(),
    });
    
    console.log(`User ${id} created in Firestore.`);
  }

  return new Response('Success', { status: 200 });
}