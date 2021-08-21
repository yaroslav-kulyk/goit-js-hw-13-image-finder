const basicLightbox = require('basiclightbox');

import './sass/main.scss';
import ImageApiService from './js/api-service';
import imageCardTpl from './templates/image-card.hbs';

const galleryRef = document.querySelector('.js-gallery');
const formRef = document.querySelector('#search-form');

const imageApiService = new ImageApiService();

formRef.addEventListener('submit', onSubmit);
galleryRef.addEventListener('click', onClick);

function onSubmit(event) {
  event.preventDefault();

  imageApiService.query = event.currentTarget.elements.query.value.trim();

  if (imageApiService.query === '') {
    return;
  }

  imageApiService.resetPage();
  imageApiService
    .fetchImages()
    .then(renderImages)
    .catch(error => {
      console.log(error);
      alert('Something went wrong');
    });
}

function onClick(event) {
  if (!event.target.hasAttribute('src')) {
    return;
  }

  imageApiService
    .fetchImageById(event.target.id)
    .then(getBigImageURL)
    .then(createLightboxInstance)
    .then(showImage)
    .catch(error => {
      console.log(error);
      alert('Something went wrong');
    });
}

function renderImages(hits) {
  if (hits.length === 0) {
    alert('No images found');
    return;
  }

  galleryRef.innerHTML = imageCardTpl(hits);
}

function renderMoreImages(hits) {
  galleryRef.insertAdjacentHTML('beforeend', imageCardTpl(hits));
}

function getBigImageURL(data) {
  return data[0].largeImageURL;
}

function createLightboxInstance(url) {
  return basicLightbox.create(`<img src=${url} />`);
}

function showImage(instance) {
  instance.show();
}

const handleTriggerIntersection = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && imageApiService.query !== '') {
      imageApiService.fetchImages().then(renderMoreImages);
    }
  });
};

const options = {
  rootMargin: '150px',
};

const observer = new IntersectionObserver(handleTriggerIntersection, options);

const trigger = document.querySelector('#trigger');

observer.observe(trigger);
