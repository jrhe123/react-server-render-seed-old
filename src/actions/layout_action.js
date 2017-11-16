import * as LAYOUT from '../constants/layout'

export const toggleMenu = (toggle) => {
    return {
        type: LAYOUT.TOGGLE_LEFT_MENU,
        toggle_menu: toggle
    };
}

export const showSnackbar = (message, success) => {
    return {
        type: LAYOUT.SNACKBAR,
        msg: message,
        success: success
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

export const hideHeader = (hide_header) => {
    return {
        type: LAYOUT.HIDE_HEADER,
        hide_header: hide_header
    }
}