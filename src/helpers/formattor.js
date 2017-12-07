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

export const formatDatetime = (d) => {
    let dateArr = d.split('T');
    if(dateArr.length == 2){
        let date = dateArr[0];
        let time = dateArr[1].substring(0,8);    
        return date+' '+time;
    }else{
        return d;
    }
}

export const capitalStr = (temp) => {
    let str = temp;
    if(!str){
        return '';
    }else if(str.length == 0){
        return '';
    }else if(str.length == 1){
        return str.toUpperCase();
    }else{
        return str.substr(0,1).toUpperCase() + str.substr(1).toLowerCase();
    }
}