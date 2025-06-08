import BoardIcon from './svg/BoardIcon';
import HideSidebar from '../components/svg/HideSidebar';
import { supabase } from '../utils/supabaseClient';

const BoardsDropdown = ({
	boards,
	setActiveBoard,
	activeBoard,
	setBoardModal,
	setTheme,
	theme,
	setIsDropdownOpen,
	setColumnInputs,
	setBoardName,
	setIsTabletDropdownOpen,
	fetchTasksByColumns,
	setColumns,
}) => {
	/* Handle board select */
	const handleBoardSelect = async (board) => {
		setIsDropdownOpen(false);
		setActiveBoard(board);

		// Fetch columns from Supabase
		const { data, error } = await supabase
			.from('columns')
			.select()
			.eq('board_id', board.id);

		if (!error) {
			setColumns(data);
			// Fetch tasks once columns are set
			await fetchTasksByColumns(data);
		}
	};

	return (
		<div className='absolute md:relative md:left-0 w-[70%] md:w-[260px] m md:translate-0 md:h-screen left-[50%] translate-x-[-50%] top-20 bg-white text-gray-medium z-60 dark:bg-gray-dark md:rounded-none md:border-r md:border-lines-light rounded-lg dark:border-lines-dark '>
			<span className='block px-6 py-4 heading-s '>
				ALL BOARDS ({boards.length})
			</span>
			<ul className='heading-m '>
				{boards.map((board, index) => (
					<li
						key={board.id + index}
						className={`flex items-center gap-3 px-6 py-4 capitalize rounded-r-3xl mr-5 cursor-pointer fill-gray-medium transition-all duration-300 ${
							activeBoard.name === board.name
								? 'bg-purple-main text-white fill-white'
								: 'hover:bg-purple-10 hover:text-purple-main hover:fill-purple-main dark:hover:bg-white'
						}`}
						onClick={() => handleBoardSelect(board)}>
						<BoardIcon />
						<a href='#'>{board.name}</a>
					</li>
				))}
			</ul>
			<button
				className='px-6 py-4 text-purple-main flex items-center gap-3 heading-m cursor-pointer hover:text-purple-hover dark:hover:text-purple-hover transition-all duration-300'
				onClick={() => {
					setBoardModal(true);
					setIsDropdownOpen(false);
					setIsTabletDropdownOpen(false);
					setBoardName('');
					setColumnInputs([]);
				}}>
				<BoardIcon fill={'#635FC7'} />
				<span>+ Create New Board</span>
			</button>
			<div className='bg-gray-light dark:bg-black-light md:w-[85%] md:absolute md:bottom-40 md:left-1/2 md:translate-x-[-50%] md:mx-0 mx-5 px-14 py-4 mb-5 rounded-md'>
				<div className='flex items-center justify-center gap-2'>
					<img
						src='/icon-light-theme.svg'
						alt='light mode'
					/>
					<input
						type='checkbox'
						checked={theme === 'dark'}
						onChange={() =>
							setTheme((theme) => (theme === 'light' ? 'dark' : 'light'))
						}
						id='mode-toggle'
						name='mode-toggle'
						value='mode-toggle'
						className='toggle border-purple-main bg-purple-main text-white  checked:bg-purple-main checked:border-purple-main hover:border-purple-hover hover:bg-purple-hover transition-all duration-300'
					/>
					<img
						src='/icon-dark-theme.svg'
						alt='dark mode'
					/>
				</div>
			</div>
			<div
				className='absolute bottom-29 w-full right-0 mr-5 pl-12 py-4 text-gray-medium hover:text-purple-main fill-gray-medium hover:fill-purple-main hover:bg-purple-10 dark:hover:bg-white rounded-r-3xl cursor-pointer transition-all duration-300'
				onClick={() => setIsTabletDropdownOpen(false)}>
				<button className='hidden md:flex items-center gap-2 cursor-pointer '>
					<HideSidebar />
					<span className=' heading-m'>Hide Sidebar</span>
				</button>
			</div>
		</div>
	);
};

export default BoardsDropdown;
