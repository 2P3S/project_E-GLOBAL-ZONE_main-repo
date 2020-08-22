import React from "react";
import useClick from "../../modules/hooks/useClick";
import {useDispatch, useSelector} from "react-redux";
import {logIn} from 'redux/userSlice/userSlice';

const Login = () => {
    const dispatch = useDispatch();
    const login = useSelector(logIn);
    return <div className="content">
        <div className="sub_title">
            <p className="tit">글로벌존 서비스 로그인</p>
        </div>
        <div className="login_wrap">
            <p className="tit">Login</p>
            <ul className="tab no2">
                <li>한국인 학생</li>
                <li className="on">유학생</li>
            </ul>
            <div className="login_input">
                <input type="text" placeholder="학번을 입력해주세요."/>
                <input type="text" placeholder="비밀번호를 입력해주세요."/>
                <div className="submit" onClick={()=>dispatch(login)}>로그인</div>
            </div>
        </div>
    </div>
}

export default Login;