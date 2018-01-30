import * as CUSTOMER from '../constants/customer'

const INITIAL_STATE = {
    img: ''
};

export default function(state = INITIAL_STATE, action) {

    let updated = Object.assign({}, state);
    switch(action.type) { 

        case CUSTOMER.FETCH_PROFILE_IMAGE:

            console.log('reducer received, call back to component');
            updated.img = action.img;
            return updated;     

        default :
            return false;
    }
}