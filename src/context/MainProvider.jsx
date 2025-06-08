import { useState, createContext } from 'react';

export const MainContext = createContext();

export const MainProvider = ({ children }) => {
	/* State */
	const [boards, setBoards] = useState([]);
	const [columns, setColumns] = useState([]);
	const [activeBoard, setActiveBoard] = useState(null);
	const [columnErrors, setColumnErrors] = useState({});
	const [tasksByColumn, setTasksByColumn] = useState({});
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isTabletDropdownOpen, setIsTabletDropdownOpen] = useState(false);

	/* Column colors */
	const columnColors = [
		'#56cfe1',
		'#7209b7',
		'#80ed99',
		'#c1121f',
		'#fb8500',
		'#ffea00',
		'#0466c8',
		'#583101',
		'#ff0054',
		'#6c757d',
		'#000112',
	];

	return (
		<MainContext.Provider
			value={{
				activeBoard,
				setActiveBoard,
				columnColors,
				columnErrors,
				setColumnErrors,
				boards,
				setBoards,
				tasksByColumn,
				setTasksByColumn,
				columns,
				setColumns,
				isDropdownOpen,
				setIsDropdownOpen,
				isTabletDropdownOpen,
				setIsTabletDropdownOpen,
			}}>
			{children}
		</MainContext.Provider>
	);
};
