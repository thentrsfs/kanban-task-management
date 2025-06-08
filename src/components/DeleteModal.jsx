import { useRef, useEffect } from 'react';
import Button from './Button';
const DeleteModal = ({ setIsDeleteModal, title, description, deleteBoard }) => {
	const deleteRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (deleteRef.current && !deleteRef.current.contains(event.target)) {
				setIsDeleteModal(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			<div className='absolute inset-0 bg-[#000000] opacity-50 '></div>
			<div
				ref={deleteRef}
				className='z-50 absolute bg-white dark:bg-gray-dark p-6 w-[90%] md:w-[65%] lg:w-[30%] rounded-md flex flex-col gap-6'>
				<p className='text-red heading-l'>{title}</p>
				<p className='body-l text-gray-medium'>{description}</p>
				<div className='flex max-md:flex-col gap-4 '>
					{' '}
					<Button
						variant='desctructive'
						className='py-2 px-4 flex-1'
						handleClick={deleteBoard}>
						{' '}
						Delete{' '}
					</Button>
					<Button
						variant='secondary'
						className='py-2 px-4 flex-1'
						handleClick={() => setIsDeleteModal(false)}>
						Cancel
					</Button>
				</div>
			</div>
		</div>
	);
};

export default DeleteModal;
