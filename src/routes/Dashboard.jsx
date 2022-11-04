import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { AuthProvider, AdminProfile } from '../components/componentsDispatcher';
import Loader from '../components/shared/Loader';

/* Import User Profile Context */

const Dashboard = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  /* ------------------------------------------------------------------------- */
  // TODO: Handle Auth functions

  function handleUserLoggedInButNotCompleted() {
    // console.log('Not completed');
    navigate('/create-username');
  }

  function handleUserLoggedIn() {
    // console.log('Logged in correctly');
    setIsLoading(false);
  }
  function handleNewUser() {
    navigate('/');
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

  if (!isLoading) {
    return <AdminProfile />;
  }
};

export default Dashboard;
