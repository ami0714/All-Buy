import {get } from '../../utils/apiHelper';



export async function getAdminState() {

  
  const response = await get('/admin/dashboard/stats')

    if(response.status === true){
        return response.data
    }

    if(response.status === false){
        return response.message
    }
    

    return {
        status: false,
        message: "gagal fetch"
    }
    
}

export async function getAdminChart(period) {

  
  const response = await get(`/admin/dashboard/chart?period=${period}`);

    if(response.status === true){
        return response.data
    }

    if(response.status === false){
        return response.message
    }
    

    return {
        status: false,
        message: "gagal fetch"
    }
    
}

export async function getAdminStatusOrder() {

  
  const response = await get('/admin/dashboard/status');

    if(response.status === true){
        return response.data
    }

    if(response.status === false){
        return response.message
    }
    

    return {
        status: false,
        message: "gagal fetch"
    }
    
}