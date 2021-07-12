import React, { useState, useEffect } from 'react';
import PopupWithForm from './PopupWithForm.js';
import { formInputClass } from '../utils/constants.js';

function AddPlacePopup({ isOpen, onClose, onAddCard, onRender }) {
  const [input, setInput] = useState({
    name: { value: '', isValid: true },
    link: { value: '', isValid: true }
  });
  const [errorClass, setErrorClass] = useState({
    name: { input: '', error: ''},
    link: { input: '', error: ''}
  });
  const [errorMessage, setErrorMessage] = useState({name: '', link: ''});

  function handleChange(elem) {
    const { name, value, validity } = elem.target;
    setInput({ ...input, [name]: {
      value: value,
      isValid: validity.valid
    }});
  };

  function handleInput(elem) {
    const { name, value, validity, validationMessage } = elem.target;
    setInput({ ...input, [name]: {
      value: value,
      isValid: validity.valid,
    }});
    setErrorMessage({ ...errorMessage, [name]: validationMessage });
    setErrorClass({ ...errorClass, [name]: {
      input: !validity.valid ? formInputClass.inputErrorClass : '',
      error: !validity.valid ? formInputClass.errorClass : ''
    }});
  };

  function handleSubmit(event) {
    event.preventDefault();
    onAddCard({
      name: input.name.value,
      link: input.link.value
    });
  };

  useEffect(() => {
    setInput({
      name: { value: '', isValid: false },
      link: { value: '', isValid: false }
    });
    setErrorClass({
      name: { input: '', error: ''},
      link: { input: '', error: ''}
    });
  }, [isOpen]);

  return (
    <PopupWithForm
      name="add"
      title="Новая фотокарточка"
      submitButtonText={onRender ? "Сохранение..." : "Сохранить"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitDisabled={!input.name.isValid || !input.link.isValid}
    >
      <fieldset className="form-add__fieldset">
        <label className="form__field">
          <input
            className={`form__input form-add__input ${errorClass.name.input}`}
            type="text"
            id="card-name"
            name="name"
            placeholder="Название карточки"
            minLength="2"
            maxLength="30"
            required
            value={input.name.value}
            onChange={handleChange}
            onInput={handleInput}
          />
          <span className={`form__input-error ${errorClass.name.error}`} id="card-name-error">{errorMessage.name}</span>
        </label>
        <label className="form__field">
          <input
            className={`form__input form-add__input ${errorClass.link.input}`}
            type="url"
            id="card-link"
            name="link"
            placeholder="Ссылка на фотографию"
            required
            value={input.link.value}
            onChange={handleChange}
            onInput={handleInput}
            pattern="https?://.+"
          />
          <span className={`form__input-error ${errorClass.link.error}`} id="card-link-error">{errorMessage.link}</span>
        </label>
      </fieldset>
    </PopupWithForm>
  );
};

export default AddPlacePopup;