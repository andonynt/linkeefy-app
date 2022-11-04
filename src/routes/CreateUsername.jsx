import React, { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { BsCheckCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import {
  auth,
  getInfoByUsername,
  createNewUser,
  userExists,
} from '../firebase/index';
import {
  isSignInWithEmailLink,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import Loader from '../components/shared/Loader';
import { AuthProvider } from '../components/componentsDispatcher';

import userState from '../zustand/store';

const STYLES = {
  wrong: 'text-red-600',
  success: 'text-green-600',
};

const CreateUsername = () => {
  const { user } = userState();

  const [isLoading, setIsLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState(null);

  const navigate = useNavigate();

  const EMAIL = user?.email || window.localStorage.getItem('email');
  /* Input refs */
  const usernameRef = useRef(),
    passwordRef = useRef(),
    confirmPasswordRef = useRef();

  const [formMessage, setFormMessage] = useState({
    message: '',
    type: '',
  });

  // TODO: Verify username is already available
  const [correct, setCorrect] = useState(false);

  /* 
    Handle Check username
  */
  async function handleCheckUsername() {
    const username = usernameRef.current.value;
    if (username.length < 6) {
      setFormMessage({
        message: 'Username must be longer than 5 characters.',
        type: 'wrong',
      });
      return;
    }

    // Set waiting state
    document.body.className = 'waiting';
    const exists = await getInfoByUsername(username);
    if (exists) {
      setFormMessage({
        message: 'Username is already in use.',
        type: 'wrong',
      });
    } else {
      setFormMessage({
        message: 'Username is correct.',
        type: 'success',
      });
      setCorrect(true);
    }

    // Remove wait state
    document.body.className = '';
  }

  /* 
    Handle Create Account
  */
  async function handleCreateAccount(e) {
    e.preventDefault();

    // Username is not verified
    if (!correct) {
      setFormMessage({
        message: 'You must verify your username first.',
        type: 'wrong',
      });
      return;
    }

    if (showPasswords) {
      handleCreateUserWithEmailAndPassword();
    } else {
      handleCreateUserFromPopup();
    }
  }

  async function handleCreateUserWithEmailAndPassword() {
    const username = usernameRef.current.value,
      password = passwordRef.current.value,
      confirmPassword = confirmPasswordRef.current.value;

    if (password.length < 6) {
      setFormMessage({
        message: 'Password must be at least 6 characters.',
        type: 'wrong',
      });
      return;
    }

    if (password !== confirmPassword) {
      setFormMessage({
        message: 'Passwords do not match.',
        type: 'wrong',
      });
      return;
    }

    // Set waiting state
    document.body.className = 'waiting';

    /* Create new email in Auth */
    const credentials = await createUserWithEmailAndPassword(
      auth,
      EMAIL,
      password
    );

    // console.log(credentials);

    const userTmp = {
      uid: credentials.user.uid,
      photo: null,
      username,
      password,
      email: EMAIL,
      processCompleted: true,
    };

    /* Create new User in Firestore */
    createNewUser(userTmp);
    setFormMessage({
      message: 'Your account has been successfully created. :D',
      type: 'success',
    });
    // Remove wait state
    document.body.className = '';
    navigate('/admin');
    return;
  }

  async function handleCreateUserFromPopup() {
    // Set waiting state
    document.body.className = 'waiting';
    const username = usernameRef.current.value;
    // console.log(user);
    const userTmp = {
      ...user,
      username,
    };

    userTmp.processCompleted = true;
    createNewUser(userTmp);
    setFormMessage({
      message: 'Your account has been successfully created. :D',
      type: 'success',
    });
    // Remove wait state
    document.body.className = '';
    navigate('/admin');
    return;
  }

  /* ------------------------------------------------------------------------- */
  // TODO: Handle Auth functions
  function handleUserLoggedInButNotCompleted() {
    // console.log('Not completed');
    setIsLoading(false);
    setShowPasswords(false);
  }

  function handleUserLoggedIn() {
    navigate('/admin');
  }
  function handleNewUser() {
    if (isSignInWithEmailLink(auth, window.location.href) || auth) {
      // console.log(auth);
      // console.log(user);
      // console.log('You have entered via link');
      setIsLoading(false);
      setShowPasswords(true);
    } else {
      navigate('/');
    }
  }

  if (!isLoading) {
    return (
      <div className='min-h-screen'>
        {/* Form section */}
        <section className='py-10 px-4 w-full'>
          {/* Logo */}
          <Link to='/'>
            <div className='flex items-center'>
              <img className='w-20' src={logo} alt='linkeefy-logo' />
              <h3 className='ml-1 font-semibold text-xl capitalize text-black'>
                linkeefy
              </h3>
            </div>
          </Link>

          {/* Form */}
          <div className='max-w-2xl mx-auto flex justify-center py-14'>
            <div className='w-full'>
              <form onSubmit={handleCreateAccount} className='flex flex-col'>
                <h1 className='text-black text-4xl lg:text-[40px] leading-normal font-extrabold'>
                  Create your account
                </h1>
                <p className='text-gray-500 mt-6 text-sm lg:text-base'>
                  Choose your Linkeefy username. You can always change it later.
                </p>
                <label className='relative'>
                  <p className='mt-6 outline-none text-base py-4 px-5 rounded-xl bg-gray-200 text-black select-none'>
                    {EMAIL}
                  </p>
                  <input
                    onChange={() => setCorrect(false)}
                    ref={usernameRef}
                    className='mt-3 outline-none text-base py-4 px-5 w-full rounded-xl bg-gray-200'
                    type='text'
                    placeholder='Username'
                  />
                  <BsCheckCircle
                    onClick={handleCheckUsername}
                    className='check-circle cursor-pointer absolute w-8 h-8 right-4 bottom-[12px]'
                  />
                  <p className='verify-modal hidden absolute h-8 bottom-[12px] -right-[150px] bg-black text-white font-medium rounded-xl lg:flex items-center px-3'>
                    Verify username
                  </p>
                </label>
                {showPasswords ? (
                  <>
                    <input
                      ref={passwordRef}
                      className='mt-3 outline-none text-base py-4 px-5 rounded-xl bg-gray-200'
                      type='password'
                      placeholder='Password'
                    />
                    <input
                      ref={confirmPasswordRef}
                      className='mt-3 outline-none text-base py-4 px-5 rounded-xl bg-gray-200'
                      type='password'
                      placeholder='Confirm password'
                    />
                  </>
                ) : (
                  <p>
                    You dont need any passwords. Use your Google Account to log
                    in anywhere.
                  </p>
                )}

                {/* Form message */}
                <p
                  className={`${
                    formMessage.message !== '' ? 'opacity-100' : 'opacity-0'
                  } ${STYLES[formMessage.type]} mt-3 h-[24px]`}>
                  {formMessage.message}
                </p>
                <input
                  type='submit'
                  className='mt-4 bg-mustardBrown cursor-pointer hover:bg-mustardBrown/90 duration-200 rounded-full text-white font-bold capitalize py-4'
                  value='create account'
                />
              </form>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isLoading) {
    return (
      <AuthProvider
        onUserLoggedInButNotCompleted={handleUserLoggedInButNotCompleted}
        onUserLoggedIn={handleUserLoggedIn}
        onNewUser={handleNewUser}>
        <Loader />
      </AuthProvider>
    );
  }
};

export default CreateUsername;
