import * as CUSTOMER from '../constants/customer'

export const fetch_customer_img = (img) => {

    console.log('action called, now go to reducer');
    return {
        type: CUSTOMER.FETCH_PROFILE_IMAGE,
        img: img
    }
}