import { get,patch,post } from '../../utils/apiHelper';

export async function getProductList(status) {
  const response = await get(`/admin/products?status=${encodeURIComponent(status)}`);

  if (Array.isArray(response)) {
    return response;
  }

  if (response?.status === false) {
    throw new Error(response.message || 'Unable to retrieve the product list.');
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  throw new Error('Invalid product list response format.');
}


export async function updateStatus(currentValue, productId) {
  if (currentValue === null || currentValue === undefined) {
    throw new Error('Invalid product status.');
  }

  if (productId === null || productId === undefined) {
    throw new Error('Invalid product ID.');
  }

  const isActive = currentValue === true
    || currentValue === 1
    || currentValue === '1'
    || currentValue === 'active';
  const response = await patch(`/admin/products/${encodeURIComponent(productId)}/status`, {
    is_active: isActive ? 0 : 1,
  });

  if (response?.status === false) {
    throw new Error(response.message || 'Unable to update product status.');
  }

  if (!response || typeof response !== 'object') {
    throw new Error('Invalid product status update response format.');
  }

  return response.message ?? response;
}

export async function getProductDetail(product_id) {
  if (product_id === null || product_id === undefined || product_id === '') {
    throw new Error('Invalid product ID.');
  }

  const response = await get(`/admin/products/${encodeURIComponent(product_id)}`);

  if (response?.status === false) {
    throw new Error(response.message || 'Unable to retrieve product details.');
  }

  const productData = response && Object.hasOwn(response, 'data')
    ? response.data
    : response;

  if (productData && !Array.isArray(productData)) {
    return productData;
  }

  throw new Error('Invalid product details response format.');
}


export async function updateProduct(productId, body) {
  if (productId === null || productId === undefined || productId === '') {
    throw new Error('Invalid product ID.');
  }

  if (!body || Object.keys(body).length === 0) {
    throw new Error('There are no changes to update.');
  }

  const response = await patch(`/admin/products/${encodeURIComponent(productId)}`, body);

  if (response?.status === true) {
    return response.message ?? response;
  }

  throw new Error(response?.message || 'Unable to update product.');
}

export async function addProduct( body) {

  if (!body || Object.keys(body).length === 0) {
    throw new Error('There are no changes to update.');
  }

  const response = await post('/admin/products', body);

  if (response?.status === true) {
    return response.message ?? response;
  }

  throw new Error(response?.message || 'Unable to add product.');
}