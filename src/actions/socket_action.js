import * as LAYOUT from '../constants/layout'
import axio from '../constants/axio'

export const emit_real_time_traffic = (dispatch) => {
    return (dispatch) => {
        axio.get('/get_traffic').then((res) => {
            if(res) {
                return dispatch(emit_traffic(res.data.rows[0].count))
            }
        }).catch((error)=>{
            console.log('err',error)
            if(reqError(error) === 1){
            }
        });
    }
}

export const emit_traffic = (count) => {
    return {
        type: LAYOUT.REAL_TIME_TRAFFIC,
        real_time_traffic: count
    };
}