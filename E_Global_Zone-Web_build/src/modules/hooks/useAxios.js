import defaultAxios from 'axios';
import  {useEffect, useState} from "react";
import conf from "../../conf/conf";

/**
 * Hooks - useAxios is returns response dataset
 * @param {AxiosStatic, function} axiosInstance
 * @param {object} opts url,
 * @return {object} state response data
 */
const useAxios = ( opts,axiosInstance = defaultAxios) => {
    const [state, setState] = useState({
        loading: true,
        error: null,
        data: null
    })
    useEffect(()=>{
        axiosInstance(opts).then(data=>{
            setState({
                ...state,
                error: null,
                loading: false,
                data: data.data
            })
            // console.log(data);
        })
    },[]);
    return state;
}

/**
 * @param {AxiosStatic, function} axiosInstance
 * @param {object} opts url,
 */
export const  postAxios = (opts,history, axiosInstance = defaultAxios) => {
    let result = false;
    axiosInstance(opts).then(data=>{
        if(data.status === 202){
           alert(data.data.message);
           history.push("/schedule");
        }
    })
}

export const getKoreanReservation = (date, setData) =>{
    defaultAxios({url:conf.url+`/api/korean/reservation`, params:{search_date:date}}).then(data=>{
        setData(data.data);
    })
}

export default  useAxios;