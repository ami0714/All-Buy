import { get,patch } from '../../utils/apiHelper';

export async function getCategory() {
  const response = await get('/admin/category');

  if (Array.isArray(response)) {
    return response;
  }

  if (response?.status === false) {
    throw new Error(response.message || 'Unable to retrieve the category list.');
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  throw new Error('Invalid category list response format.');
}