import * as React from "react";
import { useEffect, useState } from "react";
import { LabAPI } from "../../apis/LabAPI";
import { LabStatsCard } from "../../components/Home/LabStatsCard.jsx";
import { Spinner } from "@material-tailwind/react";
import { Loading } from "../Global/Loading.jsx";

export const LabsOverview = (props) => {
    const { onLabChange } = props;
    const [labs, setLabs] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const labs = await LabAPI.getLabsStats();
                setLabs(labs);
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
                loading && <Loading/>
            }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mx-auto ">
                {
                    labs.map((lab, i) => (
                        <LabStatsCard onSelect={() => onLabChange(lab._id, lab.name)} key={i} labInfo={lab} />
                    ))
                }
            </div>
        </>

    );
}
