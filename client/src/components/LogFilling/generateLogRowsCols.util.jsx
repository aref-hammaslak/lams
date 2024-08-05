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
function generateLogRows(logTempFilters) {

    const { startDate, endDate, logTemp } = logTempFilters;
    const { initialDate, recurrence } = logTemp.schedule;
    const logRows = [];
    let currentDate = dayjs(initialDate);

    while (currentDate.isBefore(dayjs(endDate).add(1, 'day'), 'day')) {


        //TODO check whether there is a log for currentDate then assign it into log object 
        const log = {};

        //fill the rows with log data if there is no log for current date fill it with default icons
        const logItemElements = createLogItemElements(log, logTemp.items);

        const logRow = {
            date: currentDate.toDate(),
            ...logItemElements,
        }
        logRow.id = logRows.length + 1;
        logRow.isLoged = false;

        currentDate = addRecurrence(currentDate, recurrence);
        //check the date be in the rage of provided
        if (currentDate.isBefore(dayjs(startDate).add(1, 'day'), 'day')) continue;

        logRows.push(logRow);
    }

    return logRows;
}

// Function to add the specified recurrence to the current date
function addRecurrence(currentDate, recurrence) {
    switch (recurrence) {
        case "daily":
            return currentDate.add(1, "day");
        case "weekly":
            return currentDate.add(7, "day");
        case "monthly":
            return currentDate.add(1, "month");
        case "quarterly":
            return currentDate.add(3, "month");
        case "semiAnnually":
            return currentDate.add(6, "month");
        case "annually":
            return currentDate.add(1, "year");
        default:
            throw new Error("Invalid recurrence type");
    }
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
function renderNumberCell(value) {
    if (value === undefined) return 0;
    return value;
}

function renderOptinalCell(value, type) {
    if (value === undefined) return getDefaultValue(type);
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
            return;
    }
}



export { generateLogRows, generateLogColumns };