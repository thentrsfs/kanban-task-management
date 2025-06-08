import { BoardProvider } from './BoardContext';
import { ColumnProvider } from './ColumnProvider';
import { TaskProvider } from './TaskContext';
import { MainProvider } from './MainProvider';
import { AuthProvider } from './AuthContext';
import { DndropProvider } from './DndropContext';

const AppProvider = ({ children }) => {
	return (
		<MainProvider>
			<AuthProvider>
				<ColumnProvider>
					<BoardProvider>
						<TaskProvider>
							<DndropProvider>{children}</DndropProvider>
						</TaskProvider>
					</BoardProvider>
				</ColumnProvider>
			</AuthProvider>
		</MainProvider>
	);
};

export default AppProvider;
