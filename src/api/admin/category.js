import { get,patch,post } from '../../utils/apiHelper';

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

export async function addCategory(body) {
  if (!body || Object.keys(body).length === 0) {
    throw new Error('There are no changes to add.');
  }

  const response = await post('/admin/category', body);

  if (response?.status === true) {
    return response.message ?? response;
  }

  throw new Error(response?.message || 'Unable to add category.');
}

export async function updateCategory(categoryId, body) {
  if (categoryId === null || categoryId === undefined || categoryId === '') {
    throw new Error('Invalid category ID.');
  }

  if (!body || Object.keys(body).length === 0) {
    throw new Error('There are no changes to update.');
  }

  const response = await patch(`/admin/category/${categoryId}`, body);

  if (response?.status === true) {
    return response.message ?? response;
  }

  throw new Error(response?.message || 'Unable to update category.');
}