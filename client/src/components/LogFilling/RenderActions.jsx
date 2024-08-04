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
import { AlertContext } from "../../contexts/AlertProvider";
import { useSnackbar } from "notistack";

const RenderActions = ({ row, apiRef, ...params }) => {
  const alertState = useContext(AlertContext);
  const { enqueueSnackbar } = useSnackbar();
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

  const handleSave = useCallback(() => {
    row.isLoged = true;
    ref.updateRows([{ id: row.id, mode: "view" }]);
    ref.stopRowEditMode({ id: row.id });
    const serverAction = row.action;

    enqueueSnackbar(`Log ${serverAction}ed successfully`, { variant: "success" });
  }, [enqueueSnackbar, ref, row]);

  const handleCancel = useCallback(() => {
    ref.stopRowEditMode({ id: row.id, ignoreModifications: true });
    ref.updateRows([{ id: row.id, mode: "view" }]);
  }, [ref, row.id]);

  const handleDelete = useCallback(() => {
    const undefinedRow = getUndefinedRow();
    ref.updateRows([
      {
        ...undefinedRow,
        id: row.id,
        isLoged: false,
        mode: "view",
        date: row.date,
      },
    ]);
    enqueueSnackbar("Log deleted successfully", { variant: "error" });
  }, [getUndefinedRow, ref]);

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
        <GridSaveAltIcon onClick={handleSave} />
      </Tooltip>
      <Tooltip title="Cancel">
        <CancelIcon onClick={handleCancel} />
      </Tooltip>
    </div>
  );

  if (row.isLoged) {
    return rowMode === "edit" ? (
      EditModeIcons
    ) : (
      <div className="space-x-2">
        <Tooltip title="Unlog">
          <GridDeleteIcon onClick={handleDelete} />
        </Tooltip>
        <Tooltip title="Edit">
          <EditIcon onClick={handleEdit} />
        </Tooltip>
      </div>
    );
  } else {
    return rowMode === "edit" ? (
      EditModeIcons
    ) : (
      <Tooltip title="Log">
        <GridAddIcon onClick={handleAddLog} />
      </Tooltip>
    );
  }
};

export default RenderActions;