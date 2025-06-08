import {
	useState,
	useEffect,
	createContext,
	useContext,
	useCallback,
} from 'react';
import { MainContext } from './MainProvider';
import { supabase } from '../utils/supabaseClient';

export const ColumnContext = createContext();

export const ColumnProvider = ({ children }) => {
	/* Context */
	const {
		activeBoard,
		columnColors,
		setColumnErrors,
		columnErrors,
		columns,
		setColumns,
	} = useContext(MainContext);

	/* State */
	const [columnInputs, setColumnInputs] = useState([]);
	const [selectedColumnId, setSelectedColumnId] = useState(null);
	const [columnsLoading, setColumnsLoading] = useState(false);

	/* Handle column inputs typing */
	const handleColumnInputChange = (id, value) => {
		setColumnInputs((prev) =>
			prev.map((col) => (col.id === id ? { ...col, name: value } : col))
		);
		// Set column error
		setColumnErrors((prev) => ({
			...prev,
			[id]: '',
		}));
	};

	/* Fetch columns */
	const fetchColumns = useCallback(async () => {
		setColumnsLoading(true);
		if (!activeBoard) {
			setColumnsLoading(false);
			return;
		}

		const { data, error } = await supabase
			.from('columns')
			.select()
			.eq('board_id', activeBoard.id);
		if (error) {
			console.error(error);
		} else {
			setColumns(data);
			setColumnsLoading(false);
		}
	}, [activeBoard]);

	/* Handle submit columns */
	const handleSubmitColumns = async (boardId) => {
		// Insert columns into Supabase
		for (let i = 0; i < columnInputs.length; i++) {
			const col = columnInputs[i];
			const color = columnColors[i % columnColors.length];
			const { error } = await supabase.from('columns').insert([
				{
					name: col.name,
					board_id: boardId,
					color: color,
				},
			]);
			if (error) console.error(error);
		}

		const { data, error } = await supabase
			.from('columns')
			.select()
			.eq('board_id', boardId);
		if (error) {
			console.error(error);
		} else {
			setColumns(data);
			setColumnInputs([]);
			await fetchColumns();
		}
	};

	/* Remove column locally from inputs */
	const removeColumn = async (columnId) => {
		setColumnInputs((prev) => prev.filter((col) => col.id !== columnId));
	};

	/* Fetch columns when active board changes */
	useEffect(() => {
		if (activeBoard) {
			fetchColumns();
		}
	}, [activeBoard]);

	return (
		<ColumnContext.Provider
			value={{
				columns,
				setColumns,
				columnInputs,
				setColumnInputs,
				handleColumnInputChange,
				handleSubmitColumns,
				removeColumn,
				selectedColumnId,
				setSelectedColumnId,
				setColumnErrors,
				columnErrors,
				columnsLoading,
			}}>
			{children}
		</ColumnContext.Provider>
	);
};
