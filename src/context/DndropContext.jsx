import { createContext, useContext } from 'react';
import { MainContext } from './MainProvider';
import {
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	TouchSensor,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { supabase } from '../utils/supabaseClient';

export const DndropContext = createContext();

export const DndropProvider = ({ children }) => {
	/* Context */
	const { tasksByColumn, setTasksByColumn } = useContext(MainContext);

	/* Sensors */
	const sensors = useSensors(
		useSensor(TouchSensor, {
			activationConstraint: { delay: 180 },
		}),
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	/* Handle drag and drop event */
	async function handleDragEnd(event) {
		const { active, over } = event;
		if (!over || !over.id) return;

		const activeId = String(active.id);
		const overId = String(over.id);

		// Find source column
		let sourceColumnId = null;
		for (const colId in tasksByColumn) {
			if (tasksByColumn[colId].some((task) => String(task.id) === activeId)) {
				sourceColumnId = colId;
				break;
			}
		}

		// Find target column
		let targetColumnId = null;
		if (overId.startsWith('column-')) {
			targetColumnId = overId.replace('column-', '');
		} else {
			for (const colId in tasksByColumn) {
				if (tasksByColumn[colId].some((task) => String(task.id) === overId)) {
					targetColumnId = colId;
					break;
				}
			}
		}

		if (!sourceColumnId || !targetColumnId) return;

		const sourceTasks = [...(tasksByColumn[sourceColumnId] || [])];
		const targetTasks = [...(tasksByColumn[targetColumnId] || [])];
		const taskToMove = sourceTasks.find((task) => String(task.id) === activeId);
		if (!taskToMove) return;

		const isSameColumn = sourceColumnId === targetColumnId;

		if (isSameColumn) {
			const oldIndex = sourceTasks.findIndex(
				(task) => String(task.id) === activeId
			);
			const newIndex = sourceTasks.findIndex(
				(task) => String(task.id) === overId
			);

			if (oldIndex === -1 || newIndex === -1) return;

			const reordered = arrayMove(sourceTasks, oldIndex, newIndex);
			setTasksByColumn((prev) => ({
				...prev,
				[sourceColumnId]: reordered,
			}));

			// Update task positions in DB
			const updates = reordered.map((task, index) => ({
				id: task.id,
				position: index + 1,
			}));
			const { error } = await supabase
				.from('tasks')
				.upsert(updates, { onConflict: 'id' });
			if (error) console.error('Error updating task positions:', error);
		} else {
			// Moving task between columns
			const newSourceTasks = sourceTasks.filter(
				(task) => String(task.id) !== activeId
			);

			const insertIndex = overId.startsWith('column-')
				? targetTasks.length
				: targetTasks.findIndex((task) => String(task.id) === overId);

			if (insertIndex === -1) return;

			const newTargetTasks = [...targetTasks];
			newTargetTasks.splice(insertIndex, 0, {
				...taskToMove,
				column_id: targetColumnId,
			});

			setTasksByColumn((prev) => ({
				...prev,
				[sourceColumnId]: newSourceTasks,
				[targetColumnId]: newTargetTasks,
			}));

			// Update task column and positions in DB
			const updates = newTargetTasks.map((task, index) => ({
				id: task.id,
				column_id: task.id === activeId ? targetColumnId : task.column_id,
				position: index + 1,
			}));

			const { error } = await supabase
				.from('tasks')
				.upsert(updates, { onConflict: 'id' });
			if (error)
				console.error('Error moving task and updating positions:', error);
		}
	}

	return (
		<DndropContext.Provider value={{ sensors, handleDragEnd }}>
			{children}
		</DndropContext.Provider>
	);
};
