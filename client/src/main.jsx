import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthProvider";
import "./index.css";
import "./tailwind.output.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "./theme.mui";
import AlertProvider from "./contexts/AlertProvider";
import { SnackbarProvider } from 'notistack';
import { ThemeProvider as TWThemeProvider } from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>

      <StyledEngineProvider injectFirst>
         <TWThemeProvider>
            <CssBaseline />
            <AuthProvider>
               <BrowserRouter>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                     <SnackbarProvider maxSnack={3}>
                        <AlertProvider>
                           <ThemeProvider theme={theme}>
                              <Routes>
                                 <Route path="/*" element={<App />} />
                              </Routes>
                           </ThemeProvider>
                        </AlertProvider>
                     </SnackbarProvider>

                  </LocalizationProvider>
               </BrowserRouter>
            </AuthProvider>
         </TWThemeProvider>
      </StyledEngineProvider>
   </React.StrictMode >
);
