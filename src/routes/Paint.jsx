import React, { useState, useContext, useRef, useEffect } from 'react';
import { Upload, theme } from 'antd';
import ColorPalette from '../components/ColorPalette';
import Canvas from '../components/Canvas';
import { MainContext } from '../providers/mainProvider';
import Actions from '../components/Actions';
import { DeleteOutlined, FormatPainterFilled } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import KUTE from 'kute.js';

const Paint = () => {
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

	useEffect(() => {
		// const tween = KUTE.to(
		// 	'#wave-2',
		// 	{ path: '#wave-3' },
		// 	{ duration: 5000, yoyo: true, repeat: Infinity, morphPrecision: 3 }
		// );
		// tween.start();
		// const tween2 = KUTE.fromTo(
		// 	'#wave-4',
		// 	{ path: '#wave-3' },
		// 	{ path: '#wave-5' },
		// 	{ duration: 3000, yoyo: true, repeat: Infinity, morphPrecision: 5 }
		// );
		// tween2.start();
	}, []);
	return (
		<div className='paint-wrapper relative h-full bg-[#ef4444]'>
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
					xmlnsXlink='http://www.w3.org/1999/xlink'
					version='1.1'
				>
					<rect x='0' y='0' width='100%' height='600' fill='#ef4444'></rect>
					<path
						id='wave-1'
						d='M0 491L11.5 479.3C23 467.7 46 444.3 69 442.3C92 440.3 115 459.7 138.2 464.2C161.3 468.7 184.7 458.3 207.8 460.7C231 463 254 478 277 475.8C300 473.7 323 454.3 346 444.7C369 435 392 435 415.2 443.2C438.3 451.3 461.7 467.7 484.8 477.5C508 487.3 531 490.7 554 479.3C577 468 600 442 623 429.7C646 417.3 669 418.7 692.2 430.2C715.3 441.7 738.7 463.3 761.8 473.3C785 483.3 808 481.7 831 471.3C854 461 877 442 888.5 432.5L900 423L900 601L888.5 601C877 601 854 601 831 601C808 601 785 601 761.8 601C738.7 601 715.3 601 692.2 601C669 601 646 601 623 601C600 601 577 601 554 601C531 601 508 601 484.8 601C461.7 601 438.3 601 415.2 601C392 601 369 601 346 601C323 601 300 601 277 601C254 601 231 601 207.8 601C184.7 601 161.3 601 138.2 601C115 601 92 601 69 601C46 601 23 601 11.5 601L0 601Z'
						fill='#fa7268'
					></path>
					<path
						id='wave-2'
						d='M0 526L11.5 518C23 510 46 494 69 492.7C92 491.3 115 504.7 138.2 513.5C161.3 522.3 184.7 526.7 207.8 516.2C231 505.7 254 480.3 277 474.3C300 468.3 323 481.7 346 494C369 506.3 392 517.7 415.2 509.7C438.3 501.7 461.7 474.3 484.8 469.7C508 465 531 483 554 488.7C577 494.3 600 487.7 623 488.2C646 488.7 669 496.3 692.2 498.3C715.3 500.3 738.7 496.7 761.8 487C785 477.3 808 461.7 831 465.5C854 469.3 877 492.7 888.5 504.3L900 516L900 601L888.5 601C877 601 854 601 831 601C808 601 785 601 761.8 601C738.7 601 715.3 601 692.2 601C669 601 646 601 623 601C600 601 577 601 554 601C531 601 508 601 484.8 601C461.7 601 438.3 601 415.2 601C392 601 369 601 346 601C323 601 300 601 277 601C254 601 231 601 207.8 601C184.7 601 161.3 601 138.2 601C115 601 92 601 69 601C46 601 23 601 11.5 601L0 601Z'
						fill='#dc4267'
					></path>
					<path
						id='wave-3'
						d='M0 540L11.5 535.8C23 531.7 46 523.3 69 514.5C92 505.7 115 496.3 138.2 492.8C161.3 489.3 184.7 491.7 207.8 499.8C231 508 254 522 277 519.3C300 516.7 323 497.3 346 494.8C369 492.3 392 506.7 415.2 516.2C438.3 525.7 461.7 530.3 484.8 529.7C508 529 531 523 554 513.8C577 504.7 600 492.3 623 487.5C646 482.7 669 485.3 692.2 493.3C715.3 501.3 738.7 514.7 761.8 512.7C785 510.7 808 493.3 831 489.5C854 485.7 877 495.3 888.5 500.2L900 505L900 601L888.5 601C877 601 854 601 831 601C808 601 785 601 761.8 601C738.7 601 715.3 601 692.2 601C669 601 646 601 623 601C600 601 577 601 554 601C531 601 508 601 484.8 601C461.7 601 438.3 601 415.2 601C392 601 369 601 346 601C323 601 300 601 277 601C254 601 231 601 207.8 601C184.7 601 161.3 601 138.2 601C115 601 92 601 69 601C46 601 23 601 11.5 601L0 601Z'
						fill='#c62368'
					></path>
					<path
						id='wave-4'
						d='M0 511L11.5 512.2C23 513.3 46 515.7 69 516.7C92 517.7 115 517.3 138.2 523.8C161.3 530.3 184.7 543.7 207.8 549.5C231 555.3 254 553.7 277 548.8C300 544 323 536 346 529C369 522 392 516 415.2 521C438.3 526 461.7 542 484.8 550.5C508 559 531 560 554 559.2C577 558.3 600 555.7 623 554.7C646 553.7 669 554.3 692.2 552.8C715.3 551.3 738.7 547.7 761.8 548.8C785 550 808 556 831 551.5C854 547 877 532 888.5 524.5L900 517L900 601L888.5 601C877 601 854 601 831 601C808 601 785 601 761.8 601C738.7 601 715.3 601 692.2 601C669 601 646 601 623 601C600 601 577 601 554 601C531 601 508 601 484.8 601C461.7 601 438.3 601 415.2 601C392 601 369 601 346 601C323 601 300 601 277 601C254 601 231 601 207.8 601C184.7 601 161.3 601 138.2 601C115 601 92 601 69 601C46 601 23 601 11.5 601L0 601Z'
						fill='#dc4267'
					></path>
					<path
						id='wave-5'
						d='M0 539L11.5 541.2C23 543.3 46 547.7 69 550.8C92 554 115 556 138.2 555.2C161.3 554.3 184.7 550.7 207.8 552.5C231 554.3 254 561.7 277 564.5C300 567.3 323 565.7 346 561C369 556.3 392 548.7 415.2 548.5C438.3 548.3 461.7 555.7 484.8 560.2C508 564.7 531 566.3 554 568.5C577 570.7 600 573.3 623 573C646 572.7 669 569.3 692.2 568.2C715.3 567 738.7 568 761.8 564.2C785 560.3 808 551.7 831 551.2C854 550.7 877 558.3 888.5 562.2L900 566L900 601L888.5 601C877 601 854 601 831 601C808 601 785 601 761.8 601C738.7 601 715.3 601 692.2 601C669 601 646 601 623 601C600 601 577 601 554 601C531 601 508 601 484.8 601C461.7 601 438.3 601 415.2 601C392 601 369 601 346 601C323 601 300 601 277 601C254 601 231 601 207.8 601C184.7 601 161.3 601 138.2 601C115 601 92 601 69 601C46 601 23 601 11.5 601L0 601Z'
						fill='#fa7268'
					></path>
				</svg>
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
