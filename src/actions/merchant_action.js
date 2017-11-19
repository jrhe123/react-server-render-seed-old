import * as MERCHANT from '../constants/merchant'

export const fetch_merchant_pos_login = (posLogin) => {

    console.log('action called, now go to reducer');
    return {
        type: MERCHANT.FETCH_MERCHANT_POS_LOGIN,
        posLogin: posLogin
    }
}

export const fetch_merchant_profile = (profile) => {

    console.log('action called, now go to reducer');
    return {
        type: MERCHANT.FETCH_MERCHANT_PROFILE,
        profile: profile
    }
}