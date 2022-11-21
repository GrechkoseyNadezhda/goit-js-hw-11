import { PixabayApi } from "./js/fetchImages";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchBtn = document.querySelector('.submit-btn');
const input = document.querySelector('input')


const simpleLightbox = new SimpleLightbox('.photo-card a', {
  captionDelay: 250,
});

const pixabayApi = new PixabayApi()

searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreSubmit)

function onSearchFormSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');
  pixabayApi.page = 1;
  pixabayApi.searchQuery = event.target.elements.searchQuery.value.trim();

  if(!pixabayApi.searchQuery) {
    Notiflix.Notify.failure('Enter the keyword, please');
    return;
  }

  searchBtn.disabled = true;

  pixabayApi.fetchImages()
  .then(searchResult => {
    
    const imagesArr = searchResult.data.hits;    
    
    if (imagesArr.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')

      throw new Error("Limit error");
    }

    gallery.innerHTML = createMarkup(imagesArr);
    simpleLightbox.refresh();
    Notiflix.Notify.info(`Hooray! We found ${searchResult.data.totalHits} images.`)
    if(searchResult.data.totalHits > pixabayApi.per_page) {
      loadMoreBtn.classList.remove('is-hidden');
    }
  })
  .catch(err => console.log(err))
  .finally(() => searchBtn.disabled = false)

  input.value = '';
}

function onLoadMoreSubmit () {
  pixabayApi.page += 1;
  pixabayApi.fetchImages()
    .then(searchResult => {
      const imagesArr = searchResult.data.hits;         
      gallery.insertAdjacentHTML('beforeend', createMarkup(imagesArr));
      simpleLightbox.refresh();
      slowScroll();
      searchBtn.disabled = true;
      if(Math.ceil(searchResult.data.totalHits / pixabayApi.per_page) === pixabayApi.page) {
        loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.info("'We're sorry, but you've reached the end of search results.")
      }
    })
    .catch(err => console.log(err))
    .finally(() => searchBtn.disabled = false)

}


function createMarkup(arrOfElements) {
  return imagesMarkup = arrOfElements.map(elem => {

    return `
    <div class="photo-card">
      <a href="${elem.largeImageURL}"><img src="${elem.webformatURL}" alt="${elem.tags}" loading="lazy" /></a>      

      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${elem.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${elem.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${elem.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${elem.downloads}
        </p>
      </div>
    </div>`
  }).join('');

  
}

function slowScroll () {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}

