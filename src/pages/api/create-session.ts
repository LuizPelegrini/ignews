import { stripe } from '@/lib/stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import Stripe from 'stripe';

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}` 
  : process.env.LOCAL_BASE_URL || 'http://localhost:3000';

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

  // create stripe customer
  let stripeCustomer: Stripe.Response<Stripe.Customer>;
  try {
    stripeCustomer = await stripe.customers.create({
      email: session.user.email!,
      // metadata
    });
  
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
      customer: stripeCustomer.id,
      success_url: `${BASE_URL}/posts`,
      cancel_url: BASE_URL
    });
  
    res.status(200).json({ sessionUrl: stripeSession.url });
  } catch (error: any) {
    console.log(`ERROR on creating Strapi checkout session::${error.message}`);
    res.status(error.statusCode || 500).end('Internal Server error');
  }
}