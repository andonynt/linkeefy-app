import React from 'react';
import { FiGithub, FiFacebook, FiInstagram } from 'react-icons/fi';
import logo from '../assets/logo.png';

const socials = [
  {
    url: 'https://github.com/andonynt/linkeefy-app',
    icon: <FiGithub className='w-6 h-6' />,
  },
  {
    url: 'https://github.com/andonynt/linkeefy-app',
    icon: <FiFacebook className='w-6 h-6' />,
  },
  {
    url: 'https://github.com/andonynt/linkeefy-app',
    icon: <FiInstagram className='w-6 h-6' />,
  },
];

const Footer = () => {
  return (
    <footer className='bg-black pt-10 pb-20'>
      <div className='center flex flex-col items-center space-y-8'>
        {/* Logo */}
        <div className='flex items-center select-none'>
          <img className='w-[106px] h-[65px]' src={logo} alt='logo' />
          <h1 className='capitalize text-2xl font-semibold text-white'>
            linkeefy
          </h1>
        </div>
        {/* Icons */}
        <div className='flex gap-5 flex-wrap'>
          {socials.map((props, index) => {
            return (
              <a
                href={props.url}
                key={index}
                rel='noopener noreferrer'
                target='_blank'
                className='bg-white p-3 rounded-full'>
                {props.icon}
              </a>
            );
          })}
        </div>

        {/* Links */}
        <ul className='text-white capitalize flex gap-5 justify-center flex-wrap'>
          <li>
            <a href='#home'>home</a>
          </li>
          <li>
            <a href='#discover'>discover</a>
          </li>
          <li>
            <a href='#how'>how it works</a>
          </li>
        </ul>
        <p className='text-gray-100 text-center'>
          &copy; {new Date().getFullYear()}{' '}
          <a
            href='https://github.com/andonynt'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-[#7fd6c2] duration-300'>
            @andonynt
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
