import React, { useEffect } from 'react';
import { auth, getUserInfoByUid } from '../firebase/index';
import { onAuthStateChanged } from 'firebase/auth';
import userState from '../zustand/store';

const AuthProvider = ({
  children,
  onUserLoggedInButNotCompleted,
  onUserLoggedIn,
  onNewUser,
}) => {
  const { user, setUser } = userState();

  useEffect(() => {
    onAuthStateChanged(auth, handleStateChanged);
  }, []);

  async function handleStateChanged(userAuth) {
    // console.log(userAuth);

    /* No user */
    if (!userAuth) {
      // console.log('New user');
      onNewUser();
      return;
    }

    /* User */
    // TODO: Check user process
    const userInfo = await getUserInfoByUid(userAuth.uid);
    // console.log(userInfo);
    if (userInfo?.processCompleted) {
      // console.log('Logged In');
      onUserLoggedIn(userInfo);
      setUser(userInfo);
      return;
    } else {
      // console.log('Incompleted');
      setUser(userInfo);
      onUserLoggedInButNotCompleted();
    }
  }

  return <>{children}</>;
};

export default AuthProvider;
