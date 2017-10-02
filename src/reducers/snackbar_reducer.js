import * as LAYOUT from '../constants/layout'

const INITIAL_STATE = {
    msg: '',
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case LAYOUT.SNACKBAR:
            return {
                ...state,
                msg: action.msg
            };
        default :
            return false;
    }
}