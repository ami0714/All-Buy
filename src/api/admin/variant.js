import { get,patch,post } from '../../utils/apiHelper';

export async function getVariantList(product_id) {
  if (product_id === null || product_id === undefined || product_id === '') {
    throw new Error('Invalid product ID.');
  }

  const response = await get(`/admin/products/${encodeURIComponent(product_id)}/variants`);

  if (Array.isArray(response)) {
    return response;
  }

  if (response?.status === false) {
    throw new Error(response.message || 'Unable to retrieve the variant list.');
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  throw new Error('Invalid variant list response format.');
}

export async function updateVariant(variant_id, data) {
  if (variant_id === null || variant_id === undefined || variant_id === '') {
    throw new Error('Invalid variant ID.');
  }
   const response = await patch(`/admin/products/variants/${encodeURIComponent(variant_id)}`, data);

  if (response?.status === true) {
    return response;
  }
  if(response?.status === false) {
    throw new Error(response.message || 'Unable to update variant.');
  }

  throw new Error('Invalid variant update response format.');
}


export async function addVariant(product_id, data) {
  if (product_id === null || product_id === undefined || product_id === '') {
    throw new Error('Invalid product ID.');
  }
  const response = await post(`/admin/products/${encodeURIComponent(product_id)}/variants`, data);

  if (response?.status === true) {
    return response;
  }
  if(response?.status === false) {
    throw new Error(response.message || 'Unable to add variant.');
  }

  throw new Error('Invalid variant creation response format.');
}
