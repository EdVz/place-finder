import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import User from '@/app/_models/User';

export async function POST(req: Request) {

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
    }

    //Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    //If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        });
    }

    //Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    //Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        })
    }

    //Get the ID and type
    const eventType = evt.type;

    try {
        let fullName;

        if (eventType === 'user.created') {
            if (payload.data.first_name && payload.data.last_name) {
                fullName = payload.data.first_name + ' ' + payload.data.last_name;
            }

            const user = await User.create({
                username: payload.data.username || fullName || 'User',
                imageUrl: payload.data.image_url,
                externalUserId: payload.data.id,
            });
        }

        if (eventType === 'user.updated') {
            const currentUser = await User.findOne({ externalUserId: payload.data.id });

            if (!currentUser) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }

            await User.updateOne(currentUser, {
                username: payload.data.username,
                imageUrl: payload.data.image_url,
            });
        }

        if (eventType === 'user.deleted') {
            await User.findOneAndDelete({ externalUserId: payload.data.id });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'There was an error', error }, { status: 500 });
    }

    return NextResponse.json({ message: 'User action successfully done' }, { status: 200 });
}