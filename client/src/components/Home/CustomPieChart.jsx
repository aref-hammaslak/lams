import React from 'react'
import { PieChart } from '@mui/x-charts/PieChart';

export const CustomPieChart = ({ stats, className }) => {
    const data = [{ id: 0, value: stats.done, label: 'Done' },
    { id: 1, value: stats.unDone, label: 'Undone' }
    ]
    const noFoundData = [
        { id: 0, label: 'No Data', color: 'rgb(107, 106, 106)' }
    ]
    return (
        <PieChart
            className={`${className}`}
            colors={['rgb(23, 235, 40)', 'rgb(240, 8, 8)']}
            series={[
                {
                    // data: [
                    //     { id: 0, value: 10, label: 'Done' },
                    //     { id: 1, value: 15, label: 'Undone' },
                    //     // { id: 2, value: 20, label: 'series C' },
                    // ],
                    data: stats.total > 0 ? data : noFoundData
                },
            ]}
            width={300}
            height={150}
            slots={{
               
            }}


        />
    )
}