export const addFormatPhoneNumber = (phone) => {
    const numberPattern = /\d+/g;
    phone = phone.match( numberPattern ).join([]);
    let length = phone.toString().length;
    if(length > 10){
        phone = phone.substring(length - 10);
    }
    let p1, p2, p3;
    p1 = phone.substring(0, 3);
    p2 = phone.substring(3, 6);
    p3 = phone.substring(6);
    return '(' + p1 + ') '+p2+' -'+p3;
}

export const removeFormatPhoneNumber = (phone) => {
    const numberPattern = /\d+/g;
    phone = phone.match( numberPattern ).join([]);
    let length = phone.toString().length;
    if(length > 10){
        phone = phone.substring(length - 10);
    }
    return phone;
}