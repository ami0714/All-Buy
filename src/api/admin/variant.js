import { get } from '../../utils/apiHelper';

export async function getVariantList(product_id) {
  if (product_id === null || product_id === undefined || product_id === '') {
    throw new Error('ID produk tidak sah.');
  }

  const response = await get(`/admin/products/${encodeURIComponent(product_id)}/variants`);

  if (Array.isArray(response)) {
    return response;
  }

  if (response?.status === false) {
    throw new Error(response.message || 'Gagal mengambil daftar variant.');
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  throw new Error('Format respons daftar variant tidak valid.');
}