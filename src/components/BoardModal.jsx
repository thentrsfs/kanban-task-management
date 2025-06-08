import TextField from './Textfield';
import Button from './Button';
import RemoveIcon from './svg/RemoveIcon';
import { useRef, useEffect } from 'react';

const BoardModal = ({
	setIsEdit,
	isEdit,
	setBoardModal,
	title,
	boardName,
	handleSubmit,
	columnInputs,
	handleColumnInputChange,
	removeColumn,
	setColumnInputs,
	buttonText,
	error,
	setError,
	columnErrors,
	handleBoardInputChange,
}) => {
	const inputRef = useRef();
	const lastInputRef = useRef();

	// Handle click outside
	const handleClickOutside = () => {
		setBoardModal(false);
		isEdit && setIsEdit(false);
		if (error) setError('');
	};

	// Focus on input field on mount
	useEffect(() => {
		inputRef.current.focus();
	}, []);

	// Focus on last input
	useEffect(() => {
		if (columnInputs.length === 0) return;
		lastInputRef.current.focus();
	}, [columnInputs.length]);
	return (
		<form
			onSubmit={handleSubmit}
			className='fixed inset-0 z-50 flex items-center justify-center'>
			<div
				className='absolute inset-0 bg-[#000000] opacity-50 '
				onClick={handleClickOutside}></div>

			<div className='z-10 bg-white dark:bg-black-light p-6 w-[90%] md:w-[65%] lg:w-[30%] rounded-md flex flex-col gap-4'>
				<p className='text-black dark:text-white heading-l'>{title}</p>
				<div className='flex relative flex-col gap-2'>
					<span className='text-gray-medium dark:text-white text-xs font-bold'>
						Board Name
					</span>
					<TextField
						ref={inputRef}
						placeholder='e.g. Web Design'
						name='board'
						className={` ${
							error ? 'border-red hover:border-red' : 'border-gray-border'
						} py-2 px-4 capitalize`}
						value={boardName}
						handleInputChange={handleBoardInputChange}
						error={error}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleSubmit();
							}
						}}
					/>
					{error && (
						<p className='text-red body-l absolute top-8.5 right-4'>{error}</p>
					)}
				</div>
				<div className='flex flex-col gap-2'>
					{columnInputs.length > 0 && (
						<div className='flex flex-col gap-2'>
							<span className='text-gray-medium dark:text-white text-xs font-bold'>
								Board Columns
							</span>
							{columnInputs.map((column, index) => (
								<div
									key={column.id}
									className='flex relative items-center gap-4 w-full'>
									<TextField
										ref={
											index === columnInputs.length - 1 ? lastInputRef : null
										}
										key={column.id}
										name='column'
										className={`${
											columnErrors[column.id]
												? 'border-red'
												: 'border-gray-border'
										} py-2 px-4 flex-1 capitalize`}
										value={column.name}
										handleInputChange={(e) =>
											handleColumnInputChange(column.id, e.target.value)
										}
									/>
									{columnErrors[column.id] && (
										<p className='text-red body-l absolute top-2.5 right-12'>
											{columnErrors[column.id]}
										</p>
									)}
									<button
										className='cursor-pointer hover:fill-red fill-gray-medium transition-all duration-300'
										onClick={() => removeColumn(column.id)}>
										<RemoveIcon />
									</button>
								</div>
							))}
						</div>
					)}
					<div className='flex flex-col gap-5 pt-2'>
						<Button
							type='button'
							variant={'secondary'}
							className='py-2 px-4'
							handleClick={() => {
								setColumnInputs((prev) => [
									...prev,
									{ id: Date.now(), name: '' },
								]);
							}}>
							+ Add New Column
						</Button>
						<Button
							variant='primaryS'
							className='py-2 px-4'
							type='submit'>
							{buttonText}
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
};

export default BoardModal;
