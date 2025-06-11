import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
const SortableItem = (props) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: String(props.id) });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}>
			<div
				className='bg-white touch-none dark:bg-gray-dark group w-[280px] min-h-[88px] rounded-lg shadow-md flex flex-col gap-2 justify-center px-4 cursor-pointer'
				onClick={() => {
					props.openTaskDetails(props.task);
				}}>
				<h1 className='heading-m text-black dark:text-white group-hover:text-purple-main transition-all duration-300'>
					{props.task.title}
				</h1>
				<p className='body-m text-gray-medium '>
					{
						props.subtasksByTask[props.task.id]?.filter((s) => s.is_completed)
							.length
					}{' '}
					of {props.subtasksByTask[props.task.id]?.length} subtasks
				</p>
			</div>
		</div>
	);
};

export default SortableItem;
