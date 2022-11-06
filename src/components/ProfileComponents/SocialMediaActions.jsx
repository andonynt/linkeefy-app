import React, { useState, useRef } from 'react';
import { useEffect } from 'react';

const SocialMediaActions = ({
  app,
  url,
  uid,
  onEditSocialLink,
  onDeleteSocialLink,
}) => {
  /* States */
  const [isEdit, setIsEdit] = useState(false);
  const [appState, setAppState] = useState(app);
  const [urlState, setUrlState] = useState(url);

  /* Refs */
  const urlEditRef = useRef();

  function handleEdit() {
    setIsEdit(true);
  }

  function handleSave() {
    // console.log('Saved');
    const tmp = {
      uid,
      app,
      url: urlState,
    };
    onEditSocialLink(tmp);
    setIsEdit(false);
  }

  useEffect(() => {
    if (isEdit) urlEditRef.current.focus();
  }, [isEdit]);

  function handleChangeUrl(e) {
    const value = e.target.value;
    setUrlState(value);
  }

  useEffect(() => {
    setAppState(app);
    setUrlState(url);
  }, [app, url]);

  return (
    <div className='flex items-center justify-between flex-wrap gap-4'>
      {/* Edit mode */}
      {isEdit ? (
        <div className='flex gap-4 flex-wrap'>
          <input
            className='outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-fit max-w-full fade'
            type='text'
            value={appState}
            disabled='disabled'
          />
          <input
            className='outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-fit max-w-full fade'
            type='text'
            ref={urlEditRef}
            autoComplete='off'
            value={urlState}
            onChange={handleChangeUrl}
          />
        </div>
      ) : (
        <div>
          <h3 className='flex-grow capitalize'>{app}</h3>
        </div>
      )}

      {/* Buttons */}
      <div className='flex gap-3 flex-wrap'>
        {/* Show edit or save button */}
        {isEdit ? (
          <button
            onClick={handleSave}
            className='py-3 px-4 bg-[#198754] text-white font-medium rounded-xl lg:text-base text-sm'>
            Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className='py-3 px-4 bg-[#198754] text-white font-medium rounded-xl lg:text-base text-sm'>
            Edit
          </button>
        )}
        <button
          onClick={() => onDeleteSocialLink(uid)}
          className='py-3 px-4 bg-[#dc3545] text-white font-medium rounded-xl lg:text-base text-sm'>
          Delete
        </button>
      </div>
    </div>
  );
};

export default SocialMediaActions;
