import defaultAxios from 'axios';
import  {useEffect, useState} from "react";

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
        })
    },[]);
    return state;
}

export default  useAxios;