import {
	useState,
	useCallback,
	useEffect,
	useContext,
	createContext,
} from 'react';
import { MainContext } from './MainProvider';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../utils/supabaseClient';
export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
	/* Context */
	const { tasksByColumn, setTasksByColumn, columns } = useContext(MainContext);

	/* State */
	const [taskModal, setTaskModal] = useState(false);
	const [taskTitle, setTaskTitle] = useState('');
	const [taskDescription, setTaskDescription] = useState('');
	const [subtasks, setSubtasks] = useState([
		{ id: Date.now(), title: '', isCompleted: false },
	]);
	const [subtasksByTask, setSubtasksByTask] = useState({});
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [selectedTask, setSelectedTask] = useState(null);
	const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
	const [taskOptionsOpen, setTaskOptionsOpen] = useState(false);
	const [taskEditModal, setTaskEditModal] = useState(false);
	const [taskDeleteModal, setTaskDeleteModal] = useState(false);
	const [taskErrors, setTaskErrors] = useState('');
	const [subtaskErrors, setSubtaskErrors] = useState({});
	const [statusErrors, setStatusErrors] = useState('');
	const [descriptionErrors, setDescriptionErrors] = useState('');

	/* Open task details */
	const openTaskDetails = (task) => {
		setTaskDetailsOpen(true);
		setSelectedTask(task);
	};

	/* Handle task input change */
	const handleTaskInputChange = (e) => {
		setTaskTitle(e.target.value);
		setTaskErrors('');
	};

	/* Handle task description change */
	const handleTaskDescriptionChange = (e) => {
		setTaskDescription(e.target.value);
		setDescriptionErrors('');
	};

	/* Open edit task */
	const openEditTask = async (task) => {
		setSelectedTask(task);
		setTaskTitle(task.title);
		setTaskDescription(task.description || '');

		const { data: subtasksFromDB } = await supabase
			.from('subtasks')
			.select()
			.eq('task_id', task.id);

		setSubtasks(subtasksFromDB || []);
		setTaskEditModal(true);
		setTaskDetailsOpen(false);
		setTaskOptionsOpen(false);
	};

	/* Fetch tasks by columns */
	const fetchTasksByColumns = useCallback(
		async (cols = null) => {
			const colsToUse = cols || columns || [];

			const newTasks = {};
			for (const col of colsToUse) {
				const { data, error } = await supabase
					.from('tasks')
					.select()
					.eq('column_id', col.id)
					.order('position', { ascending: true });

				if (!error) newTasks[col.id] = data;
			}
			setTasksByColumn(newTasks);
		},
		[columns]
	);

	/* Create task and subtasks */
	const createTask = async (columnId) => {
		let hasErrors = false;

		// Validate task
		if (!taskTitle.trim()) {
			setTaskErrors("Can't be empty");
			hasErrors = true;
		}

		// Validate subtasks
		const subErrors = {};
		subtasks.forEach((subtask) => {
			if (!subtask.title.trim()) {
				subErrors[subtask.id] = "Can't be empty";
				hasErrors = true;
			}
		});
		setSubtaskErrors(subErrors);

		if (selectedStatus === null) {
			setStatusErrors('Select a status');
			hasErrors = true;
		}

		if (!taskDescription.trim()) {
			setDescriptionErrors("Can't be empty");
			hasErrors = true;
		}

		if (hasErrors) return;

		// Get the current max position in the column
		const { data: maxTask, error: maxTaskError } = await supabase
			.from('tasks')
			.select('position')
			.eq('column_id', columnId)
			.order('position', { ascending: false })
			.limit(1);

		if (maxTaskError) {
			console.log('Error fetching max task position:', maxTaskError);
			return;
		}

		const nextPosition = maxTask?.length ? maxTask[0].position + 1 : 0;

		// Insert the new task with calculated position
		const { data, error } = await supabase
			.from('tasks')
			.insert([
				{
					id: uuidv4(),
					title: taskTitle,
					column_id: columnId,
					description: taskDescription,
					position: nextPosition,
				},
			])
			.select();

		if (error) {
			console.log('Error inserting task', error);
			return;
		}
		const task = data[0];

		// Insert subtasks
		for (let sub of subtasks) {
			if (!sub.title.trim()) continue;

			const { error: subtaskError } = await supabase.from('subtasks').insert([
				{
					id: uuidv4(),
					title: sub.title,
					is_completed: false,
					task_id: task.id,
				},
			]);

			if (subtaskError) {
				console.log('Error inserting subtask', subtaskError);
				return;
			}
		}

		resetTaskStates();

		fetchTasksByColumns(); // Refresh UI
	};

	/* Update task and subtasks */
	const updateTask = async (columnId) => {
		let hasErrors = false;

		// Validate task
		if (!taskTitle.trim()) {
			setTaskErrors("Can't be empty");
			hasErrors = true;
		}

		// Validate subtasks
		const subErrors = {};
		subtasks.forEach((subtask) => {
			if (!subtask.title.trim()) {
				subErrors[subtask.id] = "Can't be empty";
				hasErrors = true;
			}
		});
		setSubtaskErrors(subErrors);

		if (selectedStatus === null) {
			setStatusErrors('Select a status');
			hasErrors = true;
		}

		if (!taskDescription.trim()) {
			setDescriptionErrors("Can't be empty");
			hasErrors = true;
		}

		if (hasErrors) return;

		// Update the task
		const { error: taskUpdateError } = await supabase
			.from('tasks')
			.update({
				title: taskTitle,
				description: taskDescription,
				column_id: columnId,
			})
			.eq('id', selectedTask.id);

		if (taskUpdateError) {
			console.error('Error updating task:', taskUpdateError);
			return;
		}

		// Fetch existing subtasks from DB for this task
		const { data: existingSubtasks, error: existingSubtasksError } =
			await supabase.from('subtasks').select().eq('task_id', selectedTask.id);

		if (existingSubtasksError) {
			console.error('Error fetching existing subtasks:', existingSubtasksError);
			return;
		}

		// Delete subtasks that were removed
		for (const subtask of existingSubtasks) {
			if (!subtasks.find((s) => s.id === subtask.id)) {
				await supabase.from('subtasks').delete().eq('id', subtask.id);
			}
		}

		// Insert new subtasks
		for (let sub of subtasks) {
			if (!sub.title.trim()) continue;

			const existingInDb = existingSubtasks.find((s) => s.id === sub.id);

			if (!existingInDb) {
				await supabase.from('subtasks').insert([
					{
						id: sub.id,
						title: sub.title,
						task_id: selectedTask.id,
						is_completed: false,
					},
				]);
			} else {
				const originalSubtask = existingSubtasks.find((s) => s.id === sub.id);

				if (originalSubtask && originalSubtask.title !== sub.title) {
					await supabase
						.from('subtasks')
						.update({ title: sub.title })
						.eq('id', sub.id);
				}
			}
		}

		resetTaskStates();

		fetchTasksByColumns(); // Refresh UI
	};

	/* Reset states on close modal */
	const resetTaskStates = () => {
		setTaskModal(false);
		setTaskEditModal(false);
		setTaskDetailsOpen(false);
		setTaskTitle('');
		setTaskErrors('');
		setSubtaskErrors({});
		setStatusErrors('');
		setTaskDescription('');
		setDescriptionErrors('');
		setSubtasks([{ id: Date.now(), title: '', isCompleted: false }]);
		setSelectedTask(null);
	};

	/* Remove task */
	const removeTask = async (task) => {
		await supabase.from('tasks').delete().eq('id', task.id);
		fetchTasksByColumns(); // Refresh UI
	};

	/* Handle subtask inputs typing */
	const handleSubtaskInputChange = (id, value) => {
		setSubtasks((prev) =>
			prev.map((sub) => (sub.id === id ? { ...sub, title: value } : sub))
		);

		if (value.trim()) {
			setSubtaskErrors((prev) => {
				const updated = { ...prev };
				delete updated[id];
				return updated;
			});
		}
	};

	/* Fetch subtasks */
	useEffect(() => {
		// Fetch subtasks
		const fetchSubtasks = async () => {
			const newMap = {};

			for (const colId in tasksByColumn) {
				for (const task of tasksByColumn[colId]) {
					const { data, error } = await supabase
						.from('subtasks')
						.select()
						.eq('task_id', task.id)
						.order('created_at', { ascending: true });

					if (!error) newMap[task.id] = data;
				}
			}
			setSubtasksByTask(newMap);
		};

		if (Object.keys(tasksByColumn).length > 0) {
			fetchSubtasks();
		}
	}, [tasksByColumn]);

	/* Remove subtask */
	const removeSubtask = async (subtaskId) => {
		setSubtasks((prev) => prev.filter((sub) => sub.id !== subtaskId));
	};

	/* Fetch tasks by columns */
	useEffect(() => {
		if (columns.length > 0) {
			fetchTasksByColumns(columns);
		}
	}, [columns, fetchTasksByColumns]);

	return (
		<TaskContext.Provider
			value={{
				taskModal,
				setTaskModal,
				taskTitle,
				setTaskTitle,
				taskDescription,
				setTaskDescription,
				subtasks,
				setSubtasks,
				setSubtasksByTask,
				createTask,
				subtasksByTask,
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
				descriptionErrors,
				handleTaskDescriptionChange,
			}}>
			{children}
		</TaskContext.Provider>
	);
};
