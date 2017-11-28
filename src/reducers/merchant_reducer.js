import * as MERCHANT from '../constants/merchant'

const INITIAL_STATE = {

    profile: {
        agentID: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        faxNumber: ''
    },
    posLogin: {
        isCreated: false,
        loginKeyword: '',
    },
    
    employeeList: [],
    anchorEl: null,
};

export default function(state = INITIAL_STATE, action) {

    let updated = Object.assign({}, state);
    let idx = null;
    switch(action.type) {

        case MERCHANT.FETCH_MERCHANT_PROFILE:

            console.log('reducer received, call back to component');
            return {
               ...state,
               profile: action.profile
            };

        case MERCHANT.FETCH_MERCHANT_POS_LOGIN:

            console.log('reducer received, call back to component');
            return {
               ...state,
               posLogin: action.posLogin
            };

        case MERCHANT.FETCH_MERCHANT_EMPLOYEE_LIST:

            console.log('reducer received, call back to component');
            return {
               ...state,
               employeeList: action.employeeList
            };

        case MERCHANT.CREATE_MERCHANT_EMPLOYEE:

            console.log('reducer received, call back to component');
            updated.employeeList.unshift(action.newEmployee);
            return updated;    

        case MERCHANT.OPEN_EDIT_MERCHANT_EMPLOYEE:

            console.log('reducer received, call back to component');
            idx = action.idx;
            updated.employeeList[idx].IsOpen = true;
            updated.anchorEl = action.anchorEl;
            return updated;  
            
        case MERCHANT.CLOSE_EDIT_MERCHANT_EMPLOYEE:

            console.log('reducer received, call back to component');
            idx = action.idx;
            updated.employeeList[idx].IsOpen = false;
            updated.anchorEl = null;
            return updated;      

        case MERCHANT.ASSIGN_MERCHANT_EMPLOYEE:

            console.log('reducer received, call back to component');
            idx = action.idx;
            updated.employeeList[idx] = action.updatedEmployee;
            return updated;     

        default :
            return false;
    }
}