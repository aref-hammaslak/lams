/* eslint-disable react/prop-types */

import { GridAddIcon, GridDeleteIcon, useGridApiContext } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Close';
import { useContext } from "react";
import { AlertContext } from "../../contexts/AlertProvider";
import { useSnackbar } from "notistack";
import { Tooltip } from "@mui/material";
import { GridSaveAltIcon } from "@mui/x-data-grid";


const RenderActions = ({ row, apiRef ,...params}) => {
    

    const alertState = useContext(AlertContext);
    const {enqueueSnackbar} = useSnackbar();
    const ref = apiRef.current;
    const rowMode = row.mode;
    const undefinedRow ={}
    ref.getAllColumns().map(col => col.field).forEach(field => {
        if(field === 'date' && field === 'actions') return;
        undefinedRow[field] = undefined
    })

    const EditModeIcons = 
        <div className="space-x-2" >
            <Tooltip title='Save' >
                <GridSaveAltIcon onClick={() => {
                    row.isLoged = true;
                    ref.updateRows([{ id: row.id, mode: 'view'}]);
                    console.log(ref.getRowWithUpdatedValues(row.id));
                    ref.stopRowEditMode({ id: row.id});
                    const serverAction = row.action;

                    enqueueSnackbar(`Log ${serverAction}ed successfully`, {variant:'success'});
                }} />
            </Tooltip>
            <Tooltip title='Cancel'>
                <CancelIcon  onClick={() => {
                    ref.stopRowEditMode({ id: row.id, ignoreModifications: true });
                    ref.updateRows([{ id: row.id, mode: 'view'}]);
                }} />
            </Tooltip>

        </div>
    
    if (row.isLoged) {
        return (
            rowMode === 'edit' ? (EditModeIcons) : (<div className="space-x-2" >
                <Tooltip title='Unlog' >
                    <GridDeleteIcon onClick={() => {
                        
                        ref.updateRows([{...undefinedRow, id: row.id,isLoged:false , mode: 'view' ,date: row.date}]);

                        enqueueSnackbar('Log deleted successfully', {variant:'error'});
                    }} />
                </Tooltip>
                <Tooltip title='Edit'>
                    <EditIcon onClick={() => {
                        ref.startRowEditMode({ id: row.id });
                        ref.updateRows([{ id: row.id, mode: 'edit', action:'update'}]);
                    }} />
                </Tooltip>

            </div>)

        )
    } else {
        return (
            rowMode === 'edit' ? (EditModeIcons) : (<Tooltip title="Log">
                <GridAddIcon onClick={() => {
                   
                   ref.startRowEditMode({ id: row.id });
                   ref.updateRows([{ id: row.id, mode: 'edit', action:'create'}]);
                }} />
            </Tooltip>)

        );
    }
};

export default RenderActions;