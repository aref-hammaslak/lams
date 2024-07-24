import React from 'react';
const useMousePosition = ({ container = window }) => {
	const [
		mousePosition,
		setMousePosition
	] = React.useState({ x: null, y: null });
	const rect = container.getBoundingClientRect?.() || { left: 0, top: 0};
	React.useEffect(() => {
		const updateMousePosition = ev => {
			// console.log({
			// 	x: ev.layerX,
			// 	y: ev.layerY
			// });
			setMousePosition({
				x: ev.clientX - rect.left,
				y: ev.clientY - rect.top + 80
			});
		};
		container.addEventListener('mousemove', updateMousePosition);
		return () => {
			container.removeEventListener('mousemove', updateMousePosition);
		};
	}, [container]);
	return mousePosition;
};
export default useMousePosition;