import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthProvider";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <CssBaseline />
      <AuthProvider>
         <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
               <Routes>
                  <Route path="/*" element={<App />}/>
               </Routes>
            </LocalizationProvider>
         </BrowserRouter>
      </AuthProvider>
   </React.StrictMode>
);
