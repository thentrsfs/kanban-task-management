const Button = ({
	children,
	variant = 'primaryL',
	className,
	handleClick,
	type,
}) => {
	let variantClasses = '';

	if (variant === 'primaryL') {
		variantClasses = `bg-purple-main text-white rounded-3xl heading-m transition-all duration-300 hover:bg-purple-hover font-bold`;
	} else if (variant === 'primaryS') {
		variantClasses = `bg-purple-main text-white rounded-[20px] transition-all duration-300 body-l hover:bg-purple-hover font-bold`;
	} else if (variant === 'secondary') {
		variantClasses = `bg-purple-10 text-purple-main dark:bg-white dark:hover:bg-white font-bold rounded-[20px] transition-all duration-300 body-l hover:bg-purple-25`;
	} else if (variant === 'desctructive') {
		variantClasses = `bg-red text-white rounded-[20px] transition-all duration-300 body-l font-bold hover:bg-red-hover`;
	}

	return (
		<button
			type={type}
			className={`${variantClasses} ${className} cursor-pointer`}
			onClick={handleClick}>
			{children}
		</button>
	);
};

export default Button;
