import Head from 'next/head';
import Image from 'next/image';

import styles from '@/styles/pages/home.module.scss';
import { SubscribeButton } from '@/components/SubscribeButton';

export default function Home() {
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
            <span>for $9.90/month</span>
          </p>
          <SubscribeButton />
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
