import * as MERCHANT from '../constants/merchant'

export const fetch_merchant_pos_login = (posLogin) => {

    console.log('action called, now go to reducer');
    return {
        type: MERCHANT.FETCH_MERCHANT_POS_LOGIN,
        posLogin: posLogin
    }
}

export const fetch_merchant_profile = (profile) => {

    console.log('action called, now go to reducer');
    return {
        type: MERCHANT.FETCH_MERCHANT_PROFILE,
        profile: profile
    }
}

export const fetch_employee_list = (employeeList) => {

    console.log('action called, now go to reducer');
    return {
        type: MERCHANT.FETCH_MERCHANT_EMPLOYEE_LIST,
        employeeList: employeeList
    }
}

export const create_merchant_employee = (newEmployee) => {

    console.log('action called, now go to reducer');
    return {
        type: MERCHANT.CREATE_MERCHANT_EMPLOYEE,
        newEmployee: newEmployee
    }
}