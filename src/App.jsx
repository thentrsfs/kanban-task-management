import { useState, useContext, useEffect } from 'react';
import Navbar from './components/Navbar';
import BoardModal from './components/BoardModal';
import TaskModal from './components/TaskModal';
import MainPage from './pages/MainPage';
import TaskDetails from './components/TaskDetails';
import DeleteModal from './components/DeleteModal';
import Loading from './components/Loading';
import { BoardContext } from './context/BoardContext';
import { ColumnContext } from './context/ColumnProvider';
import { MainContext } from './context/MainProvider';
import { TaskContext } from './context/TaskContext';
import { AuthContext } from './context/AuthContext';
import AuthForm from './components/AuthForm';

function App() {
	/* Mode */
	const [theme, setTheme] = useState('dark');

	/* Context */

	// Board context
	const {
		boards,
		setBoards,
		activeBoard,
		setActiveBoard,
		boardName,
		setBoardName,
		boardModal,
		setBoardModal,
		isEdit,
		setIsEdit,
		optionsOpen,
		setOptionsOpen,
		handleEditBoard,
		createBoard,
		deleteBoard,
		editBoard,
		isDeleteModal,
		setIsDeleteModal,
		openDeleteModal,
		error,
		setError,
		handleBoardInputChange,
		boardsLoading,
	} = useContext(BoardContext);

	// Column context
	const {
		columnInputs,
		setColumnInputs,
		handleColumnInputChange,
		removeColumn,
		selectedColumnId,
		setSelectedColumnId,
		columnErrors,
		columnsLoading,
	} = useContext(ColumnContext);

	// Task context
	const {
		taskModal,
		setTaskModal,
		taskTitle,
		setTaskTitle,
		taskDescription,
		setTaskDescription,
		subtasks,
		createTask,
		subtasksByTask,
		setSubtasks,
		handleSubtaskInputChange,
		removeSubtask,
		selectedStatus,
		setSelectedStatus,
		taskDetailsOpen,
		openTaskDetails,
		setTaskDetailsOpen,
		selectedTask,
		fetchTasksByColumns,
		setSelectedTask,
		setSubtasksByTask,
		taskOptionsOpen,
		setTaskOptionsOpen,
		taskEditModal,
		openEditTask,
		setTaskEditModal,
		updateTask,
		removeTask,
		setTaskDeleteModal,
		taskDeleteModal,
		resetTaskStates,
		taskErrors,
		subtaskErrors,
		handleTaskInputChange,
		statusErrors,
		setStatusErrors,
		handleTaskDescriptionChange,
		descriptionErrors,
	} = useContext(TaskContext);

	// Main context
	const {
		tasksByColumn,
		setTasksByColumn,
		columns,
		setColumns,
		isDropdownOpen,
		setIsDropdownOpen,
		isTabletDropdownOpen,
		setIsTabletDropdownOpen,
	} = useContext(MainContext);

	// Auth context
	const {
		user,
		isGuest,
		loading,
		loginAsGuest,
		email,
		setEmail,
		password,
		setPassword,
		isSignUp,
		setIsSignUp,
		authError,
		setAuthError,
		handleAuth,
		setLoading,
		setUser,
		logout,
	} = useContext(AuthContext);

	/* Theme handling */
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			setTheme(savedTheme);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('theme', theme);
	}, [theme]);

	if (loading) return <Loading theme={theme} />;
	else {
		if (!user && !isGuest)
			return (
				<div data-theme={theme}>
					<AuthForm
						loginAsGuest={loginAsGuest}
						theme={theme}
						setTheme={setTheme}
						isSignUp={isSignUp}
						setIsSignUp={setIsSignUp}
						email={email}
						setEmail={setEmail}
						password={password}
						setPassword={setPassword}
						authError={authError}
						setAuthError={setAuthError}
						handleAuth={handleAuth}
					/>
				</div>
			);
		else
			return (
				<div
					data-theme={theme}
					className='relative flex flex-col items-center h-screen bg-gray-light dark:bg-black-light'>
					<Navbar
						theme={theme}
						boards={boards}
						setBoards={setBoards}
						setTheme={setTheme}
						setBoardModal={() => setBoardModal(true)}
						activeBoard={activeBoard}
						setActiveBoard={setActiveBoard}
						deleteBoard={deleteBoard}
						setTaskModal={setTaskModal}
						optionsOpen={optionsOpen}
						setOptionsOpen={setOptionsOpen}
						handleEditBoard={() => handleEditBoard(activeBoard, columns)}
						setSelectedColumnId={setSelectedColumnId}
						columns={columns}
						isDropdownOpen={isDropdownOpen}
						setIsDropdownOpen={setIsDropdownOpen}
						openDeleteModal={openDeleteModal}
						setColumnInputs={setColumnInputs}
						setBoardName={setBoardName}
						isTabletDropdownOpen={isTabletDropdownOpen}
						setIsTabletDropdownOpen={setIsTabletDropdownOpen}
						setColumns={setColumns}
						fetchTasksByColumns={fetchTasksByColumns}
					/>
					{boardModal && (
						<BoardModal
							title={'Add New Board'}
							setBoardModal={setBoardModal}
							boardName={boardName}
							setBoardName={setBoardName}
							handleSubmit={createBoard}
							columnInputs={columnInputs}
							setColumnInputs={setColumnInputs}
							handleColumnInputChange={handleColumnInputChange}
							buttonText={'Create New Board'}
							removeColumn={removeColumn}
							error={error}
							setError={setError}
							columnErrors={columnErrors}
							handleBoardInputChange={handleBoardInputChange}
						/>
					)}

					{isEdit && (
						<BoardModal
							title={'Edit Board'}
							setBoardModal={setIsEdit}
							boardName={boardName}
							setBoardName={setBoardName}
							handleSubmit={(e) => {
								e.preventDefault();
								editBoard(activeBoard?.id);
							}}
							columnInputs={columnInputs}
							setColumnInputs={setColumnInputs}
							buttonText={'Save Changes'}
							isEdit={isEdit}
							handleColumnInputChange={handleColumnInputChange}
							setIsEdit={setIsEdit}
							error={error}
							setError={setError}
							removeColumn={removeColumn}
							columnErrors={columnErrors}
							handleBoardInputChange={handleBoardInputChange}
						/>
					)}

					{isDeleteModal && (
						<DeleteModal
							title={'Delete this board?'}
							description={`Are you sure you want to delete the ‘${activeBoard?.name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
							setIsDeleteModal={setIsDeleteModal}
							deleteBoard={() => {
								deleteBoard(activeBoard?.id);
								setIsDeleteModal(false);
							}}
						/>
					)}

					{taskDeleteModal && (
						<DeleteModal
							title={'Delete this task?'}
							description={`Are you sure you want to delete the '${selectedTask?.title}' task and its subtasks? This action cannot be reversed.`}
							setIsDeleteModal={setTaskDeleteModal}
							deleteBoard={() => {
								removeTask(selectedTask);
								setTaskDeleteModal(false);
								setTaskDetailsOpen(false);
							}}
							taskDetailsOpen={taskDetailsOpen}
						/>
					)}

					<MainPage
						columns={columns}
						tasksByColumn={tasksByColumn}
						subtasksByTask={subtasksByTask}
						openTaskDetails={openTaskDetails}
						setTasksByColumn={setTasksByColumn}
						isTabletDropdownOpen={isTabletDropdownOpen}
						boards={boards}
						setActiveBoard={setActiveBoard}
						activeBoard={activeBoard}
						setBoardModal={setBoardModal}
						setTheme={setTheme}
						theme={theme}
						setIsDropdownOpen={setIsDropdownOpen}
						isDropdownOpen={isDropdownOpen}
						setIsTabletDropdownOpen={setIsTabletDropdownOpen}
						setColumnInputs={setColumnInputs}
						setBoardName={setBoardName}
						setOptionsOpen={setOptionsOpen}
						handleEditBoard={handleEditBoard}
						setColumns={setColumns}
						fetchTasksByColumns={fetchTasksByColumns}
						setBoards={setBoards}
						setLoading={setLoading}
						setUser={setUser}
						logout={logout}
						columnsLoading={columnsLoading}
						boardsLoading={boardsLoading}
					/>
					{taskModal ? (
						<TaskModal
							title={'Add New Task'}
							taskTitle={taskTitle}
							setTaskTitle={setTaskTitle}
							taskDescription={taskDescription}
							setTaskDescription={setTaskDescription}
							subtasks={subtasks}
							setSubtasks={setSubtasks}
							handleSubtaskInputChange={handleSubtaskInputChange}
							removeSubtask={removeSubtask}
							columns={columns}
							selectedStatus={selectedStatus}
							setSelectedStatus={setSelectedStatus}
							selectedTask={selectedTask}
							columnId={selectedColumnId}
							setTaskModal={setTaskModal}
							setTaskEditModal={setTaskEditModal}
							setTaskDetailsOpen={setTaskDetailsOpen}
							handleSubmitTask={(colId) => createTask(colId)}
							resetTaskStates={resetTaskStates}
							taskErrors={taskErrors}
							subtaskErrors={subtaskErrors}
							handleTaskInputChange={handleTaskInputChange}
							statusErrors={statusErrors}
							setStatusErrors={setStatusErrors}
							descriptionErrors={descriptionErrors}
							handleTaskDescriptionChange={handleTaskDescriptionChange}
							activeBoard={activeBoard}
							fetchTasksByColumns={fetchTasksByColumns}
							setBoards={setBoards}
							boards={boards}
							setActiveBoard={setActiveBoard}
							setSelectedTask={setSelectedTask}
						/>
					) : (
						taskEditModal &&
						selectedTask && (
							<TaskModal
								title={'Edit Task'}
								taskTitle={taskTitle}
								setTaskTitle={setTaskTitle}
								taskDescription={taskDescription}
								setTaskDescription={setTaskDescription}
								subtasks={subtasks}
								setSubtasks={setSubtasks}
								handleSubtaskInputChange={handleSubtaskInputChange}
								removeSubtask={removeSubtask}
								columns={columns}
								selectedStatus={selectedStatus}
								setSelectedStatus={setSelectedStatus}
								selectedTask={selectedTask}
								columnId={selectedColumnId}
								setTaskModal={setTaskModal}
								setTaskEditModal={setTaskEditModal}
								setTaskDetailsOpen={setTaskDetailsOpen}
								handleSubmitTask={(colId) => selectedTask && updateTask(colId)}
								resetTaskStates={resetTaskStates}
								taskErrors={taskErrors}
								subtaskErrors={subtaskErrors}
								handleTaskInputChange={handleTaskInputChange}
								statusErrors={statusErrors}
								setStatusErrors={setStatusErrors}
								descriptionErrors={descriptionErrors}
								handleTaskDescriptionChange={handleTaskDescriptionChange}
							/>
						)
					)}

					{taskDetailsOpen && (
						<TaskDetails
							setTaskDetailsOpen={setTaskDetailsOpen}
							selectedTask={selectedTask}
							subtasksByTask={subtasksByTask}
							columns={columns}
							selectedStatus={selectedStatus}
							setSelectedStatus={setSelectedStatus}
							fetchTasksByColumns={fetchTasksByColumns}
							setSelectedTask={setSelectedTask}
							setSubtasksByTask={setSubtasksByTask}
							taskOptionsOpen={taskOptionsOpen}
							setTaskOptionsOpen={setTaskOptionsOpen}
							openEditTask={openEditTask}
							setTaskDeleteModal={setTaskDeleteModal}
							activeBoard={activeBoard}
							setBoards={setBoards}
							boards={boards}
							setActiveBoard={setActiveBoard}
						/>
					)}
				</div>
			);
	}
}

export default App;
