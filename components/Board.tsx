"use client";

import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

function Board() {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  // console.log("Board.tsx", board);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // Do nothing if the user drags card outside of the board
    if (!destination) return;

    // Handle dragging a column
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1); // Splice out of where I am removing it from
      entries.splice(destination.index, 0, removed); // Splice the removed item into the other column
      const rearrangedColumns = new Map(entries); // Create a new map of the rearranged columns

      setBoardState({
        ...board,
        columns: rearrangedColumns,
      });
    }

    // Changed the index's to the ID's from React Beautiful DND library
    // It rebuilds the columns with the correct arrays
    // Giving you the columns you need to modify

    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: finishColIndex[1].todos,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    // Do nothing if the source and finish is the same (Drag & drop in same place)
    if (!startCol || !finishCol) return;
    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // Dragging within the same column
      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoardState({ ...board, columns: newColumns });
    } else {
      // Dragging to a different column
      // Need to make the correct changes in start and finish column to reflect the interaction

      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });
      // TODO: Update the DB based on the order of todos, rather than only when they change status

      updateTodoInDB(todoMoved, finishCol.id);
      setBoardState({ ...board, columns: newColumns });
    }
    console.log(
      "HERE ",
      Array.from(board.columns.entries()).map(([id, column], index) => (
        <Column key={id} id={id} todos={column.todos} index={index} />
      ))
    );
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
