/* eslint-disable react/prop-types */
import { useCallback } from "react";
import {
  GridAddIcon,
  GridDeleteIcon,
  GridSaveAltIcon,
} from "@mui/x-data-grid";
import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { useSnackbar } from "notistack";
import { logFillingContext } from "../../contexts/LogFillingProvider";
import { RefreshContext } from "../../contexts/RefreshProvider";

const RenderActions = ({ row, apiRef, ...params }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { logTempFilters, equLog } = useContext(logFillingContext);
  const { items: logItems, _id: temp_id, schedule } = logTempFilters.logTemp;
  const { handelRefresh } = useContext(RefreshContext);
  const { createEquLog, updateEquLog, deleteEquLog } = equLog;
  const ref = apiRef.current;
  const rowMode = row.mode;
  const getUndefinedRow = useCallback(() => {
    const undefinedRow = {};
    ref.getAllColumns()
      .map((col) => col.field)
      .forEach((field) => {
        if (field === "date" || field === "actions") return;
        undefinedRow[field] = undefined;
      });
    return undefinedRow;
  }, [ref]);

  const handleSave = useCallback(async () => {
    const updatedRow = ref.getRowWithUpdatedValues(row.id);

    const labels = logItems.map(item => item.label);
    const items = {}
    labels.forEach(label => {
      items[label] = updatedRow[label];
    })
    const data = {
      date: updatedRow.date,
      sch_id: schedule._id,
      temp_id,
      items

    }
    const serverAction = row.action;
    switch (serverAction) {
      case 'create': {
        const newLog = await createEquLog(data);
        if (newLog) {
          ref.updateRows([{ id: row.id, _id: newLog._id, mode: "view", isLoged: true }]);
          ref.stopRowEditMode({ id: row.id });
          handelRefresh();
        } else {
          ref.updateRows([{ id: row.id, mode: "view", isLoged: false }]);
          ref.stopRowEditMode({ id: row.id, ignoreModifications: true });
        }
        break;
      }
      case 'update': {
        const newLog = await updateEquLog(row._id, data);
        if (newLog) {
          ref.stopRowEditMode({ id: row.id });
          handelRefresh();
        } else {
          ref.stopRowEditMode({ id: row.id, ignoreModifications: true });
        }
        ref.updateRows([{ id: row.id, mode: "view" }]);
        break;
      }
      default:
        break;
    }
  }, [enqueueSnackbar, ref, row]);

  const handleCancel = useCallback(() => {
    ref.stopRowEditMode({ id: row.id, ignoreModifications: true });
    ref.updateRows([{ id: row.id, mode: "view" }]);
  }, [ref, row.id]);

  const handleDelete = useCallback(async () => {
    const undefinedRow = getUndefinedRow();

    const error = await deleteEquLog(row._id);
    console.error(error);
    if (error == null) {
      ref.updateRows([
        {
          ...undefinedRow,
          id: row.id,
          edited: true,
          isLoged: false,
          mode: "view",
          date: row.date,
        },
      ]);
      handelRefresh();
    }


  }, [deleteEquLog, getUndefinedRow, ref, row]);

  const handleEdit = useCallback(() => {
    ref.startRowEditMode({ id: row.id });
    ref.updateRows([{ id: row.id, mode: "edit", action: "update" }]);
  }, [ref]);

  const handleAddLog = useCallback(() => {
    ref.startRowEditMode({ id: row.id });
    ref.updateRows([{ id: row.id, mode: "edit", action: "create" }]);
  }, [ref]);

  const EditModeIcons = (
    <div className="space-x-2">
      <Tooltip title="Save">
        <GridSaveAltIcon className="cursor-pointer" onClick={handleSave} />
      </Tooltip>
      <Tooltip title="Cancel">
        <CancelIcon className="cursor-pointer" onClick={handleCancel} />
      </Tooltip>
    </div>
  );

  if (row.isLoged) {
    return rowMode === "edit" ? (
      EditModeIcons
    ) : (
      <div className="space-x-2">
        <Tooltip title="Unlog">
          <GridDeleteIcon className="cursor-pointer" onClick={handleDelete} />
        </Tooltip>
        <Tooltip title="Edit">
          <EditIcon className="cursor-pointer" onClick={handleEdit} />
        </Tooltip>
      </div>
    );
  } else {
    return rowMode === "edit" ? (
      EditModeIcons
    ) : (
      <Tooltip title="Log">
        <GridAddIcon className="cursor-pointer" onClick={handleAddLog} />
      </Tooltip>
    );
  }
};

export default RenderActions;