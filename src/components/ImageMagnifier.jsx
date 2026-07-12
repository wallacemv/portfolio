import React, { useState } from 'react';
const ImageMagnifier = (props) => {
	const magnifierHeight = 150;
	const magnifieWidth = 150;
	const zoomLevel = 1.6;
	const [[x, y], setXY] = useState([0, 0]);
	const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
	const [showMagnifier, setShowMagnifier] = useState(false);

	const onMouseEnter = (e) => {
		// update image size and turn-on magnifier
		const elem = e.currentTarget;
		const { width, height } = elem.getBoundingClientRect();

		setSize([width, height]);
		setShowMagnifier(true);
	};

	const onMouseMove = (e) => {
		// update cursor position
		const elem = e.currentTarget;
		const { top, left } = elem.getBoundingClientRect();

		// calculate cursor position on the image
		const x = e.pageX - left - window.pageXOffset;
		const y = e.pageY - top - window.pageYOffset;
		setXY([x, y]);
	};

	const onMouseLeave = () => {
		setShowMagnifier(false);
	};

	return (
		<div style={{ position: 'relative' }}>
			{React.cloneElement(props.children, {
				onMouseEnter: onMouseEnter,
				onMouseMove: onMouseMove,
				onMouseLeave: onMouseLeave,
			})}
			{props.children.ref.current && (
				<div style={{ position: 'absolute', top: 0, left: 0, fontSize: '8px' }}>
					{`x: ${x}, y: ${y}`}
				</div>
			)}
			{props.children.ref.current && (
				<div
					style={{
						display: showMagnifier ? '' : 'none',
						position: 'absolute',

						// prevent maginier blocks the mousemove event of img
						pointerEvents: 'none',
						// set size of magnifier
						height: `${magnifierHeight}px`,
						width: `${magnifieWidth}px`,
						// move element center to cursor pos
						top: `${y - magnifierHeight / 2}px`,
						left: `${x - magnifieWidth / 2}px`,
						opacity: '1', // reduce opacity so you can verify position
						border: '1px solid lightgray',
						borderRadius: '50%',
						backgroundColor: 'white',
						backgroundImage: `url('${props.children.ref.current.toDataURL()}')`,
						backgroundRepeat: 'no-repeat',

						//calculate zoomed image size
						backgroundSize: `${imgWidth * zoomLevel}px ${
							imgHeight * zoomLevel
						}px`,

						//calculete position of zoomed image.
						backgroundPositionX: `${-x * zoomLevel + magnifieWidth / 2}px`,
						backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
					}}
				></div>
			)}
		</div>
	);
};

export default ImageMagnifier;
