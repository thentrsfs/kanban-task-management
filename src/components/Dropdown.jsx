import { useState, useRef, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const Dropdown = ({
	columns,
	selectedStatus,
	setSelectedStatus,
	selectedTask,
	setSelectedTask,
	fetchTasksByColumns,
	statusErrors,
	setStatusErrors,
	isGuest,
	activeBoard,
	setBoards,
	boards,
	setActiveBoard,
	saveGuestBoards,
}) => {
	const [open, setOpen] = useState(false);
	const ref = useRef();

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Handle status change in dropdown
	const handleStatusChange = async (column) => {
		// Creating a task (selectedTask is null)
		if (!selectedTask) {
			setSelectedStatus(column);
			setStatusErrors('');
			setOpen(false);
			return;
		}

		// Editing a task
		if (isGuest) {
			// Update task column_id locally
			const updatedBoards = boards.map((b) => {
				if (b.id !== activeBoard.id) return b;

				const updatedColumns = b.columns.map((col) => {
					// Remove task from old column
					if (col.id === selectedTask.column_id) {
						return {
							...col,
							tasks: (col.tasks || []).filter((t) => t.id !== selectedTask.id),
						};
					}
					// Add to new column
					if (col.id === column.id) {
						return {
							...col,
							tasks: [
								...(col.tasks || []),
								{ ...selectedTask, column_id: column.id },
							],
						};
					}
					return col;
				});

				return { ...b, columns: updatedColumns };
			});

			setBoards(updatedBoards);
			saveGuestBoards(updatedBoards);

			const updatedActive = updatedBoards.find((b) => b.id === activeBoard.id);
			setActiveBoard(updatedActive);

			setSelectedStatus(column);
			setOpen(false);
			setSelectedTask((prev) => ({ ...prev, column_id: column.id }));
			await fetchTasksByColumns();
		} else {
			// Supabase mode
			if (selectedTask.column_id !== column.id) {
				const { error } = await supabase
					.from('tasks')
					.update({ column_id: column.id })
					.eq('id', selectedTask.id);

				if (error) {
					console.log('Error updating status', error);
					return;
				}
				setSelectedStatus(column);
				setOpen(false);
				setSelectedTask((prev) => ({ ...prev, column_id: column.id }));
				await fetchTasksByColumns();
			} else {
				setSelectedStatus(column);
				setStatusErrors('');
				setOpen(false);
			}
		}
	};

	return (
		<div
			className='relative body-l cursor-pointer '
			ref={ref}>
			<button
				type='button'
				onClick={() => setOpen(!open)}
				className={`${
					statusErrors
						? 'border-red hover:border-red text-red'
						: 'border-gray-border hover:border-purple-main text-black dark:text-white'
				} w-full py-2 px-4 flex items-center justify-between bg-white dark:bg-gray-dark  transition-all duration-300 border-1 rounded-sm cursor-pointer capitalize`}>
				<span className=' '>{selectedStatus?.name || 'Select Status'}</span>
				<img
					src='/icon-chevron-down.svg'
					alt='chevron down icon'
					className='w-3'
				/>
			</button>

			{open && (
				<ul className='absolute top-12 w-full text-gray-medium rounded-lg bg-white dark:bg-gray-dark overflow-hidden'>
					{(isGuest ? activeBoard.columns : columns).map((column) => (
						<li
							key={column.id}
							onClick={() => handleStatusChange(column)}>
							<a
								href='#'
								className='block px-4 py-2 hover:bg-gray-light dark:hover:bg-lines-dark capitalize'>
								{column.name}
							</a>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Dropdown;
