import * as LAYOUT from '../constants/admin'

const INITIAL_STATE = {
    UserTypeID: 6,
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case LAYOUT.ADMIN_LOGIN_TYPE:
            return {
                ...state,
                UserTypeID: action.UserTypeID
            };
        default :
            return false;
    }
}