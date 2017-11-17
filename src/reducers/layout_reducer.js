import * as LAYOUT from '../constants/layout'

const INITIAL_STATE = {
    toggle_menu: false,
    // section_y: {},
    // hide_header: false
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case LAYOUT.TOGGLE_LEFT_MENU:
            return {
                ...state,
                toggle_menu: action.toggle_menu
            };
        // case LAYOUT.MAINPAGE_MOVETO_SECTION:
        //     return {
        //         ...state,
        //         section_y: action.section_y
        //     };
        // case LAYOUT.HIDE_HEADER:
        //     return {
        //         ...state,
        //         hide_header: action.hide_header
        //     };
        default :
            return false;
    }
}