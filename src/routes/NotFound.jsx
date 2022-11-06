import React from 'react';
import image from '../assets/images/error404.jpg';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='max-w-3xl w-full mx-auto min-h-screen flex flex-col justify-center gap-3'>
      <h1 className='text-center font-bold lg:text-4xl text-2xl font-sans'>
        Can't find this page
      </h1>
      <img src={image} alt='error-404' />
      <Link
        to='/'
        className='font-medium border-black border-b-2 w-fit mx-auto hover:text-blue-700 hover:border-blue-700 duration-300'>
        Go to home page
      </Link>
    </div>
  );
};

export default NotFound;
