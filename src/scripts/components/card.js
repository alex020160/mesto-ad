const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const isLiked = (likeButton) => {
  return likeButton.classList.contains("card__like-button_is-active");
};

export const updateCard = (updatedLike, newCard, likeButton, likesAmount) => {
  if (updatedLike) {
    likeButton.classList.add("card__like-button_is-active");
  } else {
    likeButton.classList.remove("card__like-button_is-active");
  }
  likesAmount.textContent = newCard.likes.length;
};

export const deleteCard = (cardElementIndex) => {
  cardElementIndex.remove();
};
export const createCardElement = (
  data,
  { onPreviewPicture, onLikeIcon, onDeleteCard, userId, onInfo },
) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(
    ".card__control-button_type_delete",
  );
  const infoButton = cardElement.querySelector(
    ".card__control-button_type_info",
  );
  const likesAmount = cardElement.querySelector(".card__like-count");
  likesAmount.textContent = data.likes.length;
  const cardId = data._id;
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  if (data.likes.some((user) => user._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (data.owner._id !== userId) {
    deleteButton.remove();
  }

  if (onLikeIcon) {
    likeButton.addEventListener("click", () =>
      onLikeIcon(cardId, likeButton, likesAmount),
    );
  }

  if (onDeleteCard) {
    deleteButton.addEventListener("click", () =>
      onDeleteCard(cardElement, cardId),
    );
  }

  if (onPreviewPicture) {
    cardImage.addEventListener("click", () =>
      onPreviewPicture({ name: data.name, link: data.link }),
    );
  }

  if (onInfo) {
    infoButton.addEventListener("click", () => {
      onInfo(cardId);
    });
  }

  return cardElement;
};
