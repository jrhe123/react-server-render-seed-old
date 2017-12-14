import * as ADMIN from '../constants/admin'

export const set_UserTypeID = (UserTypeID) => {

    return {
        type: ADMIN.ADMIN_LOGIN_TYPE,
        UserTypeID: UserTypeID
    }
}