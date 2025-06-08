import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';
import { ColumnContext } from './ColumnProvider';
import { MainContext } from './MainProvider';
import { AuthContext } from './AuthContext';

export const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
	/* Context */
	const { handleSubmitColumns, setColumnInputs, columnInputs } =
		useContext(ColumnContext);
	const {
		activeBoard,
		setActiveBoard,
		columnColors,
		setColumnErrors,
		boards,
		setBoards,
		setColumns,
	} = useContext(MainContext);
	const { user } = useContext(AuthContext);

	/* State */
	const [boardName, setBoardName] = useState('');
	const [boardModal, setBoardModal] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [optionsOpen, setOptionsOpen] = useState(false);
	const [isDeleteModal, setIsDeleteModal] = useState(false);
	const [error, setError] = useState('');
	const [boardsLoading, setBoardsLoading] = useState(true);

	/* Fetch boards */
	const fetchBoards = async (boardIdToKeepActive = null) => {
		if (!user) return;

		setBoardsLoading(true);

		const { data, error } = await supabase
			.from('boards')
			.select()
			.eq('user_id', user.id);

		if (error) {
			console.log('Error fetching boards', error);
			setBoardsLoading(false);
			return;
		}

		setBoards(data);

		if (boardIdToKeepActive) {
			const found = data.find((b) => b.id === boardIdToKeepActive);
			if (found) {
				setActiveBoard(found);
				setBoardsLoading(false);
				return;
			}
		}

		if (data.length) setActiveBoard(data[0]);

		setBoardsLoading(false);
	};

	/* Create board */
	const createBoard = async (e) => {
		e.preventDefault();

		const columnErrors = {};

		// Validate column names
		columnInputs.forEach((column) => {
			if (!column.name.trim()) {
				columnErrors[column.id] = "Can't be empty";
			}
		});
		setColumnErrors(columnErrors);
		if (Object.keys(columnErrors).length > 0) return;

		// Validate board name
		if (!boardName.trim()) {
			setError("Can't be empty");
			return;
		} else {
			setError('');
		}

		// Check duplicate board name
		if (boards.find((b) => b.name.trim() === boardName.trim())) {
			setError('Board name already exists');
			return;
		}

		// Supabase logic only — create board
		const { data, error } = await supabase
			.from('boards')
			.insert([{ name: boardName, user_id: user.id }])
			.select();

		if (error) {
			console.error(error);
			return;
		}

		const newBoard = data[0];
		await handleSubmitColumns(newBoard.id);
		await fetchBoards(newBoard.id);

		// Reset form
		setBoardModal(false);
		setBoardName('');
		setColumnInputs([]);
		setColumnErrors({});
	};

	/* Delete board */
	const deleteBoard = async (boardId) => {
		// Delete associated columns
		const { error: colError } = await supabase
			.from('columns')
			.delete()
			.eq('board_id', boardId);
		if (colError) {
			console.error('Error deleting columns:', colError.message);
			return;
		}

		// Delete board
		const { error: boardError } = await supabase
			.from('boards')
			.delete()
			.eq('id', boardId);
		if (boardError) {
			console.error('Error deleting board:', boardError.message);
			return;
		}

		// Update boards state
		const updatedBoards = boards.filter((b) => b.id !== boardId);
		setBoards(updatedBoards);
		setOptionsOpen(false);

		// Update active board
		if (activeBoard?.id === boardId) {
			setActiveBoard(updatedBoards[0] || null);
		}

		// Reset state if no boards
		if (updatedBoards.length === 0) {
			setColumnInputs([]);
			setColumns([]);
			setBoardName('');
		}
	};

	/* Edit board */
	const editBoard = async (boardId) => {
		const columnErrors = {};
		const nameTracker = {};
		let hasDuplicate = false;

		// Validate board name
		if (!boardName.trim()) {
			setError("Can't be empty");
			return;
		} else {
			setError('');
		}

		// Check for duplicate board name (excluding current board)
		if (
			boardName.trim() !== activeBoard.name.trim() &&
			boards.find((b) => b.name.trim() === boardName.trim())
		) {
			setError('Board name already exists');
			return;
		}

		// Validate columns
		columnInputs.forEach((column) => {
			const trimmedName = column.name.trim().toLowerCase();

			if (!trimmedName) {
				columnErrors[column.id] = "Can't be empty";
			}

			if (nameTracker[trimmedName]) {
				columnErrors[column.id] = 'Column name already exists';
				hasDuplicate = true;
			} else {
				nameTracker[trimmedName] = true;
			}
		});
		setColumnErrors(columnErrors);
		if (Object.keys(columnErrors).length > 0) return;

		// Update board name
		const { error: boardError } = await supabase
			.from('boards')
			.update({ name: boardName })
			.eq('id', boardId)
			.select();
		if (boardError) {
			console.log('Error updating board', boardError);
			return;
		}

		// Fetch current columns from DB
		const { data: currentColumns, error: colError } = await supabase
			.from('columns')
			.select('id')
			.eq('board_id', boardId);
		if (colError) {
			console.log('Error fetching current columns:', colError.message);
			return;
		}

		const currentColumnsIds = currentColumns.map((col) => col.id);
		const inputIds = columnInputs.map((col) => col.id);

		// Update or insert columns
		for (let i = 0; i < columnInputs.length; i++) {
			if (!columnInputs[i].name.trim()) continue;

			const col = columnInputs[i];
			const color = columnColors[i % columnColors.length];

			if (currentColumnsIds.includes(col.id)) {
				const { error: updateError } = await supabase
					.from('columns')
					.update({ name: col.name, color })
					.eq('id', col.id);
				if (updateError) {
					console.log('Error updating column', updateError);
					return;
				}
			} else {
				const { error: insertError } = await supabase
					.from('columns')
					.insert([{ name: col.name, board_id: boardId, color }]);
				if (insertError) {
					console.log('Error inserting column', insertError);
					return;
				}
			}
		}

		// Delete removed columns
		const removedIds = currentColumnsIds.filter((id) => !inputIds.includes(id));
		if (removedIds.length > 0) {
			const { error: deleteError } = await supabase
				.from('columns')
				.delete()
				.in('id', removedIds);
			if (deleteError) {
				console.error('Error deleting columns:', deleteError.message);
				return;
			}
		}

		setIsEdit(false);
		setBoardName('');
		setColumnInputs([]);
		await fetchBoards(boardId);
	};

	/* Open delete board modal */
	const openDeleteModal = () => {
		setIsDeleteModal(true);
		setOptionsOpen(false);
	};

	/* Handle board inputs typing */
	const handleBoardInputChange = (e) => {
		setBoardName(e.target.value);
		setError('');
	};

	/* Handle edit board (populate inputs) */
	const handleEditBoard = async () => {
		if (!activeBoard) return;

		// Fetch columns from DB
		const { data, error } = await supabase
			.from('columns')
			.select()
			.eq('board_id', activeBoard.id);

		if (error) {
			console.error('Error fetching columns in edit mode', error);
			return;
		}

		setColumns(data);

		const initialInputs = data.map((col, i) => ({
			id: col.id,
			name: col.name,
			color: col.color || columnColors[i % columnColors.length],
		}));

		setColumnInputs(initialInputs);
		setBoardName(activeBoard.name);
		setIsEdit(true);
		setOptionsOpen(false);
	};

	/* Fetch boards on mount or user change */
	useEffect(() => {
		if (user) {
			fetchBoards();
		}
	}, [user]);

	return (
		<BoardContext.Provider
			value={{
				boards,
				setBoards,
				activeBoard,
				setActiveBoard,
				boardName,
				setBoardName,
				boardModal,
				setBoardModal,
				isEdit,
				setIsEdit,
				optionsOpen,
				setOptionsOpen,
				handleEditBoard,
				createBoard,
				deleteBoard,
				editBoard,
				isDeleteModal,
				setIsDeleteModal,
				openDeleteModal,
				error,
				setError,
				handleBoardInputChange,
				boardsLoading,
			}}>
			{children}
		</BoardContext.Provider>
	);
};
