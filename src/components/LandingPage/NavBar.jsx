import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';
import { FaAlignJustify } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/index';
/*
 * Import user state
 */
import userState from '../../zustand/store';

const NavBar = () => {
  /* Mobile Sidebar */
  const [isActive, setIsActive] = useState(false);

  /* Check user existance */
  const [userExists, setUserExists] = useState(false);

  function toggleMenu() {
    setIsActive(!isActive);
  }

  const { user, removeUser } = userState();

  function SignOutUser(e) {
    e.preventDefault();
    removeUser();
    // console.log(user);
    signOut(auth);
    setUserExists(false);
  }

  useEffect(() => {
    user ? setUserExists(true) : setUserExists(false);
  }, [userExists]);

  return (
    <>
      <nav id='navbar' className='fixed flex justify-center w-full mt-8 z-20'>
        <div className='center flex justify-between bg-white py-5 rounded-3xl '>
          {/* Logo */}
          <Link to='/'>
            <div className='flex items-center'>
              <img className='w-[106px] h-[65px]' src={logo} alt='' />
              <h1 className='capitalize text-2xl font-semibold lg:block hidden'>
                linkeefy
              </h1>
            </div>
          </Link>

          {/* Links */}
          <div className='lg:flex items-center lg:space-x-8 font-medium capitalize hidden'>
            <Link to='/'>home</Link>
            <Link to='/'>discover</Link>
            <Link to='/'>contact</Link>
          </div>

          {/* Account */}
          <div className='lg:flex items-center lg:space-x-8 hidden'>
            {userExists ? (
              <>
                <Link to='/admin'>
                  <Button background='#ccc'>admin</Button>
                </Link>
                <Button onClick={SignOutUser} background='#000' rounded='full'>
                  sign out
                </Button>
              </>
            ) : (
              <>
                <Link to='/login'>
                  <Button background='#ccc'>log in</Button>
                </Link>
                <Link to='/signup'>
                  <Button background='#000' rounded='full'>
                    sign up for free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Icon */}

          <div onClick={toggleMenu} className='flex items-center lg:hidden'>
            {isActive ? (
              <ImCross className='w-6 h-6' />
            ) : (
              <FaAlignJustify className='w-6 h-6' />
            )}
          </div>
        </div>
      </nav>

      {/* Hamburguer menu */}
      <section
        className={`${
          isActive ? 'translate-x-0	' : 'translate-x-full'
        }  fixed inset-0 bg-gray-400 duration-200 z-10 pt-[137px] lg:hidden`}>
        <div className='flex flex-col text-center text-lg capitalize space-y-10 py-8 font-medium text-black'>
          <Link to='/'>home</Link>
          <Link to='/'>discover</Link>
          <Link to='/'>contact</Link>
          {userExists ? (
            <>
              <Link to='/admin'>
                <Button background='#ccc'>admin</Button>
              </Link>
              <Button
                className='w-fit mx-auto'
                onClick={SignOutUser}
                background='#000'
                rounded='full'>
                sign out
              </Button>
            </>
          ) : (
            <>
              <Link to='/login'>
                <Button background='#ccc'>log in</Button>
              </Link>
              <Link to='/signup'>
                <Button background='#000' rounded='full'>
                  sign up for free
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default NavBar;
