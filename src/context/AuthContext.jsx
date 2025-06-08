import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';
import { MainContext } from './MainProvider';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	/* Context */
	const {
		setColumns,
		setBoards,
		setTasksByColumn,
		setIsTabletDropdownOpen,
		setIsDropdownOpen,
	} = useContext(MainContext);

	/* State */
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const [authError, setAuthError] = useState('');
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	/* Handle authentication */
	const handleAuth = async (e) => {
		e.preventDefault();
		setLoading(true);

		const { error } = isSignUp
			? await supabase.auth.signUp({ email, password })
			: await supabase.auth.signInWithPassword({ email, password });

		if (error) setAuthError(error.message);
		else setAuthError('');

		setLoading(false);
	};

	/* Handle login as guest */
	const loginAsGuest = async () => {
		setLoading(true);
		try {
			const { data, error } = await supabase.auth.signInAnonymously();
			if (error) throw error;
			console.log('Anonymous user:', data.user);
			setLoading(false);
			return data.user;
		} catch (error) {
			console.error('Error signing in anonymously:', error);
			setLoading(false);
		}
	};

	/* Handle logout */
	const logout = async () => {
		setLoading(true);
		setUser(null);
		setColumns([]);
		setBoards([]);
		setTasksByColumn({});
		setIsTabletDropdownOpen(false);
		setIsDropdownOpen(false);

		await supabase.auth.signOut();
		setLoading(false);
	};

	/* Check if user is logged in on load */
	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session?.user) {
				setUser(session.user);
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (session?.user) {
				setUser(session.user);
			} else {
				setUser(null);
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				logout,
				loading,
				email,
				setEmail,
				password,
				setPassword,
				isSignUp,
				setIsSignUp,
				authError,
				setAuthError,
				handleAuth,
				loginAsGuest,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
