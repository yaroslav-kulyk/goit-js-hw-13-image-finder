const API_KEY = '22978515-5cb8795ed8e9eafc86c022855';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImageApiService {
  constructor() {
    this.query = '';
    this.page = 1;
  }

  fetchImages() {
    const searchParams = new URLSearchParams({
      q: this.query,
      key: API_KEY,
      image_type: 'photo',
      per_page: 12,
      page: this.page,
    });

    const url = `${BASE_URL}?${searchParams}`;

    return fetch(url)
      .then(response => response.json())
      .then(({ hits }) => {
        this.page += 1;
        return hits;
      });
  }

  fetchImageById(id) {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      id,
    });

    const url = `${BASE_URL}?${searchParams}`;

    return fetch(url).then(response => response.json().then(({ hits }) => hits));
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this._query;
  }

  set query(newQuery) {
    this._query = newQuery;
  }
}
