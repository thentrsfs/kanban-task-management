import Button from './Button';
const Empty = ({
	paragraph,
	handleClick,
	buttonText,
	isTabletDropdownOpen,
}) => {
	return (
		<div
			className={`${
				isTabletDropdownOpen && 'ml-[130px]'
			} fixed top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] w-[90%] md:w-[50%] flex flex-col items-center gap-4 z-10 transition-all duration-400`}>
			<p className='heading-l text-center text-gray-medium '>{paragraph}</p>
			<Button
				variant={'primaryL'}
				className='px-5 py-3'
				handleClick={handleClick}>
				{buttonText}
			</Button>
		</div>
	);
};

export default Empty;
