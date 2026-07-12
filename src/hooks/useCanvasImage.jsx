import { useContext } from 'react';

export const useCanvasImage = () => {
	const applyColor = (x, y, canvasRef) => {};

	const convertToBlackAndWhite = (imageData, width, height) => {
		// run through the image.
		//  height of the image.
		for (y = 0; y < height; y++) {
			// *4 for 4 ints per pixel.
			//this is an input index.
			inpos = y * width * 4;
			//this is an output index.
			outpos = inpos;
			// width of the image.
			for (x = 0; x < width; x++) {
				r = imageData.data[inpos++];
				g = imageData.data[inpos++];
				b = imageData.data[inpos++];
				a = imageData.data[inpos++];
				// this is transforming  RGB color space to gray scale.
				gray = 0.3 * r + 0.59 * g + 0.11 * b;
				// proper threshold value for black and white
				if (gray > 90) {
					//set the pixel to white.
					imageData.data[outpos++] = 255;
					imageData.data[outpos++] = 255;
					imageData.data[outpos++] = 255;
					imageData.data[outpos++] = a;
				} else {
					//set the pixel to black.
					imageData.data[outpos++] = 0;
					imageData.data[outpos++] = 0;
					imageData.data[outpos++] = 0;
					imageData.data[outpos++] = a;
				}
			}
		}
	};
	const floodFill = (x, y, newColor, canvas, imageData) => {
		const pixelStack = [[x, y]];
		const targetColor = getPixelColor(x, y, canvas, imageData);

		while (pixelStack.length) {
			const newPos = pixelStack.pop();
			const [x, y] = newPos;
			const currentColor = getPixelColor(x, y, canvas, imageData);

			if (currentColor === targetColor) {
				setPixelColor(x, y, newColor, canvas, imageData);

				if (x > 0) {
					const leftColor = getPixelColor(x - 1, y, canvas, imageData);
					if (leftColor === targetColor) {
						pixelStack.push([x - 1, y]);
					}
				}
				if (x < canvas.width - 1) {
					const rightColor = getPixelColor(x + 1, y, canvas, imageData);
					if (rightColor === targetColor) {
						pixelStack.push([x + 1, y]);
					}
				}
				if (y > 0) {
					const upColor = getPixelColor(x, y - 1, canvas, imageData);
					if (upColor === targetColor) {
						pixelStack.push([x, y - 1]);
					}
				}
				if (y < canvas.height - 1) {
					const downColor = getPixelColor(x, y + 1, canvas, imageData);
					if (downColor === targetColor) {
						pixelStack.push([x, y + 1]);
					}
				}
			}
		}
	};

	const getPixelColor = (x, y, canvas, imageData) => {
		const pixelData = imageData.data;
		const pixelIndex = (y * canvas.width + x) * 4;
		const red = pixelData[pixelIndex];
		const green = pixelData[pixelIndex + 1];
		const blue = pixelData[pixelIndex + 2];
		//return `rgb(${red}, ${green}, ${blue})`;
		return rgbToHex(red, green, blue);
	};

	const setPixelColor = (x, y, color, canvas, imageData) => {
		const pixelData = imageData.data;
		const pixelIndex = (y * canvas.width + x) * 4;
		const rgb = hexToRgb(color).match(/\d+/g);
		const red = parseInt(rgb[0]);
		const green = parseInt(rgb[1]);
		const blue = parseInt(rgb[2]);
		pixelData[pixelIndex] = red;
		pixelData[pixelIndex + 1] = green;
		pixelData[pixelIndex + 2] = blue;
	};

	const hexToRgb = (hex) => {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
					result[3],
					16
			  )})`
			: null;
	};

	const rgbToHex = (r, g, b) => {
		return (
			'#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
		).toUpperCase();
	};

	const drawSvgOnCanvas = (svgString, canvas) => {
		const img = new Image();

		img.onload = function () {
			const context = canvas.getContext('2d');
			canvas.setAttribute('shape-rendering', 'crispEdges');
			context.drawImage(img, 0, 0, canvas.width, canvas.height);
		};

		img.src =
			'data:image/svg+xml;base64,' +
			btoa(unescape(encodeURIComponent(svgString)));
	};

	return {
		floodFill,
		getPixelColor,
		setPixelColor,
		drawSvgOnCanvas,
	};
};
