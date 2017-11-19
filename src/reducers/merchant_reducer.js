import * as MERCHANT from '../constants/merchant'

const INITIAL_STATE = {

    profile: {
        agentID: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        faxNumber: ''
    },
    posLogin: {
        isCreated: false,
        loginKeyword: '',
    },
    
};

export default function(state = INITIAL_STATE, action) {

    switch(action.type) {

        case MERCHANT.FETCH_MERCHANT_PROFILE:

            console.log('reducer received, call back to component');
            return {
               ...state,
               profile: action.profile
            };

        case MERCHANT.FETCH_MERCHANT_POS_LOGIN:

            console.log('reducer received, call back to component');
            return {
               ...state,
               posLogin: action.posLogin
            };

        default :
            return false;
    }
}