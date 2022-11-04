import React, { useState, useRef } from 'react';
import { useEffect } from 'react';

const LinkActions = ({ title, url, uid, onEditLink, onDeleteLink }) => {
  /* States */
  const [isEdit, setIsEdit] = useState(false);
  const [titleState, setTitleState] = useState(title);
  const [urlState, setUrlState] = useState(url);

  /* Refs */
  const titleEditRef = useRef(),
    urlEditRef = useRef();

  function handleEdit() {
    setIsEdit(true);
  }

  function handleSave() {
    // console.log('Saved');
    const tmp = {
      uid,
      title: titleState,
      url: urlState,
    };
    onEditLink(tmp);
    setIsEdit(false);
  }

  useEffect(() => {
    if (isEdit) titleEditRef.current.focus();
  }, [isEdit]);

  function handleChangeTitle(e) {
    const value = e.target.value;
    setTitleState(value);
  }

  function handleChangeUrl(e) {
    const value = e.target.value;
    setUrlState(value);
  }

  useEffect(() => {
    setTitleState(title);
    setUrlState(url);
  }, [title, url]);

  return (
    <div className='flex items-center justify-between'>
      {/* Edit mode */}
      {isEdit ? (
        <div className='flex space-x-4'>
          <input
            className='outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-fit fade'
            type='text'
            ref={titleEditRef}
            autoComplete='off'
            value={titleState}
            onChange={handleChangeTitle}
          />
          <input
            className='outline-none text-base py-4 px-5 rounded-xl bg-gray-200 w-fit fade'
            type='text'
            ref={urlEditRef}
            autoComplete='off'
            value={urlState}
            onChange={handleChangeUrl}
          />
        </div>
      ) : (
        <div>
          <h3 className='flex-grow capitalize'>{title}</h3>
        </div>
      )}

      {/* Buttons */}
      <div className='flex space-x-3'>
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
          onClick={() => onDeleteLink(uid)}
          className='py-3 px-4 bg-[#dc3545] text-white font-medium rounded-xl lg:text-base text-sm'>
          Delete
        </button>
      </div>
    </div>
  );
};

export default LinkActions;
