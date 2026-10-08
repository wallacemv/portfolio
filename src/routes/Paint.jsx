import React, { useState, useContext, useRef, useEffect } from 'react';
import { Upload, theme } from 'antd';
import ColorPalette from '../components/ColorPalette';
import Canvas from '../components/Canvas';
import { MainContext } from '../providers/mainProvider';
import Actions from '../components/Actions';
import { DeleteOutlined, FormatPainterFilled } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { usePageMeta } from '../lib/seo';

const Paint = () => {
	usePageMeta({
		title: 'Desenhos para Colorir Online | Wallace Martins Vieira',
		description:
			'Desenhos para colorir online: Mario, Sonic, Homem-Aranha e Turma da Mônica. Pinte e baixe direto no navegador, de graça.',
		path: '/paint',
		jsonLd: {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://codedbywallace.dev/portfolio/' },
				{ '@type': 'ListItem', position: 2, name: 'Paint', item: 'https://codedbywallace.dev/portfolio/paint' },
			],
		},
	});

	const { resetModifications, modifications, setCursor, config } =
		useContext(MainContext);

	const [selectedImage, setSelectedImage] = useState(null);

	const canvasRef = useRef(null);

	const images = [
		{
			url: 'images/turma-da-monica-para-colorir-20.jpg',
		},
		{
			url: 'images/7905143.jpg',
		},
		{
			url: 'images/desenho-super-mario-imprimir-14.gif',
		},
		{
			url: 'images/desenhos-de-mario-bross-para-colorir-1-1024x708.jpg',
		},
		{
			url: 'images/homem-aranha-para-colorir-lancando-a-teia.jpg',
		},
		{
			url: 'images/homem-aranha-para-pintar-1.jpg',
		},
		{
			url: 'images/mario-para-colorir-33-800x608.jpg',
		},
		{
			url: 'images/sonic-para-colorir-monstro.jpg',
		},
		{
			url: 'images/sonic-para-colorir-paz-e-amor.jpg',
		},
		{
			url: 'images/sonic-para-colorir-super-rapido.jpg',
		},
		{
			url: 'images/sonic-sega-para-colorir.jpg',
		},
		{
			url: 'images/turma-da-monica-para-colorir-6.jpg',
		},
	];

	let shuffled = images
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);

	const [fileList, setFileList] = useState(shuffled.slice(0, 2));

	const onSelectFile = ({ fileList: newFileList }) => {
		setFileList(newFileList);
	};

	const onPreview = async (file) => {
		let src = file.url;

		if (!src) {
			src = await new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.originFileObj);
				reader.onload = () => resolve(reader.result);
			});
		}

		// when image change, reset action history

		resetModifications();
		setCursor(undefined);
		setSelectedImage(src);
	};

	const waveLayers = [
		{ color: '#fa7268', opacity: 0.5, frequency: 0.012, amplitude: 26, phase: 0.5, speed: 0.05 },
		{ color: '#dc4267', opacity: 0.6, frequency: 0.016, amplitude: 32, phase: 1.7, speed: 0.07 },
		{ color: '#c62368', opacity: 0.7, frequency: 0.02, amplitude: 38, phase: 3.0, speed: 0.04 },
		{ color: '#8b1e4d', opacity: 0.8, frequency: 0.009, amplitude: 22, phase: 4.2, speed: 0.06 },
	];

	useEffect(() => {
		const svg = document.getElementById('visual');
		if (!svg) return;

		const paths = waveLayers.map((layer) => {
			const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			el.setAttribute('fill', layer.color);
			el.setAttribute('opacity', layer.opacity);
			svg.appendChild(el);
			return { ...layer, el, offset: Math.random() * 100 };
		});

		let animId;

		const animate = () => {
			paths.forEach((w) => {
				w.offset += w.speed;

				let pathData = 'M 0 600';
				for (let x = 0; x <= 900; x += 3) {
					const y =
						w.amplitude * Math.sin(w.frequency * (x + w.offset) + w.phase) +
						500;
					pathData += ` L ${x} ${y}`;
				}
				pathData += ' L 900 600 Z';

				w.el.setAttribute('d', pathData);
			});

			animId = requestAnimationFrame(animate);
		};

		animId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animId);
			paths.forEach((p) => p.el.remove());
		};
	}, []);

	return (
		<div
			className='paint-wrapper relative h-full'
			style={{
				background:
					'radial-gradient(1100px 700px at 85% -10%, rgba(239,68,68,0.22), transparent 55%)',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					height: 'calc(100%)',
				}}
			>
				<svg
					style={{
						width: '100%',
						height: '100%',
					}}
					id='visual'
					viewBox='0 0 900 600'
					preserveAspectRatio='none'
					xmlns='http://www.w3.org/2000/svg'
					version='1.1'
				></svg>
			</div>

			<div className='flex flex-1 flex-col h-full relative p-4 z-2'>
				<div className='upload-wrapper flex'>
					<div>
						<Upload
							listType='picture-circle'
							fileList={fileList}
							onChange={onSelectFile}
							beforeUpload={() => false}
							onPreview={onPreview}
							multiple={true}
							prefixCls='paint-images'
							showUploadList={{
								showRemoveIcon: true,
								showPreviewIcon: true,
								previewIcon: (
									<Tooltip title='Colorir'>
										<FormatPainterFilled style={{ color: '#ffffff' }} />
									</Tooltip>
								),

								removeIcon: (
									<Tooltip title='Excluir'>
										<DeleteOutlined style={{ color: '#ffffff' }} />
									</Tooltip>
								),
							}}
						>
							{fileList.length < config.uploadLimit && `Selecionar imagem`}
						</Upload>
					</div>
				</div>

				<div className='canvas-wrapper flex flex-1 flex-col justify-center items-center py-4'>
					<div>
						{selectedImage && (
							<Canvas imageSource={selectedImage} canvasRef={canvasRef} />
						)}
					</div>
				</div>

				<div className='flex flex-row flex-wrap gap-2 justify-center'>
					{selectedImage && <ColorPalette />}
					{selectedImage && <Actions canvasRef={canvasRef} />}
				</div>

				<div className='flex flex-1'></div>
				<div className='text-right mt-4'>
					<span className='text-xs text-white'>
						Para o Bernardo, com carinho ❤️
					</span>
				</div>
			</div>
		</div>
	);
};

export default Paint;
