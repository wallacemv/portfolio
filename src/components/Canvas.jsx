import React, { useRef, useEffect, useContext } from 'react';
import { useCanvasImage } from '../hooks/useCanvasImage';
import ImageMagnifier from './ImageMagnifier';
import potrace from 'potrace';
import { MainContext } from '../providers/mainProvider';

const Canvas = ({ imageSource, canvasRef }) => {
	const preset = {
		ltres: 1,
		qtres: 1,
		pathomit: 20,
		rightangleenhance: true,
		colorsampling: 0,
		numberofcolors: 3,
		mincolorratio: 0,
		colorquantcycles: 3,
		blurradius: 3,
		blurdelta: 20,
		strokewidth: 0,
		linefilter: false,
		roundcoords: 1,
		pal: [
			{ r: 0, g: 0, b: 100, a: 255 },
			{ r: 255, g: 255, b: 255, a: 255 },
		],
	};

	const { selectedColor, addNewModification, config } = useContext(MainContext);

	const canvasImageHook = useCanvasImage();

	const resize = (image, limit) => {
		var originalHeight = image.height;
		var originalWidth = image.width;

		var scale = originalWidth / originalHeight;

		if (originalWidth > originalHeight) {
			return { width: limit, height: limit / scale };
		} else {
			return { width: limit * scale, height: limit };
		}
	};

	const handleClick = (event) => {
		let context = canvasRef.current.getContext('2d');

		let imageData = context.getImageData(
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		);

		const x = event.nativeEvent.offsetX;
		const y = event.nativeEvent.offsetY;

		let oldColor = canvasImageHook.getPixelColor(
			x,
			y,
			canvasRef.current,
			imageData
		);

		// to avoid many clicks to the same action
		if (
			!imageSource ||
			!selectedColor ||
			(!!oldColor &&
				(oldColor.toUpperCase() == selectedColor || oldColor == '#000000'))
		)
			return;

		canvasImageHook.floodFill(
			x,
			y,
			selectedColor,
			canvasRef.current,
			imageData
		);

		canvasImageHook.setPixelColor(
			x,
			y,
			selectedColor,
			canvasRef.current,
			imageData
		);

		context.putImageData(imageData, 0, 0);
		// add the history of changes
		addNewModification({
			x: x,
			y: y,
			oldColor: oldColor,
			newColor: selectedColor,
		});
	};

	useEffect(() => {
		const image = new Image();
		image.src = imageSource;

		image.onload = () => {
			let canvas = canvasRef.current;
			let context = canvas.getContext('2d');
			canvas.setAttribute('shape-rendering', 'crispEdges');

			const { width, height } = resize(image, config.maxWidth);

			canvas.width = width;
			canvas.height = height;

			var posterizer = new potrace.Potrace({
				background: '#ffffff',
				alphaMax: 1,
				extractColors: false,
				optCurve: true,
				optTolerance: 0.2,
				turdSize: 2,
				turdPolicy: 4,
				blackOnWhite: true,
				turnPolicy: 'majority',
			});

			posterizer.loadImage(image.src, function (err) {
				if (err) throw err;

				let svg = this.getSVG();

				let img = new Image();

				img.onload = function () {
					context.drawImage(img, 0, 0, width, height);
				};
				img.src =
					'data:image/svg+xml;base64,' +
					btoa(unescape(encodeURIComponent(svg)));
			});

			// imagetracer.imageToSVG(
			// 	image.src,
			// 	(svg) => {
			// 		var img = new Image();

			// 		img.onload = function () {
			// 			context.drawImage(img, 0, 0, width, height);
			// 		};
			// 		img.src =
			// 			'data:image/svg+xml;base64,' +
			// 			btoa(unescape(encodeURIComponent(svg)));
			// 	},
			// 	preset
			// );
		};
	}, [imageSource]);

	return (
		<>
			<ImageMagnifier>
				<canvas
					ref={canvasRef}
					style={{ cursor: 'crosshair' }}
					onClick={handleClick}
				/>
			</ImageMagnifier>
		</>
	);
};

export default Canvas;
