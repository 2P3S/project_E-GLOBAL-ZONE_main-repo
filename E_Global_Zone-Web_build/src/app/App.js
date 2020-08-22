import React, {useEffect} from "react";
import Routes from "./Routes";
import useAxios from "../modules/hooks/useAxios";
import { setDept} from "../redux/confSlice/confSlice";
import {useDispatch} from "react-redux";

/**
 * React App
 * @namespace App
 * @returns {JSX.Element} App with GlobalStyles, Routes
 */
const App = () => {
    const {loading, error, data} = useAxios({url: "http://13.124.189.186:8888/api/admin/department"});
    const dispatch = useDispatch();
    useEffect(()=>{
        if(data){
            dispatch(setDept(data.result));
        }
    },[data])
    return (<>
        <Routes/>
    </>)
}

export default App;
