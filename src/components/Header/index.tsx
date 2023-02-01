import Image from 'next/image';

import { SignInButton } from '../SignInButton';

import styles from './styles.module.scss';
import logo from 'public/images/logo.svg';

export function Header () {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Image src={logo} alt="ig.news"/>
        <nav>
          <a className={styles.active}>Home</a>
          <a>Posts</a>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}