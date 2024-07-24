import { useContext } from "react";
import DayContext from "../contexts/DayProvider";

const useDay = () => {
	return useContext(DayContext);
}

export default useDay;
