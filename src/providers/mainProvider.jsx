import React, { useState, useEffect, createContext } from 'react';

export const MainContext = createContext();

export const MainProvider = (props) => {
	const [selectedColor, setSelectedColor] = useState();
	const [modifications, setModification] = useState([]);
	const [cursor, setCursor] = useState(0);
	const [config, setConfig] = useState({
		uploadLimit: 30,
		maxWidth: 500,
	});

	const resetModifications = () => {
		setModification([]);
	};

	const addNewModification = (newModification) => {
		setModification((prevModifications) => [
			...prevModifications,
			newModification,
		]);
	};

	useEffect(() => {
		setCursor(cursor == undefined ? 0 : modifications.length - 1);
	}, [modifications]);

	return (
		<MainContext.Provider
			value={{
				cursor,
				config,
				modifications,
				selectedColor,

				setConfig,
				setCursor,
				addNewModification,
				resetModifications,
				setSelectedColor,
			}}
		>
			{props.children}
		</MainContext.Provider>
	);
};
