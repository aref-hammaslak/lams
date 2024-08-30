import { colors } from "@mui/material";
import withMT from "@material-tailwind/react/utils/withMT";
import tailwindscrollbar from "tailwind-scrollbar";
 
export default withMT( {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // important: "#root",
  theme: {
    extend: {
      colors:{
        primaryDark: '#172554',
        primaryLight: '#e3f2fd',
        primary:'#2563eb',
        secondry:'#47e5e5'
      }
    },
  },
  plugins: [
    tailwindscrollbar
  ],
});