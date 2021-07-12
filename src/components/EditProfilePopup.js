import React, { useState, useEffect, useContext } from 'react';
import PopupWithForm from './PopupWithForm.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { formInputClass } from '../utils/constants.js';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, onRender }) {
  const currentUser = useContext(CurrentUserContext);
  const [input, setInput] = useState({
    name: { value: currentUser.name, isValid: true },
    status: { value: currentUser.about, isValid: true }
  });
  const [errorClass, setErrorClass] = useState({
    name: { input: '', error: '' },
    status: { input: '', error: '' }
  });
  const [errorMessage, setErrorMessage] = useState({ name: '', status: '' })

  function handleChange(elem) {
    const { name, value, validity } = elem.target;
    setInput({ ...input, [name]: {
      value: value,
      isValid: validity.valid
    }});
  };

  function handleInput(elem) {
    const { name, value, validity, validationMessage } = elem.target;
    setInput({...input, [name]: {
      value: value,
      isValid: validity.valid
    }});
    setErrorMessage({ ...errorMessage, [name]: validationMessage });
    setErrorClass({ ...errorClass, [name]: {
      input: !validity.valid ? formInputClass.inputErrorClass : '',
      error: !validity.valid ? formInputClass.errorClass : ''
    }});
  };

  function handleSubmit(event) {
    event.preventDefault();
    onUpdateUser({
      name: input.name.value,
      about: input.status.value
    });
  };

  useEffect(() => {
    if (isOpen) {
      setInput({
        name: { value: currentUser.name, isValid: true },
        status: { value: currentUser.about, isValid: true }
      });
    } else {
      setInput({
        name: { value: '', isValid: false },
        status: { value: '', isValid: false }
      });
    }
    setErrorClass({
      name: { input: '', error: '' },
      status: { input: '', error: ''}
    });
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      name="edit"
      title="Редактировать профиль"
      submitButtonText={onRender ? "Сохранение..." : "Сохранить"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitDisabled={!input.name.isValid || !input.status.isValid}
    >
      <fieldset className="form-edit__fieldset">
        <label className="form__field">
          <input
            className={`form__input form-edit__input ${errorClass.name.input}`}
            type="text"
            id="profile-name"
            name="name"
            placeholder="Имя пользователя"
            minLength="2"
            maxLength="40"
            required
            value={input.name.value}
            onChange={handleChange}
            onInput={handleInput}
          />
          <span className={`form__input-error ${errorClass.name.error}`} id="profile-name-error">{errorMessage.name}</span>
        </label>
        <label className="form__field">
          <input
            className={`form__input form-edit__input ${errorClass.status.input}`}
            type="text"
            id="profile-status"
            name="status"
            placeholder="Статус"
            minLength="2"
            maxLength="200"
            required
            value={input.status.value}
            onChange={handleChange}
            onInput={handleInput}
          />
          <span className={`form__input-error ${errorClass.status.error}`} id="profile-status-error">{errorMessage.status}</span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
};

export default EditProfilePopup;