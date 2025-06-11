import Textfield from './Textfield';
import Button from './Button';
import Dropdown from './Dropdown';
import RemoveIcon from './svg/RemoveIcon';
import { useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
const TaskModal = ({
	title,
	handleSubmitTask,
	taskTitle,
	taskDescription,
	subtasks,
	handleSubtaskInputChange,
	removeSubtask,
	columns,
	selectedStatus,
	setSelectedStatus,
	selectedTask,
	setSubtasks,
	resetTaskStates,
	taskErrors,
	subtaskErrors,
	handleTaskInputChange,
	statusErrors,
	setStatusErrors,
	handleTaskDescriptionChange,
	descriptionErrors,
	isGuest,
	activeBoard,
	fetchTasksByColumns,
	setBoards,
	boards,
	setActiveBoard,
	saveGuestBoards,
	setSelectedTask,
}) => {
	const inputRef = useRef();
	const lastInputRef = useRef();

	// Focus on input field on mount
	useEffect(() => {
		inputRef.current.focus();
	}, []);

	// Focus on last input field on mount
	useEffect(() => {
		if (subtasks.length < 2) return;
		lastInputRef.current.focus();
	}, [subtasks.length]);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmitTask(selectedStatus?.id);
			}}
			className='fixed inset-0 z-60 flex flex-col items-center justify-center text-black'>
			<div
				className='absolute inset-0 bg-[#000000] opacity-50 '
				onClick={resetTaskStates}></div>

			<div className='z-50 bg-white dark:bg-gray-dark p-6 w-[90%] md:w-[65%] lg:w-[30%] rounded-md flex flex-col gap-4'>
				<p className='heading-l text-black dark:text-white'>{title}</p>
				<div className='flex flex-col gap-2 relative'>
					<span className='text-gray-medium dark:text-white text-xs font-bold'>
						Title
					</span>
					<Textfield
						ref={inputRef}
						name='task'
						placeholder='e.g. Take coffee break'
						className={`${
							taskErrors.length > 0
								? 'border-red hover:border-red'
								: 'border-gray-border'
						} py-2 px-4`}
						value={taskTitle}
						handleInputChange={handleTaskInputChange}
					/>
					{taskErrors && (
						<p className='text-red body-l absolute top-8.5 right-4'>
							{taskErrors}
						</p>
					)}
				</div>
				<div className='flex flex-col gap-2 relative'>
					<span className='text-gray-medium dark:text-white text-xs font-bold'>
						Description
					</span>
					<textarea
						name='description'
						id='taskDescription'
						placeholder='e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little.'
						className={`${
							descriptionErrors
								? 'border-red hover:border-red'
								: 'border-gray-border hover:border-purple-main'
						} py-2 px-4 body-l min-h-[112px] border-1  transition-all duration-300 rounded-sm body-l outline-0 placeholder:text-black-25 dark:placeholder:text-white dark:placeholder:opacity-25 dark:text-white`}
						value={taskDescription}
						onChange={handleTaskDescriptionChange}></textarea>
					{descriptionErrors && (
						<p className='text-red body-l absolute top-18 right-4'>
							{descriptionErrors}
						</p>
					)}
				</div>
				<div className='flex flex-col gap-2 '>
					<span className='text-gray-medium dark:text-white text-xs font-bold'>
						Subtasks
					</span>
					{subtasks.map((subtask, index) => (
						<div
							key={subtask.id}
							className='flex items-center gap-4 w-full relative'>
							<Textfield
								ref={index === subtasks.length - 1 ? lastInputRef : null}
								className={`${
									subtaskErrors[subtask.id]
										? 'border-red hover:border-red'
										: 'border-gray-border'
								} py-2 px-4 flex-1`}
								name='subtask'
								value={subtask.title}
								placeholder={'e.g. Make coffee'}
								handleInputChange={(e) =>
									handleSubtaskInputChange(subtask.id, e.target.value)
								}
							/>
							{subtaskErrors[subtask.id] && (
								<p className='text-red body-l absolute top-2.5 right-12'>
									{subtaskErrors[subtask.id]}
								</p>
							)}
							<button
								type='button'
								className='cursor-pointer fill-gray-medium hover:fill-red transition-all duration-300'
								onClick={() => removeSubtask(subtask.id)}>
								<RemoveIcon />
							</button>
						</div>
					))}
				</div>
				<Button
					type='button'
					variant='secondary'
					className='px-5 py-2'
					handleClick={() =>
						setSubtasks([
							...subtasks,
							{ id: uuidv4(), title: '', isCompleted: false },
						])
					}>
					+ Add New Subtask
				</Button>
				<div>
					<span className='text-gray-medium dark:text-white text-xs font-bold'>
						Status
					</span>
					<Dropdown
						columns={isGuest ? activeBoard?.columns : columns}
						selectedStatus={selectedStatus}
						setSelectedStatus={setSelectedStatus}
						statusErrors={statusErrors}
						setStatusErrors={setStatusErrors}
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
				<Button
					type='submit'
					variant='primaryL'
					className='px-5 py-2 body-l'>
					{selectedTask ? 'Save Changes' : 'Create Task'}
				</Button>
			</div>
		</form>
	);
};

export default TaskModal;
