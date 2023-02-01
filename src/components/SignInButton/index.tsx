import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi'
import styles from './styles.module.scss';

export function SignInButton () {
  const isUserLoggedIn = true;


  return isUserLoggedIn ? (
    <button className={ styles.signInButton } type="button">
      <FaGithub size={22} color="#04D361"/>
      Luiz Guilherme
      <FiX size={22} color="#737380"/>
    </button>
  ) : (
    <button className={ styles.signInButton } type="button">
      <FaGithub size={22} color="#EBA417"/>
      Sign In with Github
    </button>
  );
}