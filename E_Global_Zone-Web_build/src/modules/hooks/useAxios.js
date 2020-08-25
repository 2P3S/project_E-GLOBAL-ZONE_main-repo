import defaultAxios from 'axios';
import {useEffect, useState} from "react";
import conf from "../../conf/conf";

/**
 * Hooks - useAxios is returns response dataset
 * @param {AxiosStatic, function} axiosInstance
 * @param {object} opts url,
 * @return {object} state response data
 */
const useAxios = (opts, axiosInstance = defaultAxios) => {
    const [state, setState] = useState({
        loading: true,
        error: null,
        data: null
    })
    useEffect(() => {
        axiosInstance(opts).then(data => {
            setState({
                ...state,
                error: null,
                loading: false,
                data: data.data
            })
            console.log(data);
        })
    }, []);
    return state;
}

/**
 * @param {AxiosStatic, function} axiosInstance
 * @param {object} opts url,
 */
export const postAxios = (opts, history, axiosInstance = defaultAxios) => {
    let result = false;
    axiosInstance(opts).then(data => {
        console.log(data);
        if (data.status === 202) {
            alert(data.data.message);
            history.push("/schedule");
        }
        if (data.status == 201) {
            alert(data.data.message);
            history.push("/schedule");
        }
    })
}

export const getKoreanReservation = (date, std_kor_id, setData) => {
    defaultAxios({url: conf.url + `/api/korean/reservation`, params: {search_date: date, std_kor_id}}).then(data => {
        setData(data.data);
    })
}

export default useAxios;

/**
 * getKoreanReservationResult
 * @param sect_id
 * @param search_month
 * @param std_kor_id
 */
export const getKoreanReservationResult = (sect_id, search_month, std_kor_id, setData) => {
    defaultAxios({
        url: conf.url + `/api/korean/reservation/result`, params: {
            sect_id,
            search_month,
            std_kor_id
        }
    }).then(data => {
        console.log(data);
        setData(data.data);
    })
}

export const getForeignerSchedule = (std_for_id, end_date, start_date, setData) => {
    console.log(conf.url + `/api/foreigner/schedule`, start_date, end_date);
    defaultAxios({
        url: conf.url + `/api/foreigner/schedule`, params: {
            start_date,
            end_date,
            std_for_id
        }
    }).then(data => {
        console.log(data)
        setData(data.data);
    })
}

/**
 *
 * @param sch_id
 * @param result_start_img
 * @param result_end_img
 * @todo => 이미지 데이터를 보내야 되는데 가질 못해!
 */
export const postForeignerReservationResult = (sch_id, data) => {
    // let data = new FormData()
    // data.append("result_start_img", result_end_img);
    // data.append("result_end_img", result_end_img);
    // console.log(result_start_img, result_end_img);
    // defaultAxios({
    //     method: 'post',
    //     url: `${conf.url}/api/foreigner/reservation/result/${sch_id}`, data: {
    //         // result_start_img,
    //         // result_end_img,
    //         data,
    //         // attendance_std_kor_id_list : [1321704, 132123],
    //         // absent_std_kor_id_list: []
    //     },
    //     headers: {
    //         'Content-Type': 'multipart/form-data'
    //     }
    // }).then(res => {
    //     console.log(res);
    // })
    // defaultAxios.post(conf.url+`/api/foreigner/reservation/result/${sch_id}`,
    //             data
    // , {
    //     headers:{
    //         'content-type':"multipart/form-data"
    //     }
    // }).then(res=>{
    //     console.log(res)
    // }).catch(e=>console.log(e));
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = () => {
        if (ajax.readyState === 0) {
            ajax.setRequestHeader('content-type', 'multipart/form-data');
        }
        if (ajax.readyState === 4) {
            console.log(ajax.response);
        }
    }

    ajax.open("post", conf.url + `/api/foreigner/reservation/result/${sch_id}`, true);
    ajax.send(data);
}

export const getForeignerReservation = (sch_id, std_for_id, setData) => {
    defaultAxios({
        url: conf.url + `/api/foreigner/reservation/${sch_id}`, params: {
            std_for_id
        }
    }).then(res => {
        console.log(res);
        setData(res.data);
    })

}

export const patchForeignerReservationPermission = (sch_id, permission_std_kor_id_list, not_permission_std_kor_id_list) => {

    defaultAxios({
        url: conf.url + `/api/foreigner/reservation/permission/${sch_id}`,
        method: "patch",
        data: {permission_std_kor_id_list, not_permission_std_kor_id_list},
        headers: {
            'Context-Type': "application/json"
        }
    }).then(
        res => {

        }
    ).catch(e => {
        console.log(e)
    })

}

export const postAdminForeignerAccount = (std_for_id, std_for_dept, std_for_name, std_for_lang, std_for_country, std_for_phone, std_for_mail, std_for_zoom_id, setState) => {
    defaultAxios({
        method: 'post',
        url: conf.url + `/api/admin/foreigner/account`,
        data: {
            std_for_id,
            std_for_dept,
            std_for_name,
            std_for_lang,
            std_for_country,
            std_for_phone,
            std_for_mail,
            std_for_zoom_id
        }
    }).then(res => {
        console.log(res)
        setState(true)
    }).catch(e => console.log(e));
}


export const getAdminForeignerWork = (setDataSet, sect_id = 5) => {

    defaultAxios({
        url: conf.url + `/api/admin/foreigner/work/${sect_id}`
    }).then(res => {
        console.log(res);
        setDataSet(res.data);
    })

}

export const getAdminSection = (year) => {
    defaultAxios({
        url: conf.url + `/api/admin/section`,
        params: {
            year
        }
    })

}

export const getKoreanSection = (std_kor_id, setState) => {
    defaultAxios({
        url: conf.url + `/api/korean/section`, params: {
            std_kor_id
        }
    }).then(res => {
        setState(res.data.data)
    })
}
