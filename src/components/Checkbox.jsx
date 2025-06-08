const Checkbox = ({ children, checked, onChange, className }) => {
	return (
		<div
			className={`${className} flex items-center gap-4 px-4 py-4 bg-gray-light dark:bg-black-light dark:text-white hover:bg-purple-25 transition-all duration-300 rounded-sm text-xs font-bold cursor-pointer`}>
			<input
				type='checkbox'
				checked={checked}
				onChange={onChange}
				className='w-4 h-4 accent-purple-main cursor-pointer '
			/>
			<span className={checked ? 'line-through text-gray-medium' : ''}>
				{children}
			</span>
		</div>
	);
};

export default Checkbox;
