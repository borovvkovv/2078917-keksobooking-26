import { HOUSING_TYPES_EN_RU } from '../dictionary.js';
import { getEnding } from '../utils.js';

/**
 * Вспомогательная функция. Вписать текст в элемент или, в случае отсутствия данных, удалить элемент из DOM
 *
 * @param {Object} element DOM-элемент.
 * @param {String} string Данные для вставки в элемент.
 * @return {undefined} undefined
 */
const setTextOrHideElement = (element, ...strings) => {
  const isValid = strings.every((str) => !!str || typeof (str) === 'number');
  if (isValid) {
    //element.textContent = strings.join(' ');
    element.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.remove();
      }
    });
    element.prepend(`${strings.join(' ')} `);
  }
  else {
    element.classList.add('visually-hidden');
  }
};

/**
 * Генерация массива елементов, где элемент массива - карточка с информацией о сдаче жилья
 *
 * @param {Array} objects Генерируемые объекты.
 * @return {object} Массив объектов.
 */
export const getAdvertElement = (object) => {
  const cardTemplate = document.querySelector('#card').content.querySelector('.popup');
  //const indexArray = [...Array(number).keys()];
  //const indexArray = Array.from({ length: 10 }, (_, index) => index);
  // const adverts = getAdvertObjects(number);
  //const advertElements = Array(objects.length);
  const cardElement = cardTemplate.cloneNode(true);
  //const fragment = document.createDocumentFragment();
  //objects.forEach(({ author, offer }, index) => {
  //const cardElement = cardTemplate.cloneNode(true);
  const { author, offer } = object;
  const { avatar } = author;
  const { title, address, price, type, rooms, guests, checkIn, checkOut, features, description, photos } = offer;

  const titleElement = cardElement.querySelector('.popup__title');
  setTextOrHideElement(titleElement, title);

  const addressElement = cardElement.querySelector('.popup__text--address');
  setTextOrHideElement(addressElement, address);

  const priceElement = cardElement.querySelector('.popup__text--price');
  setTextOrHideElement(priceElement, price);

  const typeElement = cardElement.querySelector('.popup__type');
  setTextOrHideElement(typeElement, HOUSING_TYPES_EN_RU[type]);

  const capacityElement = cardElement.querySelector('.popup__text--capacity');
  if (rooms || typeof (rooms) === 'number') {
    let wordWithCorrectEnding = getEnding(rooms, ['комната', 'комнаты', 'комнат']);
    capacityElement.textContent = `${rooms} ${wordWithCorrectEnding}`;
    if (guests || typeof (guests) === 'number') {
      wordWithCorrectEnding = getEnding(guests, ['гостя', 'гостей', 'гостей']);
      capacityElement.textContent += ` для ${guests} ${wordWithCorrectEnding}`;
    }
  }
  else if (guests || typeof (guests) === 'number') {
    const wordWithCorrectEnding = getEnding(guests, ['гостя', 'гостей', 'гостей']);
    capacityElement.textContent = `Для ${guests} ${wordWithCorrectEnding}`;
  }
  else {
    capacityElement.classList.add('visually-hidden');
  }

  const checkElement = cardElement.querySelector('.popup__text--time');
  if (checkIn) {
    checkElement.textContent = `Заезд после ${checkIn}`;
    if (checkOut) {
      checkElement.textContent += `, выезд до ${checkOut}`;
    }
  }
  else if (checkOut) {
    checkElement.textContent = `Выезд до ${checkOut}`;
  }
  else {
    checkElement.classList.add('visually-hidden');
  }

  if (features && Array.isArray(features) && features.length > 0) {
    cardElement.querySelectorAll('.popup__feature').forEach((feature) => {
      const result = [...feature.classList]
        .some((classItem) => {
          const temp = (/popup__feature--(?<gr>.*)/.exec(classItem));
          if (temp && features.includes(temp.groups.gr)) {
            return true;
          }
        });
      if (!result) {
        feature.classList.add('visually-hidden');
      }
    });
  }
  else {
    cardElement.querySelectorAll('.popup__feature').forEach((feature) => feature.classList.add('visually-hidden'));
    cardElement.querySelector('.popup__features').classList.add('visually-hidden');
  }

  const descriptionElement = cardElement.querySelector('.popup__description');
  setTextOrHideElement(descriptionElement, description);

  const photosContainer = cardElement.querySelector('.popup__photos');
  const photoElementTemplate = photosContainer.querySelector('img');
  photoElementTemplate.remove();
  if (photos && Array.isArray(photos) && photos.length > 0) {
    photos.forEach((photo) => {
      const photoElement = photoElementTemplate.cloneNode(true);
      photoElement.attributes.src.textContent = photo;
      photosContainer.appendChild(photoElement);
    });
  }

  const avatarElement = cardElement.querySelector('.popup__avatar');
  if (avatar) {
    avatarElement.attributes.src.textContent = avatar;
  }
  else {
    avatarElement.classList.add('visually-hidden');
  }

  //advertElements[index] = cardElement;
  //fragment.appendChild(cardElement);
  //});
  return cardElement;
};