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
		}),
	);

	/* Handle drag and drop event */
	async function handleDragEnd(event) {
		const previousState = structuredClone(tasksByColumn);

		try {
			const { active, over } = event;

			if (!over || !over.id) return;

			const activeId = String(active.id);
			const overId = String(over.id);

			if (activeId === overId) return;

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

			const taskToMove = sourceTasks.find(
				(task) => String(task.id) === activeId,
			);

			if (!taskToMove) return;

			const isSameColumn = sourceColumnId === targetColumnId;

			// SAME COLUMN
			if (isSameColumn) {
				const oldIndex = sourceTasks.findIndex(
					(task) => String(task.id) === activeId,
				);

				const newIndex = sourceTasks.findIndex(
					(task) => String(task.id) === overId,
				);

				if (oldIndex === -1 || newIndex === -1) return;

				const reordered = arrayMove(sourceTasks, oldIndex, newIndex);

				// Optimistic UI update
				setTasksByColumn((prev) => ({
					...prev,
					[sourceColumnId]: reordered,
				}));

				// Update DB
				for (let index = 0; index < reordered.length; index++) {
					const task = reordered[index];

					const { error } = await supabase
						.from('tasks')
						.update({
							position: index + 1,
						})
						.eq('id', task.id);

					if (error) throw error;
				}
			}

			// DIFFERENT COLUMN
			else {
				const newSourceTasks = sourceTasks.filter(
					(task) => String(task.id) !== activeId,
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

				// Optimistic UI update
				setTasksByColumn((prev) => ({
					...prev,
					[sourceColumnId]: newSourceTasks,
					[targetColumnId]: newTargetTasks,
				}));

				// Reindex source column
				for (let index = 0; index < newSourceTasks.length; index++) {
					const task = newSourceTasks[index];

					const { error } = await supabase
						.from('tasks')
						.update({
							position: index + 1,
						})
						.eq('id', task.id);

					if (error) throw error;
				}

				// Reindex target column + update moved task column
				for (let index = 0; index < newTargetTasks.length; index++) {
					const task = newTargetTasks[index];

					const { error } = await supabase
						.from('tasks')
						.update({
							column_id: task.column_id,
							position: index + 1,
						})
						.eq('id', task.id);

					if (error) throw error;
				}
			}
		} catch (error) {
			console.error('Drag and drop error:', error);

			// Rollback UI if DB update fails
			setTasksByColumn(previousState);
		}
	}

	return (
		<DndropContext.Provider value={{ sensors, handleDragEnd }}>
			{children}
		</DndropContext.Provider>
	);
};
