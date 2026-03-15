export const showInputError = (
  formElement,
  inputElement,
  errorMessage,
  validationSettings,
) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(validationSettings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationSettings.errorClass);
};

export const hideInputError = (
  formElement,
  inputElement,
  validationSettings,
) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(validationSettings.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(validationSettings.errorClass);
};

export const checkInputValidity = (
  formElement,
  inputElement,
  validationSettings,
) => {
  if (inputElement.validity.patternMismatch) {
    const errorMessage = inputElement.dataset.errorMessage;

    showInputError(formElement, inputElement, errorMessage, validationSettings);
  } else if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      validationSettings,
    );
  } else {
    hideInputError(formElement, inputElement, validationSettings);
  }
};

export const hasInvalidInput = (formElement, validationSettings) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationSettings.inputSelector),
  );

  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

export const disableSubmitButton = (formElement, validationSettings) => {
  const buttonElement = formElement.querySelector(
    validationSettings.submitButtonSelector,
  );
  buttonElement.disabled = true;
  buttonElement.classList.add(validationSettings.inactiveButtonClass);
};

export const enableSubmitButton = (formElement, validationSettings) => {
  const buttonElement = formElement.querySelector(
    validationSettings.submitButtonSelector,
  );
  buttonElement.disabled = false;
  buttonElement.classList.remove(validationSettings.inactiveButtonClass);
};

export const toggleButtonState = (formElement, validationSettings) => {
  if (hasInvalidInput(formElement, validationSettings)) {
    disableSubmitButton(formElement, validationSettings);
  } else {
    enableSubmitButton(formElement, validationSettings);
  }
};

export const setEventListeners = (formElement, validationSettings) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationSettings.inputSelector),
  );

  toggleButtonState(formElement, validationSettings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, validationSettings);
      toggleButtonState(formElement, validationSettings);
    });
  });
};

export const clearValidation = (formElement, validationSettings) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationSettings.inputSelector),
  );

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationSettings);
  });
  disableSubmitButton(formElement, validationSettings);
};

export const enableValidation = (validationSettings) => {
  const formList = Array.from(
    document.querySelectorAll(validationSettings.formSelector),
  );

  formList.forEach((formElement) => {
    setEventListeners(formElement, validationSettings);
  });
};
