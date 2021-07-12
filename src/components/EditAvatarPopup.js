import React, { useRef, useEffect, useContext, useState } from 'react';
import PopupWithForm from './PopupWithForm.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { formInputClass } from '../utils/constants.js';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, onRender }) {
  const currentUser = useContext(CurrentUserContext);
  const avatarLink = useRef();
  const [errorMessage, setErrorMessage] = useState('');
  const [errorClass, setErrorClass] = useState({ input: '', error: ''})
  const [submitDisabled, setSubmitDisabled] = useState(false);

  function handleInput(elem) {
    const { validity, validationMessage } = elem.target;
    setErrorMessage(validationMessage);
    setErrorClass({
      input: !validity.valid ? formInputClass.inputErrorClass : '',
      error: !validity.valid ? formInputClass.errorClass : ''
    });
    setSubmitDisabled(!validity.valid);
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    onUpdateAvatar({
      avatar: avatarLink.current.value
    });
  };

  useEffect(() => {
    if (isOpen) {
      avatarLink.current.value = currentUser.avatar;
      setSubmitDisabled(false);
    } else {
      avatarLink.current.value = '';
      setSubmitDisabled(true);
    };
    setErrorMessage('');
    setErrorClass({
      input: '',
      error: ''
    });
  }, [isOpen, currentUser]);

  return (
    <PopupWithForm
      name="avatar-edit"
      title="Новый аватар"
      submitButtonText={onRender ? "Сохранение..." : "Сохранить"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitDisabled={submitDisabled}
    >
      <fieldset className="form-avatar-edit__fieldset">
        <label className="form__field">
          <input
            className={`form__input form-avatar-edit__input ${errorClass.input}`}
            type="url"
            id="avatar-link"
            name="link"
            placeholder="Ссылка на аватар"
            required
            ref={avatarLink}
            onInput={handleInput}
            pattern="https?://.+"
          />
          <span
            className={`form__input-error ${errorClass.error}`}
            id="avatar-link-error"
          >{errorMessage}</span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
};

export default EditAvatarPopup;