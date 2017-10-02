import * as LAYOUT from '../constants/layout'

export const toggleMenu = (toggle) => {
    return {
        type: LAYOUT.TOGGLE_LEFT_MENU,
        toggle_menu: toggle
    };
}

export const showSnackbar = (message) => {
    return {
        type: LAYOUT.SNACKBAR,
        msg: message
    }
}

export const getUserList = (list) => {
    return {
        type: LAYOUT.LOGIN,
        users: list.users,
        user_type: list.user_type
    }
}

export const mainPageMoveToSection = (section_y) => {
    return {
        type: LAYOUT.MAINPAGE_MOVETO_SECTION,
        section_y: section_y
    }
}