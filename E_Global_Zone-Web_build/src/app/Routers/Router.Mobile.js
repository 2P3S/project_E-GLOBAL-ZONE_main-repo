import React from "react";
import {Switch, Redirect, Route, Link} from "react-router-dom";
import MobileHeader from "../../components/mobile/Header";
import {
    Reservation,
    Schedules as Schedule,
    Results,
    ApplicationForm,
} from "../../routes/Mobile/Korean";
import MobileLogin from "../../components/mobile/Login";
import Footer from "../../components/mobile/Footer";

/**
 * MobileRouter - Router for Mobile(Korean students)
 * @returns {JSX.Element}
 */
export default () => {

    const handleClick = (e) => {
        for (let i = 1; i <= 3; i++) {
            document.getElementById(`tab${i}`).classList.remove("on");
        }
        e.target.classList.add("on")
    }

    return (
        <>
            <MobileHeader/>
            <div className="wrap">
                <ul className="tab no3">
                    <li>
                        <Link to="/reservation" className="on" id="tab1" onClick={handleClick}>
                            예약 조회
                        </Link>
                    </li>
                    <li>
                        <Link to="/schedule" id="tab2" onClick={handleClick}>스케줄 조회</Link>
                    </li>
                    <li>
                        <Link to="/result" id="tab3" onClick={handleClick}>결과 관리</Link>
                    </li>
                </ul>
                <Switch>
                    <Redirect exact path="/" to={`/reservation`}/>

                    {/* 예약 조회 페이지 */}
                    <Route exact path="/reservation" component={Reservation}/>
                    <Route path="/schedule/:id" component={ApplicationForm}/>
                    {/* 예약 폼 */}

                    {/* 스케쥴 페이지 */}
                    <Route path="/schedule" component={Schedule}/>

                    {/* 결과 페이지 */}
                    <Route path="/result" component={Results}/>

                    {/* 임시 로그인 */}
                    <Route path="/login" component={MobileLogin}/>
                </Switch>
                <Footer/>
            </div>
        </>
    );
};
