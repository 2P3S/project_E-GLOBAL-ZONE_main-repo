import React, {useEffect, useState} from "react";
import {deleteAdminScheduleSome} from "../../../api/admin/schedule";
// import { deleteAdminScheduleSome } from "../../../modules/hooks/useAxios";

export default function DeleteSchedule({
                                           sch_id,
                                           std_for_name,
                                           sch_start_date,
                                           handleClose,
                                           reRender,
                                       }) {
    const [pending, setPending] = useState(false);
    useEffect(() => {
        return reRender;
    }, []);
    useEffect(() => {
        pending && handleClose();
    }, [pending]);
    return (
        <>
            <p>
                {std_for_name}학생의{sch_start_date}
                일정을 삭제하시겠습니까?
            </p>
            <button
                onClick={() => {
                    // deleteAdminScheduleSome(sch_id, setPending);
                    deleteAdminScheduleSome(sch_id).then((res) => {
                        {
                            setPending(true);
                            alert(res.data.message);
                        }
                    });
                }}
            >
                넹
            </button>
        </>
    );
}
