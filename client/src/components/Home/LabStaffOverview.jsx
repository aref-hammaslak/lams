import * as React from "react";
import { useEffect, useState } from "react";
import { LabAPI } from "../../apis/LabAPI";
import { LabStatsCard } from "../../components/Home/LabStatsCard.jsx";
import { Spinner } from "@material-tailwind/react";
import { Loading } from "../Global/Loading.jsx";
import { StaffStatsCard } from "./StaffStatsCard.jsx";

export const LabStaffOverview = ({lab}) => {
    const [staff, setStaff] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        console.log();
        if (!lab._id) return;
        (async () => {
            setLoading(true);
            try {
                let staff = await LabAPI.getLabUsersStats(lab._id);
                staff = staff.filter(staff => staff.username !== 'admin');
                console.log("🚀 ~ staff:", staff)
                setStaff(staff);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        })()
    }, []);

    return (
        <>
            {
                loading && <Loading />
            }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mx-auto ">
                {
                    staff.map((staff, i) => (
                        < StaffStatsCard key={i} staffInfo={staff} />
                    ))
                }
            </div>
        </>

    );
}
