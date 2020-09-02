import React, {useEffect, useState} from "react";
import List from "./List";

/**
 * TabView for Mobile
 * @returns {JSX.Element}
 * @constructor
 */
export default function TabView({list}) {
    const [data, setData] = useState(list); // 스케줄 데이터 배열로 초기화
    const [tabData, setTabData] = useState(data);
    const [select, setSelect] = useState("all");
    
    const handleClick = (e) => {
        setSelect(e.target.id);
    }

    useEffect(() => {
        let array = [];
        if (select === "all") {
            setTabData(data);
        } else {
            data.data.forEach(v => {
                if (v.std_for_lang === select) {
                    array.push(v);
                }
            })
            setTabData({...data, data: []});
            setTabData({...data, data: array});

        }
        console.log(tabData)
    }, [select])

    return (
        <>
            <ul className="sch_tab">
                <li>
                    <div className="on" id="all" onClick={handleClick}>
                        전체
                    </div>
                </li>
                <li>
                    <div className="eng" id="영어" onClick={handleClick}>
                        영어
                    </div>
                </li>
                <li>
                    <div className="jp" id="일본어" onClick={handleClick}>
                        일본어
                    </div>
                </li>
                <li>
                    <div className="ch" id="중국어" onClick={handleClick}>
                        중국어
                    </div>
                </li>
            </ul>
            <List tabView data={tabData}></List>
        </>
    );
}
