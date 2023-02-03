import Stripe from 'stripe';
import projectInfo from '../../package.json';

if(!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY env variable not found");
}

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY,
  {
    apiVersion: '2022-11-15',
    appInfo: {
      name: 'Ignews',
      version: projectInfo.version
    }
  }
)