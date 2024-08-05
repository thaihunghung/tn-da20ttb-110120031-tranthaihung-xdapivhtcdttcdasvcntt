import React, { useState } from 'react';
import { Button } from 'antd';

const initialItems = [
  { id: '1', content: 'rubric po10' },
  { id: '2', content: 'rubric po11' },
  { id: '3', content: 'rubric 3' },
];

const BeautifulDND = () => {
  const [items, setItems] = useState(initialItems);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedItemId = e.dataTransfer.getData('text/plain');
    const draggedItem = items.find(item => item.id === droppedItemId);
    const dropIndex = Number(e.target.dataset.index);

    if (draggedItem) {
      const newItems = [...items];
      const draggedIndex = items.findIndex(item => item.id === droppedItemId);

      // Remove the dragged item from its original position
      newItems.splice(draggedIndex, 1);
      // Insert the dragged item at the new position
      newItems.splice(dropIndex, 0, { ...draggedItem });

      // Update IDs of items affected by the move
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        id: (index + 1).toString(), // Update IDs to maintain uniqueness and order
      }));

      setItems(updatedItems);
    }
  };

  const handleButtonClick = () => {
    console.log(items);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* <h1 className="text-2xl mb-4">Custom Drag and Drop Example</h1> */}
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="p-4 bg-gray-200 border border-gray-300 cursor-grab"
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-index={index}
          >
            {item.content}
          </div>
        ))}
      </div>
      <Button color='danger' variant='light' onClick={handleButtonClick}>
        text
      </Button>
    </div>
  );
};

export default BeautifulDND;
