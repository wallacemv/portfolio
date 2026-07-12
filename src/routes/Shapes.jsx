import React from 'react';
import KUTE from 'kute.js';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { RedoOutlined, DeleteOutlined } from '@ant-design/icons';

let nextId = 0;

const Shapes = () => {
	const [path, setPath] = useState([]);

	useEffect(() => {}, []);

	const createWave = (color = 'blue', opacity = '0.6') => {
		const container = document.getElementById('svg-wrapper');
		const svgWidth = container.clientWidth;
		const svgHeight = 400;
		const svg = document.getElementById('wave-container');

		svg.setAttribute('width', svgWidth);
		svg.setAttribute('height', svgHeight);

		const frequency = Math.random() * (0.02 - 0.009 + 0.009);
		const amplitude = Math.random() * 80;
		const phase = Math.random() * 10;

		let pathData = `M 0 ${svgHeight / 2}`;

		for (let x = 0; x < svgWidth; x++) {
			const y = amplitude * Math.sin(frequency * x + phase) + svgHeight / 2;
			pathData += `L ${x} ${y}`;
		}

		pathData += `L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

		setPath([...path, { id: nextId++, path: pathData }]);

		const pathElement = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'path'
		);
		pathElement.setAttribute('d', pathData);
		pathElement.setAttribute('id', `wave-${nextId}`);

		pathElement.setAttribute(
			'fill',
			`#${Math.floor(Math.random() * 16777215).toString(16)}`
		);
		pathElement.setAttribute('opacity', opacity);

		svg.appendChild(pathElement);

		// path.setAttribute("stroke", "black");

		// useChat()
		// como usar o useState
	};

	const clearWaves = () => {
		const svg = document.getElementById('wave-container');
		svg.innerHTML = '';
	};

	return (
		<div className='shapes-wrapper h-full overflow-auto bg-[#ff6600]'>
			<div className='flex flex-1 p-4 flex-col gap-2'>
				<div className='flex gap-2'>
					<Button
						onClick={createWave}
						shape='default'
						color='primary'
						style={{ background: 'white' }}
						icon={<RedoOutlined />}
					>
						Gerar shape (clica bastante)
					</Button>

					<Button
						onClick={clearWaves}
						shape='default'
						color='primary'
						style={{ background: 'white' }}
						icon={<DeleteOutlined />}
					>
						Limpar
					</Button>
				</div>

				<div id='svg-wrapper' className='flex w-full'>
					<svg
						id='wave-container'
						width='100%'
						preserveAspectRatio='none'
					></svg>
				</div>
			</div>
		</div>
	);
};

export default Shapes;
