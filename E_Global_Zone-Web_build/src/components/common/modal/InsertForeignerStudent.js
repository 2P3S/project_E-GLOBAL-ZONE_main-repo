import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectDept} from "../../../redux/confSlice/confSlice";
import {postAdminForeignerAccount} from "../../../modules/hooks/useAxios";
import {useHistory} from 'react-router-dom'

const InsertForeignerStudent = ({handleClose}) => {

    const [id, setId] = useState();
    const [dept, setDept] = useState();
    const [name, setName] = useState();
    const [language, setLanguage] = useState();
    const [country, setCountry] = useState();
    const [phone, setPhone]= useState();
    const [mail, setMail] = useState();
    const [zoomId, setZoomId] = useState();

    const [state, setState] = useState(false);
    const history = useHistory();

    const departmentList = useSelector(selectDept)

    const handleChange = (e, setValue) => {
        e.preventDefault();
        setValue(e.target.value);
    }
    /*
    *   @todo 유효성 검
    */
    const handleSave = () => {
        console.log(departmentList);
        departmentList.forEach(v=>{
            if(v.dept_name[0] === dept || v.dept_name[1] === dept){
                setDept(v.dept_id);
            }
        })
    }

    useEffect(()=>{
        if(typeof dept === "number"){
            postAdminForeignerAccount(id,dept,name,language,country,phone, mail, zoomId, setState);
        }
    }, [dept])

    useEffect(()=>{
        if(state){
            history.push('/students/now/foreigner');
        }
        return () => {
            history.push('/students/now/foreigner');
        }
    }, [state])

    return (
        <div className="popup regist">
            <p className="tit">유학생 등록</p>
            <ul className="regist_input">
                <li><input type="text" placeholder="언어 입력" onChange={(e)=>{
                    handleChange(e, setLanguage)
                }}/></li>
                <li><input type="text" placeholder="국가 입력" onChange={(e)=>{
                    handleChange(e, setCountry)
                }}/></li>
                <li><input type="text" placeholder="학번 입력" onChange={(e)=>{
                    handleChange(e, setId)
                }}/></li>
                <li><input type="text" placeholder="이름 입력" onChange={(e)=>{
                    handleChange(e, setName)
                }}/></li>
                <li><input type="text" placeholder="학과 입력" onChange={(e)=>{
                    handleChange(e, setDept)
                }}/></li>
                <li><input type="text" placeholder="연락처 입력" onChange={(e)=>{
                    handleChange(e, setPhone)
                }}/></li>
                <li><input type="text" placeholder="이메일 입력" onChange={(e)=>{
                    handleChange(e, setMail)
                }}/></li>
                <li><input type="text" placeholder="ZoomID 입력" onChange={(e)=>{
                    handleChange(e, setZoomId)
                }}/></li>
            </ul>
            {/*<div className="add_btn"><span>추가</span></div>*/}
            <div class="scroll_area mt20">
                {/*
                                <table class="pop_table">
                    <colgroup>
                        <col width="7%" span="3"/>
                    </colgroup>
                    <thead>
                    <tr>
                        <th scope="col">순번</th>
                        <th scope="col">언어</th>
                        <th scope="col">국가</th>
                        <th scope="col">학번</th>
                        <th scope="col">이름</th>
                        <th scope="col">계열학과</th>
                        <th scope="col">연락처</th>
                        <th scope="col">이메일</th>
                        <th scope="col">ZoomID</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>영어</td>
                        <td>미국</td>
                        <td>1901192</td>
                        <td>바라트벡 울잔</td>
                        <td>컴정</td>
                        <td>010-0000-0000</td>
                        <td>zxc1234@naver.com</td>
                        <td>211 233 1564</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>영어</td>
                        <td>미국</td>
                        <td>1901192</td>
                        <td>바라트벡 울잔</td>
                        <td>컴정</td>
                        <td>010-0000-0000</td>
                        <td>zxc1234@naver.com</td>
                        <td>211 233 1564</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>영어</td>
                        <td>미국</td>
                        <td>1901192</td>
                        <td>바라트벡 울잔</td>
                        <td>컴정</td>
                        <td>010-0000-0000</td>
                        <td>zxc1234@naver.com</td>
                        <td>211 233 1564</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>영어</td>
                        <td>미국</td>
                        <td>1901192</td>
                        <td>바라트벡 울잔</td>
                        <td>컴정</td>
                        <td>010-0000-0000</td>
                        <td>zxc1234@naver.com</td>
                        <td>211 233 1564</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>영어</td>
                        <td>미국</td>
                        <td>1901192</td>
                        <td>바라트벡 울잔</td>
                        <td>컴정</td>
                        <td>010-0000-0000</td>
                        <td>zxc1234@naver.com</td>
                        <td>211 233 1564</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>영어</td>
                        <td>미국</td>
                        <td>1901192</td>
                        <td>바라트벡 울잔</td>
                        <td>컴정</td>
                        <td>010-0000-0000</td>
                        <td>zxc1234@naver.com</td>
                        <td>211 233 1564</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>영어</td>
                        <td>미국</td>
                        <td>1901192</td>
                        <td>바라트벡 울잔</td>
                        <td>컴정</td>
                        <td>010-0000-0000</td>
                        <td>zxc1234@naver.com</td>
                        <td>211 233 1564</td>
                    </tr>
                    </tbody>
                </table>
                */}
            </div>
            <div class="btn_area right">
                <div class="bbtn darkGray" onClick={()=>{handleSave();
                handleClose();
                }}>저장</div>
            </div>
        </div>
    )
}

export default InsertForeignerStudent;