/* eslint-disable react/prop-types */
import dayjs from "dayjs";
import { IndeterminateCheckBoxOutlined } from "@mui/icons-material";
import { GridBooleanCell, GridCheckIcon, GridSaveAltIcon, GridSearchIcon } from "@mui/x-data-grid";
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import Tooltip from "@mui/material/Tooltip";
import isToday from 'dayjs/plugin/isToday';
import RenderActions from "./RenderActions";




const DATE_FORMAT = 'YYYY-MM-DD';

// Function to generate log rows based on the given initial date, end date, recurrence, and log template
function generateLogRows(initialDate, endDate, recurrence, logTemp) {
    const logRows = [];
    let currentDate = dayjs(initialDate);

    while (currentDate <= dayjs(endDate)) {
        currentDate = addRecurrence(currentDate, recurrence);

        // Create a log object with default values for the given log template
        const log = {};
        const logItemElements = createLogItemElements(log, logTemp.items);

        const logRow = createLogRow(currentDate.toDate(), logItemElements);
        logRow.id = logRows.length + 1;
        logRow.isLoged = true;
        logRows.push(logRow);
    }

    return logRows;
}

// Function to add the specified recurrence to the current date
function addRecurrence(currentDate, recurrence) {
    switch (recurrence) {
        case "Daily":
            return currentDate.add(1, "day");
        case "Monthly":
            return currentDate.add(1, "month");
        case "Quarterly":
            return currentDate.add(3, "month");
        case "SemiAnnually":
            return currentDate.add(6, "month");
        case "Annually":
            return currentDate.add(1, "year");
        default:
            throw new Error("Invalid recurrence type");
    }
}

// Function to create a log object with default values for the given log template
function createLog(logTemp) {
    return {
        _id: {
            $oid: "658ede388f63bc70fa43e56b",
        },
        date: {
            $date: "2024-04-04T00:00:00.000Z",
        },
        user_id: {
            $oid: "6578300c56b16be110f25b10",
        },
        temp_id: {
            $oid: "654a2d913939a46996332ee3",
        },
        items: {
            "Number of cassettes": 23,
            "Paraffin Temperate (60°c - 62°c)": 60,
            "Perform the Retort Clean Cycle": true,
            "Wipe dry the retort and lid": true,
            "check ground": true,
            "clean pipes": "ok slkdfioewiska ooisajdfoijeioodjkjdsoijwwioEOJAOEGOIRJGPOWPOERJEPOOPIrw            oiwoedijois",
            "count pipes": 3,
            "options": 'R'
        },
        __v: 0,
    };
}

// Function to create log item elements based on the log and log template items
function createLogItemElements(log, logTempItems) {
    const logItemElements = {};

    logTempItems.forEach((item) => {
        const { label, type } = item;

        switch (type) {
            case 0:
                logItemElements[label] = log?.items && log.items[label] || undefined;
                break;
            case 1:
                logItemElements[label] = log?.items && log.items[label] || undefined;
                break;
            case 2:
                logItemElements[label] = log?.items && log.items[label] || 0;
                break;
            case 3:
            case 4:
            case 5:
                logItemElements[label] = log?.items && log.items[label] || getDefaultValue(type);
                break;
            default:
                break;
        }
    });

    return logItemElements;
}

// Function to get the default value for the specified type
function getDefaultValue(type) {
    switch (type) {
        case 3:
            return "C/R/F";
        case 4:
            return "C/R/CR";
        case 5:
            return "C/F";
        default:
            return "";
    }
}

// Function to create a log row object with the given current date and log item elements
function createLogRow(currentDate, logItemElements) {
    return {
        date: currentDate,
        ...logItemElements,
    };
}



// Function to generate log column objects based on the given column data
function generateLogColumns(colData, apiRef) {
    return colData.map((column) => {
        const colItem = {
            field: column.label.toLowerCase(),
            headerName: column.label,
            description: column.label,
            editable: column.label === "Date" ? false : true,
            flex: 1,
            renderCell: ({ row }) => row[column.label.toLowerCase()],

        };

        switch (column.type) {
            case "date":
                colItem.type = "date";
                colItem.sortDirection = 'desc';
                colItem.renderCell = ({ row }) => {

                    dayjs.extend(isToday);
                    const date = dayjs(row.date)
                    if (dayjs(date).isToday()) return "Today"
                    return date.format(DATE_FORMAT);
                }
                break;
            case 'actions':
                colItem.renderCell = (params) => {
                   
                    return <RenderActions {...params} apiRef={apiRef} />
                }
                colItem.editable = undefined;
                colItem.type = 'actions';

                break;
            case 0:
                colItem.type = "boolean";
                colItem.renderCell = ({ value }) => renderBooleanCell(value);
                break;
            case 1:
                colItem.flex = 2;
                colItem.renderCell = (params) => renderTextCell(params.value);
                break;
            case 2:
                colItem.type = "number";
                colItem.renderCell = (params) => renderNumberCell(params.value);
                break;
            case 3:
            case 4:
            case 5:
                colItem.type = "singleSelect";
                colItem.valueOptions = getSingleSelectOptions(column.type);
                colItem.renderCell = (params) => renderOptinalCell(params.value, column.type);
                break;
            default:
                break;
        }

        return colItem;
    });
}

// Function to render a boolean cell based on the given value
function renderBooleanCell(value) {
    if (value === undefined) return <IndeterminateCheckBoxOutlined />;
    return value ? <GridCheckIcon /> : <GridBooleanCell />;
}
function renderNumberCell(value){
    if (value === undefined) return 0;
    return value;
}

function renderOptinalCell(value, type){
    if(value === undefined) return getDefaultValue(type);
    return value;
}
// Function to render a text cell with a tooltip based on the given value
function renderTextCell(value) {
    if (value === undefined) return <TextsmsOutlinedIcon />;
    if (value === "") return <TextsmsOutlinedIcon />;
    return (
        <Tooltip title={value}>
            <p className="">{value}</p>
        </Tooltip>
    );
}

// Function to get the single select options for the specified type
function getSingleSelectOptions(type) {
    switch (type) {
        case 3:
            return ["C", "R", "F"];
        case 4:
            return ["C", "R", "CR"];
        case 5:
            return ["C", "F"];
        default:
            return ;
    }
}



export { generateLogRows, generateLogColumns };