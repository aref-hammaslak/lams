import { Box } from "@mui/material";
import { useState } from "react";

export const BoxController = ({ renderComponent, onHoverProps, componentProps }) => {
	const [hover, setHover] = useState(false);
	const cps = {
		...componentProps,
		...{onHoverProps: hover ? onHoverProps : undefined}
	};
	return (
		<Box
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			{renderComponent(hover ? onHoverProps : componentProps)}
		</Box>
	);
}