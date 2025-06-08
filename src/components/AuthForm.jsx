import Button from './Button';
import Textfield from './Textfield';
const AuthForm = ({
	setTheme,
	theme,
	handleAuth,
	authError,
	email,
	setEmail,
	password,
	setPassword,
	isSignUp,
	setIsSignUp,
	loginAsGuest,
}) => {
	return (
		<form
			onSubmit={handleAuth}
			className='flex items-center justify-center h-screen dark:bg-black-light bg-white'>
			<img
				src={theme === 'dark' ? '/logo-light.svg' : '/logo-dark.svg'}
				alt='light logo'
				className='absolute top-7 left-5 cursor-pointer'
			/>
			<div className='flex flex-col gap-5 w-[250px]'>
				<Textfield
					className={`${
						authError ? 'border-red hover:border-red' : 'border-gray-border'
					} px-4 py-1`}
					type='email'
					name='email'
					placeholder='Email'
					value={email}
					handleInputChange={(e) => setEmail(e.target.value)}
				/>
				<Textfield
					className={`${
						authError ? 'border-red hover:border-red' : 'border-gray-border'
					} px-4 py-1`}
					type='password'
					name='password'
					placeholder='Password'
					value={password}
					handleInputChange={(e) => setPassword(e.target.value)}
				/>
				<div className='flex gap-2 justify-between'>
					<Button
						type='submit'
						variant='primaryS'
						className='px-4 py-1'>
						{isSignUp ? 'Sign Up' : 'Log in'}
					</Button>
					<Button
						className='px-4 py-1'
						variant='secondary'
						type='button'
						handleClick={loginAsGuest}>
						Continue as Guest
					</Button>
				</div>
				<div className='flex flex-col text-center'>
					<button
						type='button'
						className='text-black dark:text-white hover:text-purple-main transition-all duration-300 cursor-pointer body-l'
						onClick={() => setIsSignUp((prev) => !prev)}>
						{isSignUp ? 'Have an account? Log in' : 'Need an account? Sign up'}
					</button>

					{authError && <p className='text-red body-l'>{authError}</p>}
				</div>
				<div className='bg-gray-light dark:bg-black-light px-14 py-2 rounded-md'>
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
			</div>
		</form>
	);
};

export default AuthForm;
