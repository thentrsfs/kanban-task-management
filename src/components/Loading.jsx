const Loading = ({ theme, className }) => {
	return (
		<div
			data-theme={theme}
			className={`${className} bg-white dark:bg-black-light h-screen w-full flex items-center justify-center`}>
			<span className='loading loading-spinner loading-xl text-purple-main '></span>
		</div>
	);
};

export default Loading;
