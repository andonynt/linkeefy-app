import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import Button from './shared/Button';
import backgrounds from '../scripts/backgrounds';
import isHex from '../scripts/isHex';
/* Components */
import { LinkActions, SocialMediaActions } from './componentsDispatcher';
/* State */
import userState from '../zustand/store';
/* Firebase */
import {
  auth,
  saveUserInfo,
  setUserProfileImage,
  getImageByPath,
  getInfoByUsername,
} from '../firebase/index';
import { signOut } from 'firebase/auth';
/* Icons */
import { MdClear } from 'react-icons/md';
import { AiOutlineMenu, AiOutlineGlobal } from 'react-icons/ai';
import socialMediaLinks from '../scripts/socialMediaLinks';

const AdminProfile = () => {
  const navigate = useNavigate();

  const { user, removeUser } = userState();

  /* States */
  const [userInfo, setUserInfo] = useState({});
  const [query, setQuery] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  /* Share button */
  function openActions() {
    const $element = document.querySelector('.actions');
    $element.classList.remove('opacity-0');
    $element.classList.remove('invisible');
    $element.classList.add('opacity-1');
    $element.classList.add('visible');
  }
  function closeActionModals() {
    const $element = document.querySelector('.actions');
    $element.classList.add('opacity-0');
    $element.classList.add('invisible');
    $element.classList.remove('opacity-1');
    $element.classList.remove('visible');
  }
  function copyLink() {
    const link = linkUserRef.current.value;
    linkUserRef.current.select();
  }

  const filteredItems = socialMediaLinks.filter((media) => {
    return media.app.toLowerCase().includes(query.toLowerCase());
  });

  /* Refs */
  const linkUserRef = useRef(),
    titleRef = useRef(),
    urlRef = useRef(),
    urlMediaRef = useRef(),
    profileRef = useRef(),
    urlBackgroundRef = useRef();

  // console.log(user);
  // console.log(userInfo);

  function handleSelectApp(e) {
    const value = e.target.value;
    setQuery(value);
  }

  // TODO: Username actions
  async function handleChangeUsername() {
    // Set waiting state
    document.body.className = 'waiting';
    const username = userInfo.username;
    if (username === '' || username.length < 6) {
      // Remove wait state
      document.body.className = '';
      alert('Invalid user');
      return;
    }
    const exists = await getInfoByUsername(username);
    if (exists) {
      // Remove wait state
      document.body.className = '';
      alert('Username already in use');
      return;
    }
    saveUserInfo(userInfo);
    // Remove wait state
    document.body.className = '';
    showModal();
  }

  // TODO: Set values to Ocupation and Bio
  function handleAddInformation(e) {
    const value = e.target.value,
      key = e.target.getAttribute('data-section');
    setUserInfo({ ...userInfo, [key]: value });
  }

  // TODO: Links actions
  function editLinks(obj) {
    const edited = userInfo.links.map((website) => {
      if (website.uid === obj.uid) return obj;
      return website;
    });
    setUserInfo((prev) => {
      return {
        ...prev,
        links: edited,
      };
    });
  }
  function deleteLink(uid) {
    const filtered = userInfo.links.filter((props) => props.uid !== uid);
    setUserInfo((prev) => {
      return {
        ...prev,
        links: filtered,
      };
    });
  }
  function handleAddLink(e) {
    e.preventDefault();
    const title = titleRef.current.value.trim(),
      url = urlRef.current.value.trim();

    if (title === '' || url === '') {
      return;
    }

    const link = {
      title,
      url,
      uid: (Math.random() * 100).toString(36).slice(3),
    };
    setUserInfo((prev) => {
      // console.log(prev);
      return {
        ...prev,
        links: [...(prev.links || ''), link],
      };
    });
    // Reset form
    titleRef.current.value = '';
    urlRef.current.value = '';
    titleRef.current.focus();
  }

  // TODO: Social Media actions
  function editSocialMediaLink(obj) {
    const edited = userInfo.mediaLinks.map((props) => {
      if (props.uid === obj.uid) return obj;
      return props;
    });
    setUserInfo((prev) => {
      return {
        ...prev,
        mediaLinks: edited,
      };
    });
  }
  function deleteSocialMediaLink(uid) {
    const filtered = userInfo.mediaLinks.filter((props) => props.uid !== uid);
    setUserInfo((prev) => {
      return {
        ...prev,
        mediaLinks: filtered,
      };
    });
  }
  function handleAddSocialMedia(e) {
    e.preventDefault();

    const url = urlMediaRef.current.value.trim();
    if (query.trim() === '' || url === '') {
      return;
    }

    const includes = socialMediaLinks.find(
      (social) => social.app.toLowerCase() === query.toLowerCase()
    );

    if (!includes) {
      alert('Icon not found.');
      return;
    }

    const mediaLink = {
      app: query,
      url,
      uid: (Math.random() * 100).toString(36).slice(3),
    };

    setUserInfo((prev) => {
      // console.log(prev);
      return {
        ...prev,
        mediaLinks: [...(prev.mediaLinks || ''), mediaLink],
      };
    });
    // Reset form
    setQuery('');
    urlMediaRef.current.value = '';
  }

  // TODO: Handle Select Background
  function handleSelectBackground(background) {
    // console.log(background);
    setUserInfo((prev) => {
      return {
        ...prev,
        background,
      };
    });
  }

  // TODO: Trigger Click profile picture
  function triggerUploadFile() {
    profileRef.current.click();
  }

  // TODO: Trigger Click Background
  function getFilesProfilePicture(e) {
    document.body.className = 'waiting';
    const files = e.target.files;
    const fileReader = new FileReader();

    if (fileReader && files && files.length > 0) {
      fileReader.readAsArrayBuffer(files[0]);
      fileReader.onload = async function () {
        const imageData = fileReader.result;
        const res = await setUserProfileImage(userInfo.uid, imageData);

        /* If the image is already uploaded */
        if (res) {
          const url = await getImageByPath(res.metadata.fullPath);
          document.body.className = '';
          setProfilePicture(url);
          setUserInfo((prev) => {
            return {
              ...prev,
              photo: res.metadata.fullPath,
            };
          });
        }
      };
    }
  }

  // TODO: Handle select Background color input
  function handleChangeFlatColor(e) {
    const color = e.target.value;
    setUserInfo((prev) => {
      return {
        ...prev,
        background: color,
      };
    });
  }

  // TODO: Remove profile picture
  function handleRemoveImage() {
    setUserInfo((prev) => {
      return {
        ...prev,
        photo: null,
      };
    });
  }
  // TODO: Remove background picture
  function handleRemoveBackground() {
    setUserInfo((prev) => {
      return {
        ...prev,
        background: null,
      };
    });
  }

  /* Handle Sign Out */
  function handleSignOut(e) {
    e.preventDefault();
    // console.log('You are out');
    // console.log(user);
    signOut(auth);
    removeUser();
    navigate('/');
  }

  // TODO: Save changes
  async function handleSaveChanges(e) {
    e.preventDefault();
    document.body.class = 'waiting';
    await saveUserInfo(userInfo);
    document.body.class = '';
    showModal();
  }

  function showModal() {
    const $modal = document.getElementById('modal');
    $modal.classList.remove('translate-x-full');
    $modal.classList.add('-translate-x-1/2');

    setTimeout(() => {
      $modal.classList.remove('-translate-x-1/2');
      $modal.classList.add('translate-x-full');
    }, 1000);
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
    setUserInfo(user);
  }, []);

  useEffect(() => {
    checkProfilePhoto();
  }, [userInfo.photo]);

  return (
    <>
      {/* Actions Modal */}
      <section className='actions fixed inset-0 backdrop-blur-md flex justify-center items-center z-30 opacity-0 invisible duration-300'>
        <div
          onClick={closeActionModals}
          className='absolute top-4 right-4 bg-red-400 p-2 rounded-full cursor-pointer'>
          <MdClear className='lg:w-8 lg:h-8 w-6 h-6 fill-black ' />
        </div>
        <div className='flex flex-col bg-white rounded-xl shadow-2xl p-4 space-y-4'>
          <h2 className='text-2xl lg:text-4xl font-bold'>Share your account</h2>
          <p>Share your profile everywhere.</p>
          <a
            href={`https://linkeefy-app.firebaseapp.com/user/${user.username}`}
            target='_blank'
            className='flex flex-wrap items-center text-lg lg:text-2xl'>
            <div className='p-2 bg-green-400 rounded-xl'>
              <AiOutlineGlobal />
            </div>
            <p className='font-semibold ml-2'>Open your profile</p>
          </a>
          <div>
            <input
              className='outline-none'
              type='text'
              defaultValue={`linkeefy-app.firebaseapp.com/user/${user.username}`}
              ref={linkUserRef}
            />
            <span
              onClick={copyLink}
              className='bg-blue-200 py-1 px-3 rounded-xl cursor-pointer'>
              copy
            </span>
          </div>
          <Button
            onClick={handleSignOut}
            className='flex justify-center items-center'
            background='#000'>
            sign out
          </Button>
        </div>
      </section>
      {/* Done Modal */}
      <div
        id='modal'
        className='fixed right-0 z-10 top-5 translate-x-full duration-200'>
        <p className='bg-green-500 py-3 px-6 text-lg font-semibold rounded-xl'>
          Done
        </p>
      </div>
      {/* Main section */}
      <section className='min-h-screen flex flex-col lg:w-2/3 lg:border-black lg:border-r-[1px]'>
        {/* Navigation section */}
        <div className='h-20 px-6 py-5 flex justify-between border-black border-b-[1px] relative'>
          <Link to='/'>
            <div className='flex items-center'>
              <img className='h-full w-[65px]' src={logo} alt='logo' />
              <h1 className='ml-1 font-medium'>Linkeefy</h1>
            </div>
          </Link>

          <AiOutlineMenu
            className='flex justify-center items-center cursor-pointer w-8 h-8'
            onClick={openActions}
          />
        </div>
        {/* Profile section */}
        <div className='flex-grow center py-10 space-y-6'>
          <h2 className='text-2xl lg:text-4xl font-bold'>Profile</h2>
          {/* Profile picture */}
          <section className='space-y-3'>
            <h3 className='lg:text-2xl text-xl font-semibold capitalize'>
              image
            </h3>
            <div className='flex items-center'>
              {/* Image */}
              <div className='flex justify-center'>
                {userInfo.photo ? (
                  <img
                    className='rounded-full w-24 h-24 object-cover bg-gray-200'
                    src={profilePicture}
                    alt='photo'
                    referrerPolicy='no-referrer'
                  />
                ) : (
                  <div className='w-24 h-24 bg-gray-200 rounded-full flex justify-center items-center'>
                    <p className='font-bold uppercase text-black text-4xl select-none'>
                      {userInfo.username ? userInfo.username[0] : null}
                    </p>
                  </div>
                )}
              </div>
              {/* Actions */}
              <div className='ml-3 gap-3 lg:text-base text-sm flex flex-wrap'>
                <Button
                  onClick={triggerUploadFile}
                  background='#e0719e'
                  className='w-fit text-black hover:bg-[#7fd6c2] hover:text-gray-700 duration-300 ease-out'>
                  upload
                </Button>
                <Button
                  onClick={handleRemoveImage}
                  background='#000'
                  className='w-fit text-black'>
                  remove
                </Button>
              </div>
              <input
                ref={profileRef}
                onChange={getFilesProfilePicture}
                type='file'
                hidden
              />
            </div>
          </section>
          {/* Username */}
          <section className='space-y-3'>
            <h3 className='lg:text-2xl text-xl font-semibold capitalize'>
              username
            </h3>
            <div className='flex flex-col gap-3'>
              <input
                className='outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-fit max-w-full'
                type='text'
                data-section='username'
                onChange={handleAddInformation}
                value={userInfo.username || ''}
              />
              <Button
                onClick={handleChangeUsername}
                background='#e0719e'
                className='w-fit text-black hover:bg-[#7fd6c2] hover:text-gray-700 duration-300 ease-out lg:text-base text-sm'>
                change username
              </Button>
            </div>
          </section>
          {/* Ocupation */}
          <section className='space-y-3'>
            <h3 className='lg:text-2xl text-xl font-semibold capitalize'>
              ocupation
            </h3>

            <input
              className='outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-fit max-w-full'
              type='text'
              data-section='ocupation'
              onChange={handleAddInformation}
              value={userInfo.ocupation || ''}
            />
          </section>
          {/* Bio */}
          <section className='space-y-3'>
            <h3 className='lg:text-2xl text-xl font-semibold capitalize'>
              Bio
            </h3>
            <textarea
              className='w-full resize-none	outline-none text-base py-4 px-5 rounded-xl bg-gray-200'
              rows={3}
              autoComplete='off'
              data-section='description'
              onChange={handleAddInformation}
              value={userInfo.description || ''}></textarea>
          </section>
          {/* Links */}
          <section className='flex flex-col space-y-3'>
            <h3 className='lg:text-2xl text-xl font-semibold capitalize'>
              links{' '}
            </h3>

            {userInfo.links
              ? userInfo.links.map((props, index) => {
                  // console.log(props);
                  return (
                    <LinkActions
                      key={index}
                      {...props}
                      onEditLink={editLinks}
                      onDeleteLink={deleteLink}></LinkActions>
                  );
                })
              : null}

            <form onSubmit={handleAddLink} className='flex flex-col space-y-4'>
              <div className='flex md:space-x-4 flex-col md:flex-row'>
                <label>
                  <h4>Title</h4>
                  <input
                    className='outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-fit'
                    type='text'
                    ref={titleRef}
                    autoComplete='off'
                  />
                </label>

                <label>
                  <h4>URL</h4>
                  <input
                    className='outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-fit'
                    type='text'
                    ref={urlRef}
                    autoComplete='off'
                  />
                </label>
              </div>
              <Button background='#000' className='w-fit cursor-pointer'>
                <input
                  className='cursor-pointer'
                  type='submit'
                  value='Add Link'
                />
              </Button>
            </form>
          </section>
          {/* Social media links */}
          <section className='flex flex-col space-y-3'>
            <h3 className='lg:text-2xl text-xl font-semibold capitalize'>
              Social media icons{' '}
            </h3>

            {userInfo.mediaLinks
              ? userInfo.mediaLinks.map((props, index) => {
                  return (
                    <SocialMediaActions
                      key={index}
                      {...props}
                      onEditSocialLink={editSocialMediaLink}
                      onDeleteSocialLink={
                        deleteSocialMediaLink
                      }></SocialMediaActions>
                  );
                })
              : null}

            <form
              onSubmit={handleAddSocialMedia}
              className='flex flex-col space-y-4'>
              <div className='flex md:space-x-4 flex-col md:flex-row'>
                <label className='w-fit flex flex-col'>
                  <h4>App</h4>
                  <input
                    className='outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-fit'
                    type='text'
                    value={query}
                    autoComplete='off'
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <select
                    className={
                      query && filteredItems.length > 0 ? 'block' : 'hidden'
                    }
                    onChange={handleSelectApp}
                    size='auto'>
                    <option hidden>{query}</option>

                    {query
                      ? filteredItems.map((props, index) => {
                          return (
                            <option key={index} value={props.app}>
                              {props.app}
                            </option>
                          );
                        })
                      : null}
                  </select>
                </label>

                <label>
                  <h4>URL</h4>
                  <input
                    className='outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-fit'
                    type='text'
                    ref={urlMediaRef}
                    autoComplete='off'
                  />
                </label>
              </div>
              <Button background='#000' className='w-fit cursor-pointer'>
                <input
                  className='cursor-pointer'
                  type='submit'
                  value='Add Link'
                />
              </Button>
            </form>
          </section>
          <Button
            onClick={handleSaveChanges}
            background='#e0719e'
            className='w-fit text-black hover:bg-[#7fd6c2] hover:text-gray-700 duration-300 ease-out'>
            save changes
          </Button>
          <h2 className='text-2xl lg:text-4xl font-bold'>Appearance</h2>
          {/* Background Image */}
          <section className='flex flex-col space-y-3'>
            <h3 className='lg:text-2xl text-xl font-semibold capitalize'>
              background image{' '}
            </h3>
            <div className='flex flex-wrap justify-center gap-5'>
              {/* Display backgrounds */}
              {backgrounds.map((props, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectBackground(props.img)}
                    className='aspect-[9/16] lg:max-w-[200px] max-w-[150px] hover:bg-gray-200 hover:scale-105 duration-200 rounded-br-xl rounded-bl-xl'>
                    <img
                      className='w-full h-full object-cover'
                      src={props.img}
                    />
                    <h4 className='my-2 text-center font-semibold'>
                      {props.name}
                    </h4>
                  </button>
                );
              })}
            </div>
          </section>
          {/* Custom background */}
          <section className='flex flex-col space-y-3'>
            <h3 className='lg:text-2xl text-xl font-semibold capitalize'>
              custom background{' '}
            </h3>
            <div className='flex flex-col xl:flex-row gap-5'>
              {/* Flat color */}
              <div className='xl:w-1/2 w-full flex flex-col gap-3'>
                <h4 className='xl:text-xl text-lg font-semibold capitalize'>
                  URL
                </h4>
                <p>
                  we highly recommend 1920x1080 images (or 16:9 aspect ratio).
                </p>

                <input
                  className='outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-fit'
                  type='text'
                  autoComplete='off'
                  ref={urlBackgroundRef}
                />
                <Button
                  onClick={() =>
                    handleSelectBackground(urlBackgroundRef.current.value)
                  }
                  background='#e0719e'
                  className='w-fit text-black hover:bg-[#7fd6c2] hover:text-gray-700 duration-300 ease-out '>
                  set custom
                </Button>
              </div>
              {/* Flat color */}
              <div className='xl:w-1/2 w-full space-y-3'>
                <h4 className='xl:text-xl text-lg font-semibold capitalize'>
                  flat color
                </h4>
                <p>Pick your favorite color.</p>
                <input
                  className='w-14 h-14 rounded-2xl'
                  type='color'
                  onChange={handleChangeFlatColor}
                />
              </div>
            </div>
          </section>
          <button
            onClick={handleRemoveBackground}
            className='py-3 px-4 bg-[#dc3545] text-white font-semibold rounded-xl'>
            Remove background
          </button>
        </div>
      </section>
      {/* Preview section */}
      <section
        style={
          isHex(userInfo.background)
            ? { background: userInfo?.background }
            : {
                backgroundImage: `url(${userInfo?.background})`,
                objectFit: 'cover',
              }
        }
        className='w-full bg-gray-800 lg:w-1/3 flex justify-center items-center lg:fixed right-0 top-0 bottom-0 py-20'>
        {/* Preview */}
        <div className='w-[300px] min-h-[600px] bg-black text-white rounded-3xl py-8 px-4 space-y-3 fade'>
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
    </>
  );
};

export default AdminProfile;
