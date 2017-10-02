import * as LAYOUT from '../constants/layout'

const INITIAL_STATE = {
    real_time_traffic: []
};

const getNewTraffic = (arr, count) => {
    let temp = [];
    let date = new Date();
    if(arr && arr.length > 0) {
        for(let i = 0;i < arr.length;i++) {
            temp.push(arr[i]);
        }
    }
    temp.push({ name: date.toISOString().substring(14).substr(0,5), traffic: count });
    if(temp.length > 20) temp.shift();
    return temp;
}

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case LAYOUT.REAL_TIME_TRAFFIC: {
            return {
                ...state,
                real_time_traffic: getNewTraffic(state.real_time_traffic, action.real_time_traffic)
            };
        }
        default :
            return false;
    }
}