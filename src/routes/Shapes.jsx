import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from 'antd';
import { RedoOutlined, DeleteOutlined } from '@ant-design/icons';

const Shapes = () => {
	const wavesRef = useRef([]);
	const animRef = useRef(null);
	const [waveCount, setWaveCount] = useState(0);

	const createWave = useCallback(() => {
		const container = document.getElementById('svg-wrapper');
		if (!container) return;
		const svgWidth = container.clientWidth;
		const svgHeight = 400;

		wavesRef.current.push({
			id: Date.now() + Math.random(),
			color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
			opacity: (Math.random() * 0.4 + 0.2).toFixed(2),
			frequency: Math.random() * 0.015 + 0.005,
			amplitude: Math.random() * 60 + 20,
			phase: Math.random() * Math.PI * 2,
			speed: Math.random() * 0.08 + 0.04,
			offsetX: 0,
			svgWidth,
			svgHeight,
		});

		setWaveCount((n) => n + 1);
	}, []);

	const clearWaves = useCallback(() => {
		wavesRef.current = [];
		setWaveCount(0);
	}, []);

	useEffect(() => {
		const animate = () => {
			const svg = document.getElementById('wave-container');
			const container = document.getElementById('svg-wrapper');
			if (!svg || !container) {
				animRef.current = requestAnimationFrame(animate);
				return;
			}

			const svgWidth = container.clientWidth;
			const svgHeight = 400;
			svg.setAttribute('width', svgWidth);
			svg.setAttribute('height', svgHeight);
			svg.innerHTML = '';

			wavesRef.current.forEach((w) => {
				w.offsetX += w.speed;

				let pathData = `M 0 ${svgHeight}`;
				for (let x = 0; x <= svgWidth; x += 3) {
					const y =
						w.amplitude * Math.sin(w.frequency * (x + w.offsetX) + w.phase) +
						svgHeight / 2;
					pathData += `L ${x} ${y}`;
				}
				pathData += `L ${svgWidth} ${svgHeight} Z`;

				const pathEl = document.createElementNS(
					'http://www.w3.org/2000/svg',
					'path'
				);
				pathEl.setAttribute('d', pathData);
				pathEl.setAttribute('fill', w.color);
				pathEl.setAttribute('opacity', w.opacity);
				svg.appendChild(pathEl);
			});

			animRef.current = requestAnimationFrame(animate);
		};

		animRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animRef.current);
	}, [waveCount]);

	return (
		<div className='shapes-wrapper h-full overflow-auto bg-[#f97316]'>
			<div className='flex h-full p-4 flex-col gap-2 justify-end'>
				<div className='flex gap-2'>
					<Button
						onClick={createWave}
						shape='default'
						style={{ background: 'white' }}
						icon={<RedoOutlined />}
					>
						Gerar shapes
					</Button>

					<Button
						onClick={clearWaves}
						shape='default'
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
