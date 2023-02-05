import { useSession, signIn } from 'next-auth/react';
import styles from './styles.module.scss';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton ({ priceId }: SubscribeButtonProps) {
  const { status } = useSession();

  async function handleSubscribe () {
    // if user tries to subscribe without being logged in
    if(status === 'unauthenticated') {
      signIn('github');
      return;
    }

    const response = await fetch('/api/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        priceId
      })
    });
    const { sessionUrl } = await response.json();

    window.location.href = sessionUrl;
  }

  return (
    <button
      type="button"
      className={styles.container}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}