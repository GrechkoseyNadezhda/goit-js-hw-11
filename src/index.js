import { PixabayApi } from "./js/fetchImages";

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const pixabayApi = new PixabayApi()

searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreSubmit)

function onSearchFormSubmit(event) {
  event.preventDefault();
  pixabayApi.page = 1;
  pixabayApi.searchQuery = event.target.elements.searchQuery.value;

  pixabayApi.fetchImages()
    .then(searchResult => {
      const imagesArr = searchResult.data.hits;          
      
      gallery.innerHTML = createMarkup(imagesArr);
      loadMoreBtn.classList.remove('is-hidden');
    })
    .catch(err => console.log(err))
}

function onLoadMoreSubmit () {
  pixabayApi.page += 1;
  pixabayApi.fetchImages()
    .then(searchResult => {
      const imagesArr = searchResult.data.hits;         
      gallery.insertAdjacentHTML('beforeend', createMarkup(imagesArr));
      
      if(Math.ceil(searchResult.data.totalHits / pixabayApi.per_page) === pixabayApi.page) {
        loadMoreBtn.classList.add('is-hidden');
      }
    })
    .catch(err => console.log(err))
}


function createMarkup(arrOfElements) {
  return imagesMarkup = arrOfElements.map(elem => {

    return `
    <div class="photo-card">
      <img src="${elem.webformatURL}" alt="${elem.tags}" loading="lazy" />
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