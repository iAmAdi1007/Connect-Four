import { useReducer } from "react";
import "./ConnectFour.css";

const NUM_COLS = 7;
const NUM_ROWS = 6;

const ConnectFour = () => {
  const [{ board, winner, isOver }, dispatch] = useReducer(
    reducer,
    generateEmptyState()
  );
  return (
    <>
      {winner !== null && <h1>Player {winner} wins!</h1>}
      <div className="board">
        {board.map((columnEntries, colIndex) => {
          const makeMove = () => {
            dispatch({
              type: "MAKE_MOVE",
              payload: colIndex
            });
          };
          return (
            <Column
              colEntries={columnEntries}
              key={colIndex}
              onClick={makeMove}
            />
          );
        })}
      </div>
      {isOver && (
        <button
          onClick={() => {
            dispatch({ type: "RESTART_GAME" });
          }}
        >
          Restart Game
        </button>
      )}
    </>
  );
};

function Column({ colEntries, onClick }) {
  return (
    <div className="column">
      {colEntries.map((entry, index) => {
        return (
          <div className="tile" key={index} onClick={onClick}>
            {entry !== null && <div className={`player player-${entry}`} />}
          </div>
        );
      })}
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "RESTART_GAME":
      return generateEmptyState();
    case "MAKE_MOVE":
      const colIndex = action.payload;
      if (state.board[colIndex][0] !== null || state.isOver) return state;

      const { board, currentPlayer } = state;
      // User Making Move
      const boardClone = [...board];
      const selectedCol = board[colIndex];
      const colClone = [...selectedCol];
      const rowIndex = colClone.lastIndexOf(null);
      colClone[rowIndex] = currentPlayer;
      boardClone[colIndex] = colClone;

      // Check winner
      const didWinVertical = didWin(
        rowIndex,
        colIndex,
        1,
        0,
        boardClone,
        currentPlayer
      );
      const didWinHorizontal = didWin(
        rowIndex,
        colIndex,
        0,
        1,
        boardClone,
        currentPlayer
      );
      const didWinDiagonal =
        didWin(rowIndex, colIndex, 1, 1, boardClone, currentPlayer) ||
        didWin(rowIndex, colIndex, -1, 1, boardClone, currentPlayer);

      const winner =
        didWinVertical || didWinHorizontal || didWinDiagonal
          ? currentPlayer
          : null;
      const isGameBoardFull = boardClone.every((column) =>
        column.every((entry) => entry !== null)
      );
      return {
        board: boardClone,
        currentPlayer: currentPlayer === 1 ? 2 : 1,
        winner,
        isOver: winner !== null || isGameBoardFull
      };
    default:
      throw new Error("Unexpected Action Type");
  }
}

function generateEmptyState() {
  return {
    board: new Array(NUM_COLS)
      .fill(null)
      .map((_) => new Array(NUM_ROWS).fill(null)),
    currentPlayer: 1,
    winner: null,
    isOver: false
  };
}

function didWin(
  startingRowIndex,
  startingColumnIndex,
  rowIncrement,
  colIncrement,
  board,
  currentPlayer
) {
  // Implementation of BFS
  let consecutiveSpots = 0;
  let currRow = startingRowIndex;
  let currCol = startingColumnIndex;

  while (
    currRow < NUM_ROWS &&
    currCol < NUM_COLS &&
    board[currCol][currRow] === currentPlayer
  ) {
    consecutiveSpots++;
    currRow += rowIncrement;
    currCol += colIncrement;
  }

  currRow = startingRowIndex - rowIncrement;
  currCol = startingColumnIndex - colIncrement;
  while (
    currRow >= 0 &&
    currCol >= 0 &&
    board[currCol][currRow] === currentPlayer
  ) {
    consecutiveSpots++;
    currRow -= rowIncrement;
    currCol -= colIncrement;
  }

  return consecutiveSpots >= 4;
}

export default ConnectFour;
