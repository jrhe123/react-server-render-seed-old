import * as LAYOUT from '../constants/layout'

const INITIAL_STATE = {
    users: '',
    user_type:''
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case LAYOUT.LOGIN:
            return {
                ...state,
                users: action.users,
                user_type: action.user_type
            };
        default :
            return false;
    }
}