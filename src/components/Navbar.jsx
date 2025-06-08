import BoardsDropdown from './BoardsDropdown';
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = ({
	theme,
	boards,
	setTheme,
	setBoardModal,
	activeBoard,
	setActiveBoard,
	setTaskModal,
	optionsOpen,
	setOptionsOpen,
	handleEditBoard,
	setSelectedColumnId,
	columns,
	isGuest,
	isDropdownOpen,
	setIsDropdownOpen,
	openDeleteModal,
	setColumnInputs,
	setBoardName,
	isTabletDropdownOpen,
	fetchTasksByColumns,
	setColumns,
}) => {
	// Media Query
	const isMobile = window.innerWidth < 768;
	const ref = useRef();

	const displayColumns = isGuest ? activeBoard?.columns || [] : columns || [];

	// Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (isMobile) return;
			if (ref.current && !ref.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div
			className='w-full flex z-10'
			onClick={() => optionsOpen && setOptionsOpen(false)}>
			<div
				className={`hidden md:flex w-[260px] px-5 bg-white dark:bg-gray-dark  h-[81px] items-center ${
					!isTabletDropdownOpen
						? ' border-b-lines-light dark:border-b-lines-dark'
						: 'border-b-transparent'
				} border-r border-b border-lines-light dark:border-lines-dark `}>
				<img
					src={theme === 'dark' ? '/logo-light.svg' : '/logo-dark.svg'}
					alt='logo'
				/>
			</div>
			<div className='flex items-center w-full md:flex-1 md:h-[81px] h-[64px] z-10 bg-white dark:bg-gray-dark border-b border-lines-light dark:border-lines-dark'>
				<div className='flex items-center justify-between gap-4 w-full pl-5 pr-3 '>
					<div className='flex items-center gap-5'>
						<img
							src='/logo-mobile.svg'
							alt='logo mobile'
							className='md:hidden'
						/>

						{boards.length > 0 && (
							<button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className='flex items-center gap-2 transition-all duration-300 rounded-sm'>
								<span className='heading-l capitalize'>
									{activeBoard?.name}
								</span>
								<img
									src={`/icon-chevron-${isDropdownOpen ? 'up' : 'down'}.svg`}
									alt='chevron down icon'
									className='w-3 pt-1 md:hidden'
								/>
							</button>
						)}
						<AnimatePresence>
							{isDropdownOpen && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className='md:hidden'
									ref={ref}>
									<BoardsDropdown
										boards={boards}
										setActiveBoard={setActiveBoard}
										activeBoard={activeBoard}
										setBoardModal={setBoardModal}
										setTheme={setTheme}
										theme={theme}
										isDropdownOpen={isDropdownOpen}
										setIsDropdownOpen={setIsDropdownOpen}
										setColumnInputs={setColumnInputs}
										setBoardName={setBoardName}
										isGuest={isGuest}
										fetchTasksByColumns={fetchTasksByColumns}
										setColumns={setColumns}
									/>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
					<div className='relative flex items-center gap-3'>
						<button
							className={`w-[48px] h-[32px] ${
								displayColumns.length === 0
									? 'bg-purple-hover dark:bg-purple-main dark:opacity-25'
									: 'bg-purple-main'
							}  rounded-3xl flex items-center justify-center md:hidden `}
							onClick={() => {
								if (displayColumns.length === 0) return;
								setSelectedColumnId(displayColumns[0]?.id);
								setTaskModal(true);
							}}>
							<img
								src={'/icon-add-task-mobile.svg'}
								alt='icon add task'
							/>
						</button>

						<button
							className={`${
								displayColumns.length === 0
									? 'bg-purple-hover dark:bg-purple-main dark:opacity-25 '
									: 'bg-purple-main hover:bg-purple-hover'
							} py-3 px-5 hidden md:block cursor-pointer text-white rounded-3xl heading-m transition-all duration-300 font-bold`}
							onClick={() => {
								if (displayColumns.length === 0) return;
								setSelectedColumnId(displayColumns[0]?.id);
								setTaskModal(true);
							}}>
							+ Add New Task
						</button>
						<button
							className='cursor-pointer w-4 flex items-center justify-center'
							onClick={() => {
								boards.length > 0 && setOptionsOpen(!optionsOpen);
							}}>
							<img
								src='/icon-vertical-ellipsis.svg'
								alt='icon vertical ellipsis'
								className='w-1'
							/>
						</button>
						{optionsOpen && (
							<div className='absolute top-10 right-0 flex flex-col body-l items-start gap-3 p-4 bg-white dark:bg-black-light border-gray-border rounded-lg border-1 z-50 w-30'>
								<button
									className='text-gray-medium cursor-pointer'
									onClick={handleEditBoard}>
									Edit Board
								</button>
								<button
									className='text-red cursor-pointer'
									onClick={() => {
										openDeleteModal();
									}}>
									Delete Board
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
