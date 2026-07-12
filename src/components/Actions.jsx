import React, { useRef, useEffect, useContext } from 'react';
import { MainContext } from '../providers/mainProvider';

import { useCanvasImage } from '../hooks/useCanvasImage';

import {
	RedoOutlined,
	UndoOutlined,
	DownloadOutlined,
} from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

const Actions = ({ canvasRef }) => {
	const { modifications, cursor, setCursor } = useContext(MainContext);

	const canvasImageHook = useCanvasImage();

	const undo = () => {
		if (modifications.length > 0) {
			const action = modifications[cursor];

			if (action) {
				let context = canvasRef.current.getContext('2d');
				let imageData = context.getImageData(
					0,
					0,
					canvasRef.current.width,
					canvasRef.current.height
				);

				canvasImageHook.floodFill(
					action.x,
					action.y,
					action.oldColor.toUpperCase(),
					canvasRef.current,
					imageData
				);

				context.putImageData(imageData, 0, 0);

				setCursor(cursor - 1 < 0 ? undefined : cursor - 1);
			}
		}
	};

	const redo = () => {
		if (modifications.length > 0) {
			const c = cursor == undefined ? 0 : cursor + 1;
			const action = modifications[c];

			if (action) {
				let context = canvasRef.current.getContext('2d');
				let imageData = context.getImageData(
					0,
					0,
					canvasRef.current.width,
					canvasRef.current.height
				);

				canvasImageHook.floodFill(
					action.x,
					action.y,
					action.newColor.toUpperCase(),
					canvasRef.current,
					imageData
				);

				context.putImageData(imageData, 0, 0);

				setCursor(c);
			}
		}
	};

	const download = () => {
		var url = canvasRef.current.toDataURL('image/webp', 1);
		var link = document.createElement('a');
		link.download = 'paint.webp';
		link.href = url;
		link.click();
	};

	return (
		<>
			<div className='flex flex-row justify-center gap-2'>
				<Tooltip title='Desfazer'>
					<Button
						shape='circle'
						type='primary'
						icon={<UndoOutlined />}
						onClick={undo}
					/>
				</Tooltip>
				<Tooltip title='Refazer'>
					<Button
						shape='circle'
						type='primary'
						icon={<RedoOutlined />}
						onClick={redo}
					/>
				</Tooltip>
				<Tooltip title='Download'>
					<Button
						shape='circle'
						type='primary'
						icon={<DownloadOutlined />}
						onClick={download}
					/>
				</Tooltip>
			</div>
		</>
	);
};

export default Actions;
