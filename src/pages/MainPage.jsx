import { motion, AnimatePresence } from 'motion/react';
import Empty from '../components/Empty';
import { useContext } from 'react';
import { DndContext, rectIntersection } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import BoardsDropdown from '../components/BoardsDropdown';
import DroppableColumn from '../components/dnd-components/DroppableColumn';
import SortableItem from '../components/dnd-components/SortableItem';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { DndropContext } from '../context/DndropContext';

const MainPage = ({
	columns,
	tasksByColumn,
	subtasksByTask,
	openTaskDetails,
	isTabletDropdownOpen,
	setIsTabletDropdownOpen,
	setColumnInputs,
	setBoardName,
	activeBoard,
	setActiveBoard,
	boards,
	setBoardModal,
	theme,
	setTheme,
	isDropdownOpen,
	setIsDropdownOpen,
	setOptionsOpen,
	handleEditBoard,
	logout,
	setColumns,
	fetchTasksByColumns,
	columnsLoading,
	boardsLoading,
}) => {
	/* Context */
	const { handleDragEnd, sensors } = useContext(DndropContext);

	return (
		<div
			className='relative w-full h-full flex overflow-scroll'
			onClick={() => setOptionsOpen(false)}>
			{isDropdownOpen && (
				<div
					onClick={() => {
						setIsDropdownOpen(false);
					}}
					className='fixed inset-0 bg-[#000000] opacity-50 md:hidden'></div>
			)}
			<Button
				variant='primaryL'
				className='fixed bottom-10 right-6 flex px-4 py-3'
				handleClick={() => logout()}>
				Logout
			</Button>
			<AnimatePresence>
				{isTabletDropdownOpen && (
					<motion.div
						initial={{ x: '-100%' }}
						animate={{ x: 0 }}
						exit={{ x: '-100%' }}
						transition={{ duration: 0.4 }}
						className='fixed top-0 left-0 h-full w-[260px] z-45 '>
						<BoardsDropdown
							boards={boards}
							setActiveBoard={setActiveBoard}
							activeBoard={activeBoard}
							setBoardModal={setBoardModal}
							setTheme={setTheme}
							theme={theme}
							isTabletDropdownOpen={isTabletDropdownOpen}
							setIsTabletDropdownOpen={setIsTabletDropdownOpen}
							setColumnInputs={setColumnInputs}
							setBoardName={setBoardName}
							setIsDropdownOpen={setIsDropdownOpen}
							setColumns={setColumns}
							fetchTasksByColumns={fetchTasksByColumns}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			{boards.length > 0 && (
				<button
					onClick={() => setIsTabletDropdownOpen(!isDropdownOpen)}
					className='fixed hidden md:flex justify-center items-center pr-1 bottom-10 bg-purple-main hover:bg-purple-hover w-[56px] h-[48px] rounded-r-3xl transition-all duration-300 cursor-pointer'>
					<img
						src='/icon-show-sidebar.svg'
						alt='show sidebar'
						className='w-5 cursor-pointer'
					/>
				</button>
			)}

			{columnsLoading || boardsLoading ? (
				<Loading
					theme={theme}
					className={isTabletDropdownOpen && 'ml-[260px]'}
				/>
			) : (
				<>
					{boards.length === 0 && (
						<Empty
							paragraph={
								'There are no boards. Create a new board to get started.'
							}
							buttonText={'+ Create New Board'}
							handleClick={() => setBoardModal(true)}
						/>
					)}

					{boards.length > 0 && columns.length === 0 && (
						<Empty
							paragraph={
								'This board is empty. Create a new column to get started.'
							}
							buttonText={'+ Add New Column'}
							isTabletDropdownOpen={isTabletDropdownOpen}
							handleClick={() => handleEditBoard(activeBoard, columns)}
						/>
					)}

					<div
						className={`${
							isTabletDropdownOpen ? 'ml-[260px] ' : ''
						} transition-all duration-400 `}>
						<DndContext
							sensors={sensors}
							collisionDetection={rectIntersection}
							onDragOver={handleDragEnd}
							autoScroll={true}>
							<div className='flex gap-6 px-5 pt-4 items-stretch h-full'>
								{columns.map((column) => (
									<DroppableColumn
										key={column.id}
										column={column}
										tasksByColumn={tasksByColumn}>
										<SortableContext
											items={(tasksByColumn[column.id] || []).map((task) =>
												String(task.id)
											)}
											strategy={verticalListSortingStrategy}>
											{(tasksByColumn[column.id] || []).map((task) => (
												<SortableItem
													key={`${column.id}-${task.id}`}
													id={String(task.id)}
													task={task}
													subtasksByTask={subtasksByTask}
													openTaskDetails={openTaskDetails}
												/>
											))}
										</SortableContext>
									</DroppableColumn>
								))}
								{columns.length > 0 && (
									<button
										onClick={() => handleEditBoard()}
										className='hidden md:flex cursor-pointer min-w-[280px] h-[93%] mt-12 rounded-lg  justify-center items-center heading-xl hover:text-purple-main transition-all duration-300 text-gray-medium bg-linear dark:bg-linear-dark'>
										+ New Column
									</button>
								)}
							</div>
						</DndContext>
					</div>
				</>
			)}
		</div>
	);
};

export default MainPage;
