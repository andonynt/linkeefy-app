import React, { useState, useRef } from 'react';
import logo from '../assets/logo.png';
import logoImage from '../assets/images/signup-image.jpg';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/shared/Loader';
import { AuthProvider } from '../components/componentsDispatcher';
import { auth, checkEmail, createNewUser, userExists } from '../firebase/index';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
} from 'firebase/auth';
import Button from '../components/shared/Button';

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const inputRef = useRef();

  const [modal, setModal] = useState({
    isOpen: false,
    type: '',
  });

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://linkeefy-app.firebaseapp.com/create-username',
    // This must be true.
    handleCodeInApp: true,
  };

  // TODO: Send Email confirmation
  async function handleSignIn(e) {
    e.preventDefault();
    const email = inputRef.current.value;

    /* Email field is empty */
    if (!email) {
      setModal(() => {
        return {
          isOpen: true,
          type: 'error',
        };
      });
      return;
    }
    // Set waiting state
    document.body.className = 'waiting';
    /* Email field is not empty */
    const emailExists = await checkEmail(email);
    if (emailExists) {
      alert('This email is already in use.');
      inputRef.current.value = '';
    } else {
      sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
          // console.log(email);
          // console.log('Check your email');

          /* Save in local Storage */
          window.localStorage.setItem('email', email);
          setModal(() => {
            return {
              isOpen: true,
              type: 'correct',
            };
          });
        })
        .catch((error) => {
          // console.log(error);
          setModal(() => {
            return {
              isOpen: true,
              type: 'error',
            };
          });
        });
    }
    // Remove wait state
    document.body.className = '';

    return;
  }

  // TODO: Handle Google Popup
  function handleSignInWithGoogle(e) {
    e.preventDefault();
    const googleProvider = new GoogleAuthProvider();
    signInWithGoogle(googleProvider);
  }

  async function signInWithGoogle(googleProvider) {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      // console.log(response);

      // Set waiting state
      document.body.className = 'waiting';

      /* Check if email has completed the registration already */
      const exists = await userExists(response.user.uid);
      if (exists) {
        // Remove waiting state
        document.body.className = '';
        navigate('/admin');
        return;
      }

      const userTmp = {
        uid: response.user.uid,
        email: response.user.email,
        processCompleted: false,
        photo: response.user.photoURL,
      };

      createNewUser(userTmp);
      // console.log('Done');
      document.body.className = '';
      navigate('/create-username');
    } catch (error) {
      // console.log(error);
    }
  }

  // TODO: Handle Facebook Popup
  function handleSignInWithFacebook(e) {
    e.preventDefault();
    const facebookProvider = new FacebookAuthProvider();
    signInWithFacebook(facebookProvider);
  }

  async function signInWithFacebook(facebookProvider) {
    try {
      const response = await signInWithPopup(auth, facebookProvider);
      // console.log(response);

      // Set waiting state
      document.body.className = 'waiting';

      /* Check if email has completed the registration already */
      const exists = await userExists(response.user.uid);
      if (exists) {
        // Remove waiting state
        document.body.className = '';
        navigate('/admin');
        return;
      }

      const userTmp = {
        uid: response.user.uid,
        email: response.user.email,
        processCompleted: false,
        photo: response.user.photoURL,
      };

      createNewUser(userTmp);
      // console.log('Done');
      document.body.className = '';
      navigate('/create-username');
    } catch (error) {
      console.log(error);
    }
  }

  function closeModal() {
    setModal((prev) => {
      return { ...prev, isOpen: false };
    });
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
          className={`fixed w-full ${
            modal.type === 'error' ? 'bg-red-200' : 'bg-green-200'
          } py-14 text-center duration-500 ${
            modal.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}>
          <h1 className='text-base lg:text-lg font-semibold'>
            {modal.type === 'error' ? (
              'Invalid email. Please, enter a valid email address to continue.'
            ) : (
              <>
                {' '}
                <p>
                  Your got an email. Check Your Inbox.
                  <br />
                  <span className='text-sm'>
                    * If your can't find in it in your inbox, check your SPAM
                    folder. Thank you.
                  </span>
                </p>
              </>
            )}
          </h1>
          <button
            onClick={closeModal}
            className={`mt-8 py-3 px-5 ${
              modal.type === 'error' ? 'bg-red-600' : 'bg-black'
            }  rounded-2xl font-semibold text-white`}>
            Close
          </button>
        </section>

        {/* Form */}
        <div className='flex flex-row-reverse min-h-screen'>
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

            {/* Ways to sign up */}
            <div className='max-w-2xl mx-auto py-14'>
              {/* Email/password */}
              <h1 className='text-black text-3xl lg:text-4xl text-start leading-normal font-extrabold'>
                Choose a way to sign up
              </h1>
              <form onSubmit={handleSignIn} className='mt-6 flex flex-col'>
                <h2 className='text-black text-lg lg:text-2xl leading-normal font-semibold'>
                  Write your email address
                </h2>
                <input
                  ref={inputRef}
                  className='mt-6 outline-none text-base py-4 px-5 rounded-xl bg-gray-200'
                  type='text'
                  placeholder='Email'
                />
                <p className='text-sm lg:text-base font-medium mt-1'>
                  We'll send you an email verification to complete the
                  registration.
                </p>

                <Button
                  background='#000'
                  className='mt-3 hover:-translate-y-1 duration-300'>
                  <input
                    className='cursor-pointer'
                    type='submit'
                    value='Send email confirmation'
                  />
                </Button>
              </form>
              {/* PasswordLess option */}
              <div
                onSubmit={handleSignIn}
                className='mt-16 flex flex-col space-y-5'>
                <h2 className='text-black text-lg lg:text-2xl leading-normal font-semibold'>
                  Tired of writing passwords?
                </h2>
                <Button
                  onClick={handleSignInWithGoogle}
                  background='#EA4335'
                  className='hover:-translate-y-1 duration-300'>
                  sign up using google
                </Button>
                <Button
                  onClick={handleSignInWithFacebook}
                  background='#4267B3'
                  className='hover:-translate-y-1 duration-300'>
                  sign up using facebook
                </Button>

                <p className='text-gray-500 mt-10 text-sm'>
                  By clicking Create account, you agree to Linkeefy's Terms and
                  Conditions, confirm you have read our Privacy Notice. You
                  won't receive offers, news and updates from us. :D
                </p>
              </div>

              <p className='text-center mt-10 text-sm lg:text-base'>
                Already have an account?{' '}
                <Link to='/login'>
                  <span className='text-pancy cursor-pointer'>Login</span>
                </Link>
              </p>
            </div>
          </section>

          {/* Image section */}
          <div className='lg:w-1/3 lg:min-h-full w-0 bg-black'>
            <img
              src={logoImage}
              className='h-full object-cover'
              alt='signup-image'
            />
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

export default Signup;
