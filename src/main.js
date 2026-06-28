import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more-btn');

let userQuery = '';
let page = 1;
let totalHits = 0;

searchForm.addEventListener('submit', handleSearch);
if (loadMoreBtn) loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();

  userQuery = event.currentTarget.elements['search-text'].value.trim();

  if (userQuery === '') {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(userQuery, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        backgroundColor: '#EF4040',
        messageColor: '#FFF',
        closeColor: '#FFF',
        maxWidth: '432px',
      });
      hideLoader();
      return;
    }

    createGallery(data.hits);

    if (totalHits > page * 15) {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

async function handleLoadMore() {
  page += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(userQuery, page);
    createGallery(data.hits);

    smoothScroll();

    if (page * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch more images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

void function smoothScroll() {
  const galleryItem = document.querySelector('.gallery-item');

  if (galleryItem) {
    const { height: cardHeight } = galleryItem.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
};
