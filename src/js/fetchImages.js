'use strict';

import axios from 'axios';

export class PixabayApi {
  #BASE_URL = 'https://pixabay.com';
  #API_KEY = '31491346-b15049fc2f6fbb9cd88f031e0';

  constructor() {
    this.page = 1;
    this.searchQuery = null;
    this.per_page = '40';
  }

  async fetchImages() {
    try {
      const searchParams = {
        params: {
          q: this.searchQuery,
          page: this.page,
          per_page: this.per_page,
          image_type: 'photo',
          orientation: 'horizontal', 
          key: this.#API_KEY,
        },
      };
  
      return await axios.get(`${this.#BASE_URL}/api/`, searchParams);
    } catch (error) {
      console.log(error);
    }

  }
}