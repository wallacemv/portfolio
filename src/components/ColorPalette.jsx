import React, { useContext } from 'react';
import { Button, ColorPicker, Tooltip } from 'antd';
import { MainContext } from '../providers/mainProvider';

const hexColors = [
	'#FF0000', // Vermelho vibrante
	'#007FFF', // Azul elétrico
	'#ADFF2F', // Verde limão
	'#FFFF33', // Amarelo neon
	'#FF1493', // Rosa choque
	'#FFA500', // Laranja vibrante
];

const ColorPalette = (props, ref, canvasRef) => {
	const { setSelectedColor } = useContext(MainContext);

	const changeColor = (event) => {
		if (event.metaColor) {
			setSelectedColor(event.metaColor.toHex().toUpperCase());
		} else {
			setSelectedColor((event.target.value + '').toUpperCase());
		}
	};

	return (
		<div className='color-palette-wrapper flex flex-row flex-wrap gap-2'>
			<Tooltip title='Cor customizada'>
				<ColorPicker format='hex' onChange={changeColor} />
			</Tooltip>
			{hexColors.map((color, index) => (
				<Button
					key={index}
					value={color}
					shape='circle'
					style={{ background: color }}
					onClick={changeColor}
				></Button>
			))}
		</div>
	);
};

export default ColorPalette;
