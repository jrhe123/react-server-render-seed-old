import * as FRANCHISE from '../constants/franchise'

export const fetch_franchise_profile = (profile) => {

    console.log('action called, now go to reducer');
    return {
        type: FRANCHISE.FETCH_FRANCHISE_PROFILE,
        profile: profile
    }
}

export const fetch_profile_image = (img) => {

    console.log('action called, now go to reducer');
    return {
        type: FRANCHISE.FETCH_PROFILE_IMAGE,
        img: img,
    }
}