import * as FRANCHISE from '../constants/franchise'

const INITIAL_STATE = {

    profile: {
        agentID: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        faxNumber: ''
    },

    img: ''
};

export default function(state = INITIAL_STATE, action) {

    let updated = Object.assign({}, state);
    switch(action.type) {

        case FRANCHISE.FETCH_FRANCHISE_PROFILE:

            console.log('reducer received, call back to component');
            return {
               ...state,
               profile: action.profile
            };            

        case FRANCHISE.FETCH_PROFILE_IMAGE:

            console.log('reducer received, call back to component');
            updated.img = action.img;
            return updated;     

        default :
            return false;
    }
}