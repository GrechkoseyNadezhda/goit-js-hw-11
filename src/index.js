import { PixabayApi } from "./js/fetchImages";
import markupGallery from "./templates/markupGallery.hbs";
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

async function onSearchFormSubmit(event) {
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

  try{    
    const searchResult = await pixabayApi.fetchImages()
    const imagesArr = searchResult.data.hits;    
    
    if (imagesArr.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
      throw new Error("Limit error");
    }

    gallery.innerHTML = markupGallery(imagesArr);
    simpleLightbox.refresh();
    Notiflix.Notify.info(`Hooray! We found ${searchResult.data.totalHits} images.`)
    if(searchResult.data.totalHits > pixabayApi.per_page) {
      loadMoreBtn.classList.remove('is-hidden');
    }
    searchBtn.disabled = false;
  } catch(err) {console.log(err)}
  
  input.value = '';
}

async function onLoadMoreSubmit () {
  pixabayApi.page += 1;
  
    try {
      const searchResult = await pixabayApi.fetchImages()
      const imagesArr = searchResult.data.hits;         
      gallery.insertAdjacentHTML('beforeend', markupGallery(imagesArr));
      simpleLightbox.refresh();
      slowScroll();
      if(Math.ceil(searchResult.data.totalHits / pixabayApi.per_page) < pixabayApi.page) {
        loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.info("'We're sorry, but you've reached the end of search results.")
      }
    } catch(err) {console.log(err)}
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

