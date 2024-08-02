import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthProvider";
import "./index.css";
import "./tailwind.output.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "./theme.mui";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <CssBaseline />
      <AuthProvider>
         <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
               <ThemeProvider theme={theme}>
                                 <Routes>
                  <Route path="/*" element={<App />}/>
               </Routes>
               </ThemeProvider>

            </LocalizationProvider>
         </BrowserRouter>
      </AuthProvider>
   </React.StrictMode>
);
