"use client";

import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function Board() {
  const [board, getBoard] = useBoardStore((state) => [
    state.board,
    state.getBoard,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  console.log("Board.tsx", board);
  return (
    <h1>Hey</h1>
    //   <DragDropContext>
    //     <Droppable droppableId="board" direction="horizontal" type="column">
    //       {(provided) => <div>{/* Rendering all the columns */}</div>}
    //     </Droppable>
    //   </DragDropContext>;
  );
}

export default Board;
