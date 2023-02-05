import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { query as q} from 'faunadb';

import { stripe } from '@/lib/stripe';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { faunaClient } from '@/lib/faunadb';

type User = {
  ref: {
    id: string;
  },
  data: {
    email: string;
    stripe_customer_id: string;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
    return;
  }

  // only proceed if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401).end('You must be logged in.');
    return;
  }

  const priceId = req.body.priceId as string;
  if(!priceId) {
    res.status(400).end('priceId not provided');
    return;
  }

  const userEmail = session.user.email!;
  const user = await faunaClient.query<User>(
    q.Get(
      q.Match(
        q.Index('user_by_email'),
        q.Casefold(userEmail)
      )
    )
  );
  
  let stripeCustomerId: string;
  try {
    // create new strapi customer and save in FaunaDB for future checkouts from same user
    if(!user || !user.data.stripe_customer_id){
      const stripeCustomer = await stripe.customers.create({
        email: userEmail,
        // metadata
      });
      
      stripeCustomerId = stripeCustomer.id;

      await faunaClient.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id), { 
            data: {
              stripe_customer_id: stripeCustomerId
            }
          }
        )
      );
    } else {
      stripeCustomerId = user.data.stripe_customer_id;
    }
  
  } catch (error: any) {
    console.log(`ERROR on creating Strapi customer::${error.message}`);
    res.status(error.statusCode || 500).end('Internal Server error');
    return;
  }
  
  // create stripe session
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      customer: stripeCustomerId,
      success_url: `${process.env.BASE_URL}/posts`,
      cancel_url: process.env.BASE_URL
    });
  
    res.status(200).json({ sessionUrl: stripeSession.url });
  } catch (error: any) {
    console.log(`ERROR on creating Strapi checkout session::${error.message}`);
    res.status(error.statusCode || 500).end('Internal Server error');
  }
}