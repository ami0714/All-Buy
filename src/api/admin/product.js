import { get,patch,post } from '../../utils/apiHelper';

export async function getProductList(status) {
  const response = await get(`/admin/products?status=${encodeURIComponent(status)}`);

  if (Array.isArray(response)) {
    return response;
  }

  if (response?.status === false) {
    throw new Error(response.message || 'Gagal mengambil daftar produk.');
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  throw new Error('Format respons daftar produk tidak valid.');
}


export async function updateStatus(currentValue, productId) {
  if (currentValue === null || currentValue === undefined) {
    throw new Error('Status produk tidak sah.');
  }

  if (productId === null || productId === undefined) {
    throw new Error('ID produk tidak sah.');
  }

  const isActive = currentValue === true
    || currentValue === 1
    || currentValue === '1'
    || currentValue === 'active';
  const response = await patch(`/admin/products/${encodeURIComponent(productId)}/status`, {
    is_active: isActive ? 0 : 1,
  });

  if (response?.status === false) {
    throw new Error(response.message || 'Gagal mengemas kini status produk.');
  }

  if (!response || typeof response !== 'object') {
    throw new Error('Format respons kemas kini status produk tidak sah.');
  }

  return response.message ?? response;
}

export async function getProductDetail(product_id) {
  if (product_id === null || product_id === undefined || product_id === '') {
    throw new Error('ID produk tidak sah.');
  }

  const response = await get(`/admin/products/${encodeURIComponent(product_id)}`);

  if (response?.status === false) {
    throw new Error(response.message || 'Gagal mengambil detail produk.');
  }

  const productData = response && Object.hasOwn(response, 'data')
    ? response.data
    : response;

  if (productData && !Array.isArray(productData)) {
    return productData;
  }

  throw new Error('Format respons detail produk tidak valid.');
}


export async function updateProduct(productId, body) {
  if (productId === null || productId === undefined || productId === '') {
    throw new Error('ID produk tidak sah.');
  }

  if (!body || Object.keys(body).length === 0) {
    throw new Error('Tiada perubahan untuk dikemas kini.');
  }

  const response = await patch(`/admin/products/${encodeURIComponent(productId)}`, body);

  if (response?.status === true) {
    return response.message ?? response;
  }

  throw new Error(response?.message || 'Gagal mengemas kini produk.');
}

export async function addProduct( body) {

  if (!body || Object.keys(body).length === 0) {
    throw new Error('Tiada perubahan untuk dikemas kini.');
  }

  const response = await post('/admin/products', body);

  if (response?.status === true) {
    return response.message ?? response;
  }

  throw new Error(response?.message || 'Gagal mengemas kini produk.');
}