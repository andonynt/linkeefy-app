import React, { useState } from 'react';
import './styles/main.css';
import {
  NavBar,
  FeatureComponent,
  Footer,
} from './components/componentsDispatcher';
import features from './components/LandingPage/features';
import Loader from './components/shared/Loader';

// State
import userState from './zustand/store';
import { AuthProvider } from './components/componentsDispatcher';

const App = () => {
  // TODO: Signout - Tests
  // signOut(auth);

  const { user, setUser } = userState();
  const [isLoading, setIsLoading] = useState(true);

  /* ------------------------------------------------------------------------- */
  // TODO: Handle Auth functions
  // Handle Logged in But not completed
  function handleUserLoggedInButNotCompleted() {
    setIsLoading(false);
  }

  // Handle user Logged In
  function handleUserLoggedIn(userInfo) {
    setUser(userInfo);
    setIsLoading(false);
    // console.log(user);
  }

  // Handle New user
  function handleNewUser() {
    setIsLoading(false);
  }

  if (!isLoading) {
    return (
      <>
        <NavBar />
        {/* Features, Hero, etc */}
        {features.map((feature, index) => {
          return <FeatureComponent key={index} feature={feature} />;
        })}
        <Footer />
      </>
    );
  }
  if (isLoading) {
    /*
      - Logged In: Email verified, and username created 
      - New user: Email not verified, username not created (New user)
      - Logged in but not completed: Email verified, but username not created

    */
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

export default App;
