const Textfield = ({
	placeholder,
	className,
	value,
	handleInputChange,
	ref,
	onKeyDown,
	name,
	type = 'text',
}) => {
	return (
		<input
			type={type}
			name={name}
			value={value}
			ref={ref}
			onChange={handleInputChange}
			placeholder={placeholder}
			onKeyDown={onKeyDown}
			required
			className={` ${className} border-1  hover:border-purple-main outline-0 transition-all duration-300 rounded-sm body-l placeholder:text-black-25 placeholder:normal-case dark:text-white dark:placeholder:text-white dark:placeholder:opacity-25 `}
		/>
	);
};

export default Textfield;
