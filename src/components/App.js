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
import { Switch, Redirect, Route, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.js';
import Login from './Login.js';
import Register from './Register.js';
import NotFound from './NotFound.js';
import * as auth from '../utils/auth.js';
import NavMenu from './NavMenu';
import InfoTooltip from './InfoTooltip.js';

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
  const [authState, setAuthState] = useState({
    loggedIn: false,
    email: null
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);

  const history = useHistory();

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
    setIsInfoTooltipPopupOpen(false);
  };

  function handleUserUpdate(newUser) {
    setIsProcessing(true);
    api.setUserInfo(newUser.name, newUser.about)
      .then(res => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`???????????????????? ?????????????????? ?????????? ???????????? ????????????????????????. ???????????? ${err}`);
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
        console.error(`???????????????????? ?????????????????? ?????????? ????????????. ???????????? ${err}`);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some((likeCard) => likeCard._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((prevCard) => prevCard._id === card._id ? newCard : prevCard));
      })
      .catch((err) => {
        console.error(`?????????????? ???????????????????? ??????????????????. ???????????? ${err}`);
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
        setCards(cards.filter((prevCard) => prevCard._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`???????????????????? ?????????????? ????????????????. ???????????? ${err}`);
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
        console.log(`???????????????????? ???????????????? ?????????? ????????????????. ???????????? ${err}`);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  function handleTokenCheck() {
    const token = localStorage.getItem('token');
    if (token) {
      auth.checkToken(token)
        .then((res) => {
          if (res) {
            setAuthState({
              loggedIn: true,
              email: res.data.email
            });
            history.push('/react-mesto-auth');
          }
        })
        .catch(err => {
          console.log(`?????????????????????? ????????????????????. ???????????? ???????????????????????????? JWT-???????????? ${err}`);
        });
    }
  };

  function handleLogin(email, password) {
    setIsProcessing(true);
    auth.authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          handleTokenCheck();
          setAuthState((prevState) => ({
            ...prevState,
            loggedIn: true
          }));
          history.push('/react-mesto-auth');
        }
      })
      .catch((err) => {
        switch (err) {
          case 400:
            console.log('???????????? 400. ???? ???????????????? ???????? ???? ??????????.');
            break;
          case 401:
            console.log(`???????????? 401. ???????????????????????? ${email} ???? ????????????.`);
            break;
          default:
            console.log(`???????????????????????????? ???? ????????????????. ???????????? ${err}`);
        };
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  function handleSignOut() {
    setAuthState({
      loggedIn: false,
      email: null
    });
    localStorage.removeItem('token');
    history.push('/react-mesto-auth/sign-in');
  };

  function handleRegister(email, password) {
    setIsProcessing(true);
    auth.register(email, password)
      .then((res) => {
        if (!res.error) {
          setIsInfoTooltipPopupOpen(true);
          setRegistrationSuccess(true);
        } else {
          setIsInfoTooltipPopupOpen(true);
        }
      })
      .catch((err) => {
        switch (err) {
          case 400:
            console.log('???????????? 400. ?????????????????????? ?????????????????? ???????? ???? ??????????.');
            break;
          default:
            console.log(`?????????????????????? ???? ??????????????????. ???????????? ${err}`);
        };
        setIsInfoTooltipPopupOpen(true);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    handleTokenCheck();
    api.getInitialData()
      .then(res => {
        const [userData, cardsData] = res;
        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch(err => {
        console.log(`???????????????????? ?????????????????? ???????????? ?? ??????????????. ???????????? ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
    {isLoading ? (
      <Spinner />
    ) : (
      <>
        <CurrentUserContext.Provider value={currentUser}>
          {authState.loggedIn &&
            <NavMenu
              onSignOut={handleSignOut}
              email={authState.email}
            />
          }
          <Header
            onSignOut={handleSignOut}
            email={authState.email}
          />
          <Switch>
            <ProtectedRoute
            path="/react-mesto-auth" exact
            component={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddCard={handleAddCardClick}
            onClickCard={handleCardClick}
            cards={cards}
            onLikeCard={handleCardLike}
            onDeleteCard={handleCardDelete}
            loggedIn={authState.loggedIn}
            email={authState.email}
            />
            <Route path="/react-mesto-auth/sign-in">
              <Login
                handleLogin={handleLogin}
                email={authState.email}
                onRender={isProcessing}
              />
            </Route>
            <Route path="/react-mesto-auth/sign-up">
              <Register
                handleRegister={handleRegister}
                onRender={isProcessing}
              />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
            <Route path="/react-mesto-auth">
              {authState.loggedIn ? <Redirect to="/react-mesto-auth" /> : <Redirect to="/react-mesto-auth/sign-in" />}
            </Route>
          </Switch>
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
          <InfoTooltip
            isOpen={isInfoTooltipPopupOpen}
            onClose={closeAllPopups}
            onRegister={setRegistrationSuccess}
            registration={registrationSuccess}
          />
        </CurrentUserContext.Provider>
      </>
    )}
    </div>
  );
};

export default App;