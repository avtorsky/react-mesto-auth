import '../index.css';
import React, { useState, useEffect } from 'react';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import Spinner from './Spinner.js';
import api from '../utils/api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import DeleteCardPopup from './DeleteCardPopup.js';


function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddCardPopupOpen, setIsAddCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCardDelete, setCurrentCardDelete] = useState({})

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleAddCardClick() {
    setIsAddCardPopupOpen(true);
  };

  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard);
    setIsImagePopupOpen(true);
  };

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddCardPopupOpen(false);
    setSelectedCard({});
    setIsImagePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
  };

  function handleUserUpdate(newUser) {
    setIsProcessing(true);
    api.setUserInfo(newUser.name, newUser.about)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Невозможно сохранить новые данные пользователя. Ошибка ${err}`);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  function handleAvatarUpdate(newAvatar) {
    setIsProcessing(true);
    api.setUserAvatar(newAvatar.avatar)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(`Невозможно сохранить новый аватар. Ошибка ${err}`);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some((likeCard) => likeCard._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((oldCard) => oldCard._id === card._id ? newCard : oldCard));
      })
      .catch((err) => {
        console.error(`Событие невозможно выполнить. Ошибка ${err}`);
      });
  };

  function handleCardDelete(card) {
    setCurrentCardDelete(card);
    setIsDeleteCardPopupOpen(true);
  };

  function handleCardDeleteSubmit(card) {
    setIsProcessing(true);
    api.deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((oldCard) => oldCard._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Невозможно удалить карточку. Ошибка ${err}`);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  function handleAddCardSubmit(newCard) {
    setIsProcessing(true);
    api.addCard(newCard.name, newCard.link)
      .then(res => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Невозможно добавить новую карточку. Ошибка ${err}`);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    api.getInitialData()
      .then(res => {
        const [userData, cardsData] = res;
        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch(err => {
        console.log(`Невозможно загрузить данные с сервера. Ошибка ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    isLoading ? (
      <Spinner />
    ) : (
      <>
        <CurrentUserContext.Provider value={currentUser}>
          <Header />
          <Main
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddCard={handleAddCardClick}
            onClickCard={handleCardClick}
            cards={cards}
            onLikeCard={handleCardLike}
            onDeleteCard={handleCardDelete}
          />
          <Footer />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUserUpdate}
            onRender={isProcessing}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleAvatarUpdate}
            onRender={isProcessing}
          />
          <AddPlacePopup
            isOpen={isAddCardPopupOpen}
            onClose={closeAllPopups}
            onAddCard={handleAddCardSubmit}
            onRender={isProcessing}
          />
          <DeleteCardPopup
            isOpen={isDeleteCardPopupOpen}
            onClose={closeAllPopups}
            card={currentCardDelete}
            onDeleteCard={handleCardDeleteSubmit}
            onRender={isProcessing}
          />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            isOpen={isImagePopupOpen}
          />
        </CurrentUserContext.Provider>
      </>
    )
  );
};

export default App;
