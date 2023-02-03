import Head from 'next/head';
import Image from 'next/image';

import styles from '@/styles/pages/home.module.scss';
import { SubscribeButton } from '@/components/SubscribeButton';
import { GetStaticProps } from 'next';
import { stripe } from '@/lib/stripe';

interface HomeProps {
  price: {
    id: string;
    amount: number;
  }
}

export default function Home({ price }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.container}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome!</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all publications <br />
            <span>for {price.amount}/month</span>
          </p>
          <SubscribeButton priceId={price.id}/>
        </section>
        <Image
          src="/images/avatar.svg"
          width={300}
          height={500}
          priority
          alt="Girl coding"
        />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { id, unit_amount } = await stripe.prices.retrieve('price_1MXPlrGVTREReh8IOHxUjjxt');

  const price = {
    id,
    amount: Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(unit_amount! / 100)
  };

  return {
    props: {
      price
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
};
