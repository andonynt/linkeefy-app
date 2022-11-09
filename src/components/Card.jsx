import React from 'react';
import {
  FaTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
  FaSpotify,
} from 'react-icons/fa';
import logo from '../assets/logo.png';

const Card = () => {
  return (
    <div className='rotate w-[260px] min-h-[541px] bg-black text-white p-6 flex flex-col rounded-2xl capitalize'>
      {/* Profile */}
      <div className='flex flex-col items-center'>
        <img
          className='w-[75px] h-[75px] bg-white rounded-full'
          src='https://media.istockphoto.com/vectors/schnautzer-face-wearing-sunglasses-isolated-vector-illustration-vector-id1137372279?k=20&m=1137372279&s=612x612&w=0&h=NKAv6FaY-smn7gbevUtpqZZmvZNzJl4MMycx6rUxJNU='
          alt=''
        />
        <h3 className='mt-2'>@teddytheboss</h3>
      </div>

      {/* Bio */}
      <div className='text-center mt-2'>
        <h3 className='font-bold'>ocupation</h3>
        <p className='lg:text-base text-sm mt-2'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alias,
          impedit?
        </p>
      </div>

      {/* Links */}
      <div className='mt-3 space-y-2'>
        <div className='cursor-pointer text-black w-full h-[45px] font-semibold rounded-lg flex justify-center items-center text-sm bg-[#e0719e] hover:bg-gray-500 duration-200 ease-in-out'>
          <p>my website</p>
        </div>

        <div className='cursor-pointer text-black w-full h-[45px] font-semibold rounded-lg flex justify-center items-center text-sm bg-[#e0719e] hover:bg-[#1f271b] duration-200 ease-in-out'>
          <p>my personal blog</p>
        </div>
      </div>

      {/* Social Media */}
      <div className='space-y-1 mt-3'>
        <h3 className='text-center'>social media profiles</h3>
        <div className='flex justify-center space-x-4'>
          <FaTwitter />
          <FaLinkedinIn />
          <FaFacebookF />
          <FaYoutube />
          <FaSpotify />
        </div>
      </div>

      {/* Footer */}

      <div className='flex items-center py-2 px-4 rounded-xl bg-white w-fit mx-auto mt-6'>
        <img className='w-10' src={logo} alt='linkeefy-logo' />
        <h3 className='ml-1 font-semibold text-sm capitalize text-black'>
          linkeefy
        </h3>
      </div>
    </div>
  );
};

export default Card;
