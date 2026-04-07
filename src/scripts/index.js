/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
  new change!
  and change again
*/
import { createCardElement } from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
  createInfoString,
  createInfoList,
} from "./components/modal.js";

// файл index.js
import { enableValidation, clearValidation } from "./components/validation.js";

// файл api.js
import {
  getUserInfo,
  getCardList,
  setUserInfo,
  setAvatar,
  addCard,
  deleteCardApi,
  changeLikeCardStatus,
} from "./components/api.js";

// Создание объекта с настройками валидации
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description",
);

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");
const cardRemoveModalWindow = document.querySelector(".popup_type_remove-card");
const cardRemoveForm = cardRemoveModalWindow.querySelector(".popup__form");
const cardInfoModalWindow = document.querySelector(".popup_type_info");
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");
const cardInfoModalList = cardInfoModalWindow.querySelector(".popup__list");
const cardInfoModalTitle = cardInfoModalWindow.querySelector(".popup__title");
const cardInfoModalLikes = cardInfoModalWindow.querySelector(".popup__text");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

let userId;
let cardElementIndex;
let cardIdIndex;

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const profileFormButton = profileForm.querySelector(".popup__button");
  profileFormButton.textContent = "Сохранение...";
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      pofileTitle.textContent = userData.name;
      prorfileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      profileFormButton.textContent = "Сохранить";
    });
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();
  const formButton = avatarForm.querySelector(".popup__button");
  formButton.textContent = "Сохранение...";
  setAvatar({
    avatar: avatarInput.value,
  })
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      formButton.textContent = "Сохранить";
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const cardFormButton = cardForm.querySelector(".popup__button");
  cardFormButton.textContent = "Создание...";
  addCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardsData) => {
      placesWrap.prepend(
        createCardElement(cardsData, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLikeCard,
          onDeleteCard: handleDeleteCard,
          userId: userId,
          onInfo: handleInfoClick,
        }),
      );
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      cardFormButton.textContent = "Создать";
    });
};

const handleDeleteCard = (cardElement, cardId) => {
  cardElementIndex = cardElement;
  cardIdIndex = cardId;
  openModalWindow(cardRemoveModalWindow);
};

const handleLikeCard = (cardId, likeButton, likesAmount) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  changeLikeCardStatus(cardId, isLiked)
    .then((newCard) => {
      const updatedLike = newCard.likes.some((user) => user._id === userId);

      if (updatedLike) {
        likeButton.classList.add("card__like-button_is-active");
      } else {
        likeButton.classList.remove("card__like-button_is-active");
      }
      likesAmount.textContent = newCard.likes.length;
    })
    .catch((err) => {
      console.log(err);
    });
};

cardRemoveForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const deleteButton = cardRemoveForm.querySelector(".popup__button");
  if (!cardIdIndex || !cardElementIndex) {
    return;
  }
  deleteButton.textContent = "Удаление...";
  deleteCardApi(cardIdIndex)
    .then(() => {
      cardElementIndex.remove();
      cardElementIndex = null;
      cardIdIndex = null;
      closeModalWindow(cardRemoveModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      deleteButton.textContent = "Да";
    });
});

// файл index.js
const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const handleInfoClick = (cardId) => {
  /* Для вывода корректной информации необходимо получить актуальные данные с сервера. */
  getCardList()
    .then((cards) => {
      const cardData = cards.find((card) => card._id === cardId);
      if (!cardData) {
        return;
      }
      cardInfoModalInfoList.innerHTML = "";
      cardInfoModalList.innerHTML = "";
      cardInfoModalTitle.textContent = "Информация о карточке";
      cardInfoModalLikes.textContent = "Лайкнули:";
      cardInfoModalInfoList.append(
        createInfoString("Описание: ", cardData.name),
        createInfoString(
          "Дата создания: ",
          formatDate(new Date(cardData.createdAt)),
        ),
        createInfoString("Владелец: ", cardData.owner.name),
        createInfoString("Количество лайков: ", cardData.likes.length),
      );

      cardData.likes.forEach((user) => {
        cardInfoModalList.append(createInfoList(user.name));
      });
      openModalWindow(cardInfoModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

document.querySelectorAll(".popup__form").forEach((formElement) => {
  formElement.noValidate = true;
}); // отключение браузерной валидации форм и установления класса и атрибута кнопкам форм

enableValidation(validationSettings);

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    userId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    cards.forEach((card) => {
      placesWrap.append(
        createCardElement(card, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLikeCard,
          onDeleteCard: handleDeleteCard,
          userId: userId,
          onInfo: handleInfoClick,
        }),
      );
    });
  })
  .catch((err) => {
    console.log(err); // В случае возникновения ошибки выводим её в консоль
  });
