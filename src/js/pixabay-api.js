import axios from 'axios';

const API_KEY = '56464018-9d065431ef651fdc70593a5c2';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  const searchParams = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 15,
  };
  const response = await axios.get('', { params: searchParams });
  return response.data;
}
