import Calibration from "../models/Calibration.js";
import Equipment from "../models/Equipment.js";

export async function getCalibrations(labId, eqId = null, dateStart = null, dateEnd = null) {
    const pipeline =
        [
            {
                $lookup: {
                    from: 'equipment',
                    localField: 'eq_id',
                    foreignField: '_id',
                    as: 'eq_details',
                    pipeline: [
                        {
                            $project: {
                                '_id': 0,
                                'name': 1,
                                'lab_id': 1
                            }
                        }
                    ]
                }
            },
            {
                $match: {
                    'eq_details.lab_id': {
                        $eq: labId
                    }
                }
            }
        ];

    if (eqId) {
        pipeline.push({
            $match: {
                'eq_id': {
                    $eq: eqId
                }
            }
        });
    }
    if (dateStart) {
        pipeline.push({
            $match: {
                'date': {
                    $gte: dateStart
                }
            }
        });
    }
    if (dateEnd) {
        pipeline.push({
            $match: {
                'date': {
                    $lte: dateEnd
                }
            }
        });
    }

    return await Calibration.aggregate(pipeline);
}

export async function getCalibrationById(id, labId) {
    const calibration = await Calibration.findById(id);
    if (!calibration) {
        return null;
    }

    const equipment = await Equipment.findById(calibration.eq_id);
    if (!equipment) {
        throw new Error('Calibration linked to non-existent equipment');
    }

    if (!equipment.lab_id.equals(labId)) {
        return null;
    }
    return calibration;
}

