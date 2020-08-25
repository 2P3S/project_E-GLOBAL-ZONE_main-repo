import React, {useEffect} from "react";
import Routes from "./Routes";
import useAxios from "../modules/hooks/useAxios";
import { setDept} from "../redux/confSlice/confSlice";
import {useDispatch} from "react-redux";
import conf from "../conf/conf";

/**
 * React App
 * @namespace App
 * @returns {JSX.Element} App with GlobalStyles, Routes
 */
const App = () => {
    const {loading, error, data} = useAxios({url: conf.url+"/api/admin/department"});
    const dispatch = useDispatch();
    async function setDepartment(argLoading){
        let loading = await argLoading;
        if(!loading){
            dispatch(setDept(data));
        }
    }
    useEffect(()=>{
        setDepartment(loading);
    },[data])
    return (<>
        <Routes/>
    </>)
}

export default App;
