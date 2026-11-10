import {get,post,patch} from "../../utils/apiHelper";


export async function getAllCourierAdmin(){

    const res = await get('/admin/shipping');

    if (res?.status === true && Array.isArray(res.data)) {
        return res.data;
    }
    throw new Error(res?.message || 'Invalid courier list response format.');
}

export async function getAllshippingMethodAdmin(){
    const res = await get('/admin/shipping/method');

    if (res?.status === true && Array.isArray(res.data)) {
        return res.data;
    }
    throw new Error(res?.message || 'Invalid shipping method list response format.');
}

export async function addNewCourierAdmin(courierData){
    if(!courierData || typeof courierData !== 'object') {
        throw new Error('Invalid courier data provided.');
    }
    const res = await post('/admin/shipping/couriers', courierData);
    if (res?.status === true) {
        return res.data;
    }
    throw new Error(res?.message || 'Failed to add new courier.');
}

export async function addNewShippingMethod(shippingData){
    if(!shippingData || typeof shippingData !== 'object') {
        throw new Error("invalid shipping method data");
        
    }
    const res = await post('/admin/shipping/method',shippingData)

    if(res?.status == true){
        return res
    }
    throw new Error(res?.message || 'Failed to add new shipping method');
    
}



export async function updateStatus(currentValue, courier_id) {
  if (currentValue === null || currentValue === undefined) {
    throw new Error('Invalid courier status.');
  }

  if (courier_id === null || courier_id === undefined) {
    throw new Error('Invalid courier ID.');
  }

  const isActive = currentValue === true
    || currentValue === 1
    || currentValue === '1'
    || currentValue === 'active';
  const response = await patch(`/admin/shipping/couriers/status/${courier_id}`, {
    is_active: isActive ? 0 : 1,
  });

  if (response?.status === false) {
    throw new Error(response.message || 'Unable to update courier status.');
  }

  if (!response || typeof response !== 'object') {
    throw new Error('Invalid courier status update response format.');
  }

  return response.message ?? response;
}



