import * as LAYOUT from '../constants/layout'

const INITIAL_STATE = {
    toggle_menu: false,
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case LAYOUT.TOGGLE_LEFT_MENU:
            return {
                ...state,
                toggle_menu: action.toggle_menu
            };
        default :
            return false;
    }
}