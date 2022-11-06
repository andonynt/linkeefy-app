import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import isHex from '../scripts/isHex';
import socialMediaLinks from '../scripts/socialMediaLinks';
import Loader from '../components/shared/Loader';
// Firebase
import { getInfoByUsername, getImageByPath } from '../firebase/index';
const User = () => {
  const { username } = useParams();

  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);

  async function getUserInfo() {
    const info = await getInfoByUsername(username);
    setUserInfo(info);
    setIsLoading(false);
  }

  async function checkProfilePhoto() {
    const url = await getImageByPath(userInfo.photo);
    if (url) {
      setProfilePicture(url);
    } else {
      setProfilePicture(userInfo.photo);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    checkProfilePhoto();
  }, [userInfo.photo]);

  if (!isLoading) {
    return (
      <section
        style={
          isHex(userInfo.background)
            ? { background: userInfo?.background }
            : {
                backgroundImage: `url(${userInfo?.background})`,
                objectFit: 'cover',
              }
        }
        className='w-full min-h-screen bg-gray-800 flex justify-center items-center px-6'>
        {/* Preview */}
        <div className='max-w-2xl w-full min-h-[600px] bg-black text-white rounded-3xl py-8 px-4 space-y-3 fade'>
          {/* Image */}
          <div className='flex justify-center'>
            {userInfo.photo ? (
              <img
                className='rounded-full w-24 h-24 object-cover bg-white'
                src={profilePicture}
                alt='photo'
                referrerPolicy='no-referrer'
              />
            ) : (
              <div className='w-24 h-24 bg-white rounded-full flex justify-center items-center'>
                <p className='font-bold uppercase text-black text-4xl select-none'>
                  {userInfo.username ? userInfo.username[0] : null}
                </p>
              </div>
            )}
          </div>
          <h2 className='font-semibold text-center'>@{userInfo.username}</h2>
          {/* Ocupation */}
          {userInfo.ocupation ? (
            <div className='text-center'>
              <h3 className='font-semibold capitalize'>{userInfo.ocupation}</h3>
            </div>
          ) : null}

          {/* Description */}
          {userInfo.description ? (
            <p className='text-center normal-case	'>{userInfo.description}</p>
          ) : null}

          {/* Links */}
          {userInfo.links?.length > 0 ? (
            <div className='text-center space-y-2'>
              {userInfo.links.map((props, index) => {
                return (
                  <a
                    href={props.url}
                    target='_blank'
                    key={index}
                    className='cursor-pointer capitalize w-full block py-3 bg-[#e0719e] text-black font-semibold rounded-xl hover:scale-[1.025] duration-200'>
                    {props.title}
                  </a>
                );
              })}
            </div>
          ) : null}

          {/* Social media Icons */}
          {userInfo.mediaLinks?.length > 0 ? (
            <div className='text-center flex flex-wrap justify-center items-center gap-3'>
              {userInfo.mediaLinks.map((props, index) => {
                const find = socialMediaLinks.find((p) => p.app === props.app);
                // console.log(find);
                return (
                  <a href={props.url} target='_blank' key={index}>
                    {find.icon}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  if (isLoading) {
    return <Loader />;
  }
};

export default User;
