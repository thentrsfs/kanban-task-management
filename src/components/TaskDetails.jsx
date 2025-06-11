import Checkbox from './Checkbox';
import { useEffect, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import Dropdown from './Dropdown';
const TaskDetails = ({
	setTaskDetailsOpen,
	selectedTask,
	setSelectedTask,
	subtasksByTask,
	setSubtasksByTask,
	columns,
	selectedStatus,
	setSelectedStatus,
	fetchTasksByColumns,
	taskOptionsOpen,
	setTaskOptionsOpen,
	openEditTask,
	setTaskDeleteModal,
	isGuest,
	activeBoard,
	setBoards,
	boards,
	setActiveBoard,
	saveGuestBoards,
}) => {
	const optionsRef = useRef();

	// Handle subtask toggle completion
	const handleSubtaskToggle = async (subtask) => {
		setSubtasksByTask((prev) => ({
			...prev,
			[subtask.task_id]: prev[subtask.task_id].map((s) =>
				s.id === subtask.id ? { ...s, is_completed: !s.is_completed } : s
			),
		}));

		const { error } = await supabase
			.from('subtasks')
			.update({ is_completed: !subtask.is_completed })
			.eq('id', subtask.id);
		if (error) {
			console.log('Error updating subtask', error);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (optionsRef.current && !optionsRef.current.contains(event.target)) {
				setTaskOptionsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [setTaskOptionsOpen]);

	useEffect(() => {
		if (selectedTask && columns.length > 0) {
			const status = columns.find((c) => c.id === selectedTask.column_id);
			setSelectedStatus(status);
		}
	}, [selectedTask, columns, setSelectedStatus]);
	return (
		<div className='fixed inset-0 flex justify-center items-center z-11'>
			<div
				className='absolute inset-0 bg-[#000000] opacity-50 '
				onClick={() => setTaskDetailsOpen(false)}
			/>

			<div className=' bg-white dark:bg-gray-dark w-[90%] md:w-[65%] lg:w-[30%] z-11 rounded-md p-5 flex flex-col gap-4'>
				<div className='flex relative justify-between items-center'>
					<h1 className='heading-l text-black dark:text-white flex-1 pr-5 break-all'>
						{selectedTask?.title}
					</h1>
					<button
						className='cursor-pointer w-4 flex items-center justify-center'
						onClick={() => setTaskOptionsOpen(!taskOptionsOpen)}>
						<img
							src='/icon-vertical-ellipsis.svg'
							alt='icon vertical ellipsis'
							className='w-1'
						/>
					</button>

					{taskOptionsOpen && (
						<div
							ref={optionsRef}
							className='absolute top-6 right-0 flex flex-col body-l items-start gap-3 p-4 bg-white dark:bg-gray-dark border-gray-border rounded-lg border-1 z-40 w-30'>
							<button
								className='text-gray-medium cursor-pointer hover:text-black dark:hover:text-white transition-all duration-300'
								onClick={() => openEditTask(selectedTask)}>
								Edit Task
							</button>
							<button
								className='text-red cursor-pointer hover:text-[hsl(0,78%,53%)] transition-all duration-300'
								onClick={() => {
									setTaskDeleteModal(true);
									setTaskDetailsOpen(false);
								}}>
								Delete Task
							</button>
						</div>
					)}
				</div>
				<p className='body-l text-gray-medium pr-5 break-all'>
					{' '}
					{selectedTask?.description}
				</p>
				<div className='flex flex-col gap-2 overflow-y-auto'>
					<span className='text-xs font-bold text-gray-medium dark:text-white'>
						Subtasks (
						{
							subtasksByTask[selectedTask?.id]?.filter((s) => s.is_completed)
								.length
						}{' '}
						of {subtasksByTask[selectedTask?.id]?.length})
					</span>

					{subtasksByTask[selectedTask?.id]?.map((subtask) => (
						<div key={subtask.id}>
							<Checkbox
								checked={subtask.is_completed}
								onChange={() => handleSubtaskToggle(subtask)}>
								{subtask.title}
							</Checkbox>
						</div>
					))}
				</div>
				<div className='flex flex-col gap-2'>
					<span className='text-gray-medium text-xs font-bold'>
						Current Status
					</span>
					<Dropdown
						selectedStatus={selectedStatus}
						setSelectedStatus={setSelectedStatus}
						columns={isGuest ? activeBoard?.columns : columns}
						selectedTask={selectedTask}
						fetchTasksByColumns={fetchTasksByColumns}
						setSelectedTask={setSelectedTask}
						isGuest={isGuest}
						activeBoard={activeBoard}
						setBoards={setBoards}
						boards={boards}
						setActiveBoard={setActiveBoard}
						saveGuestBoards={saveGuestBoards}
					/>
				</div>
			</div>
		</div>
	);
};

export default TaskDetails;
