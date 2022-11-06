import React, { useRef, useState } from 'react';
import logo from '../assets/logo.png';
import logoImage from '../assets/images/login-image.jpg';
import { Link, useNavigate } from 'react-router-dom';

import Loader from '../components/shared/Loader';
import { AuthProvider } from '../components/componentsDispatcher';

import {
  auth,
  checkLogin,
  getInfoByUsername,
  createNewUser,
  userExists,
} from '../firebase/index';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import userState from '../zustand/store';
import Button from '../components/shared/Button';

const Login = () => {
  const [isLoading, setIsLoading] = useState(true);

  /* Get user state */
  const { user, setUser } = userState();

  const navigate = useNavigate();

  // Wrong credentials modal
  const [isModalActive, setIsModalActive] = useState(false);

  const usernameRef = useRef(),
    passwordRef = useRef();

  /*Handle Login with Username and Password */
  async function handleLogin(e) {
    e.preventDefault();
    const username = usernameRef.current.value,
      password = passwordRef.current.value;

    // Set waiting state
    document.body.className = 'waiting';

    const isCorrect = await checkLogin(username, password);
    // console.log(isCorrect);
    if (isCorrect) {
      // console.log('correct');

      const userTmp = await getInfoByUsername(username);
      // console.log(userTmp);

      /* Update state - Zustand */
      setUser(userTmp);
      // console.log(user);

      /* Login with Email and password */
      const credentials = await signInWithEmailAndPassword(
        auth,
        userTmp.email,
        password
      );
      // console.log(credentials);
      /* Redirect */
      navigate('/admin');
    } else {
      // console.log('Credentials are incorrect');
      setIsModalActive(true);
    }
    // Remove wait state
    document.body.className = '';
  }

  /* Handle Sign In With Google Popup */
  function handleLoginWithGoogle(e) {
    e.preventDefault();
    const googleProvider = new GoogleAuthProvider();
    logInWithGoogle(googleProvider);
  }
  async function logInWithGoogle(googleProvider) {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      // console.log(response);

      // Set waiting state
      document.body.className = 'waiting';

      /* Check if email has completed the registration already */
      const exists = await userExists(response.user.uid);
      // console.log(exists);

      /* If yes */
      if (exists) {
        // Remove wait state
        document.body.className = '';
        navigate('/admin');
        return;
      }

      /* If not, we create a new account with process uncompleted*/
      const userTmp = {
        uid: response.user.uid,
        email: response.user.email,
        processCompleted: false,
        photo: response.user.photoURL,
      };
      createNewUser(userTmp);
      // console.log('Done');
      // Remove wait state
      document.body.className = '';
      navigate('/create-username');
    } catch (error) {
      // console.log(error);
    }
    // Remove wait state
    document.body.className = '';
  }

  /* ------------------------------------------------------------------------- */
  // TODO: Handle Auth functions
  function handleUserLoggedInButNotCompleted() {
    // console.log('Not completed');
    navigate('/create-username');
  }

  function handleUserLoggedIn() {
    navigate('/admin');
  }
  function handleNewUser() {
    setIsLoading(false);
  }

  if (!isLoading) {
    return (
      <>
        {/* Modal */}
        <section
          className={`${
            isModalActive ? 'opacity-100 visible:' : 'opacity-0 invisible'
          } duration-300 fixed inset-0 flex justify-center items-center backdrop-blur-md`}>
          <div className='bg-gray-100 p-8 rounded-2xl flex flex-col'>
            <h3 className='capitalize font-bold text-lg'>wrong credentials</h3>
            <p className='mt-2 text-sm'>Invalid username or password</p>
            <button
              onClick={() => setIsModalActive(false)}
              className='mt-5 self-end text-blue-700 font-bold'>
              OK
            </button>
          </div>
        </section>
        {/* Login Form */}
        <div className='flex min-h-screen'>
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
                <form onSubmit={handleLogin} className='flex flex-col'>
                  <h1 className='text-black text-4xl lg:text-[40px] leading-normal font-extrabold'>
                    Log in
                  </h1>
                  <label className='mt-3'>
                    <h2 className='text-black text-lg lg:text-2xl leading-normal font-semibold'>
                      Username
                    </h2>
                    <input
                      ref={usernameRef}
                      className='mt-2 outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-full'
                      type='text'
                      placeholder='test'
                    />
                  </label>
                  <label className='mt-3'>
                    <h2 className='text-black text-lg lg:text-2xl leading-normal font-semibold'>
                      Password
                    </h2>
                    <input
                      ref={passwordRef}
                      className='mt-2 outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-full'
                      type='text'
                      placeholder='test123'
                    />
                  </label>

                  <input
                    type='submit'
                    className='mt-4 bg-mustardBrown cursor-pointer hover:bg-mustardBrown/90 duration-200 rounded-full text-white font-bold capitalize py-4'
                    value='log in'
                  />
                </form>

                <div className='flex flex-col items-center space-y-4 mt-6'>
                  <p className='mt-3 text-center'>or</p>
                  <Button
                    onClick={handleLoginWithGoogle}
                    background='#EA4335'
                    className='hover:-translate-y-1 duration-300 min-w-[350px]'>
                    continue with google
                  </Button>
                  <Button
                    background='#4267B3'
                    className='hover:-translate-y-1 duration-300 min-w-[350px]'>
                    continue with facebook
                  </Button>
                </div>

                <p className='text-center mt-8 text-sm lg:text-base'>
                  Don't have a Linkeefy account?{' '}
                  <Link to='/signup'>
                    <span className='text-pancy cursor-pointer'>Register </span>
                  </Link>
                </p>
              </div>
            </div>
          </section>

          {/* Image section */}
          <div className='lg:w-1/3 lg:min-h-full w-0 bg-black'>
            <img src={logoImage} className='h-full object-cover' alt='' />
          </div>
        </div>
      </>
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

export default Login;
