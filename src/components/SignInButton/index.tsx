import { signIn, signOut, useSession } from 'next-auth/react';

import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi'
import styles from './styles.module.scss';

export function SignInButton () {
  const { data: session } = useSession();

  // checks if user is logged in
  return session ? (
    <button 
      className={ styles.signInButton } 
      type="button"
      onClick={() => signOut()}
    >
      <FaGithub size={22} color="#04D361"/>
      {session.user?.name}
      <FiX size={22} color="#737380"/>
    </button>
  ) : (
    <button 
      className={ styles.signInButton } 
      type="button" 
      onClick={() => signIn('github')}
    >
      <FaGithub size={22} color="#EBA417"/>
      Sign In with Github
    </button>
  );
}