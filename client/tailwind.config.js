import { colors } from "@mui/material";
import  withMT from "@material-tailwind/react/utils/withMT";
 
export default withMT( {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // important: "#root",
  theme: {
    extend: {
      colors:{
        primaryDark: '#172554',
        primary:'#2563eb',
        secondry:'#47e5e5'
      }
    },
  },
  plugins: [],
});