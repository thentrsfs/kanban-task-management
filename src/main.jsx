import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AppProvider from './context/AppProvider.jsx';
import { StrictMode } from 'react';

// Remove the preloader before rendering React
const preloader = document.getElementById('preloader');
if (preloader) preloader.remove();

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AppProvider>
			<App />
		</AppProvider>
	</StrictMode>
);
