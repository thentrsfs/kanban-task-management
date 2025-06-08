import { useDroppable } from '@dnd-kit/core';
const DroppableColumn = ({ column, children, tasksByColumn }) => {
	const { setNodeRef } = useDroppable({
		id: `column-${column.id}`,
	});

	return (
		<div
			ref={setNodeRef}
			className='flex flex-col min-w-[280px] pt-2'>
			<div className='flex items-center gap-[10px] mb-6'>
				<div
					className='w-4 h-4 rounded-full'
					style={{ backgroundColor: column.color }}></div>
				<h1 className='heading-s text-gray-medium uppercase'>
					{column.name} ({tasksByColumn[column.id]?.length})
				</h1>
			</div>
			<div className='flex flex-col gap-4 flex-1'>{children}</div>
		</div>
	);
};

export default DroppableColumn;
