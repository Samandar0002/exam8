import React, { useState, useEffect } from "react";
import Board from "./components/board";
import "./assets/main.css";

function App() {
  const initialHistory = [{ squares: Array(9).fill(null) }];
  const [history, setHistory] = useState(initialHistory);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [finished, setFinished] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [startScreen, setStartScreen] = useState(true);

  useEffect(() => {
    const savedGameState = JSON.parse(localStorage.getItem("ticTacToeGame") || "null");
    if (savedGameState) {
      setHistory(savedGameState.history);
      setStepNumber(savedGameState.stepNumber);
      setXIsNext(savedGameState.xIsNext);
      setFinished(savedGameState.finished);
      setPlayer1Name(savedGameState.player1Name);
      setPlayer2Name(savedGameState.player2Name);
      setPlayer1Score(savedGameState.player1Score);
      setPlayer2Score(savedGameState.player2Score);
      setStartScreen(savedGameState.startScreen);
    }
  }, []);

  useEffect(() => {
    const gameState = {
      history,
      stepNumber,
      xIsNext,
      finished,
      player1Name,
      player2Name,
      player1Score,
      player2Score,
      startScreen,
    };
    localStorage.setItem("ticTacToeGame", JSON.stringify(gameState));
  }, [history, stepNumber, xIsNext, finished, player1Name, player2Name, player1Score, player2Score, startScreen]);

  const handleStart = () => {
    setStartScreen(false);
  };

  const handleClick = (i: number) => {
    if (finished || stepNumber >= 9) {
      return;
    }
    const _history = history.slice(0, stepNumber + 1);
    const squares = [..._history[_history.length - 1].squares];

    if (squares[i]) {
      return;
    }

    const winner = calculateWinner(squares);
    if (winner) {
      setFinished(true);
      updateScores(winner);
      return;
    }

    squares[i] = xIsNext ? "X" : "O";
    setHistory([..._history, { squares }]);
    setStepNumber(_history.length);
    setXIsNext(!xIsNext);
  };

  const resetGame = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.removeItem("ticTacToeGame");
    setHistory(initialHistory);
    setStepNumber(0);
    setXIsNext(true);
    setFinished(false);
  };

  const updateScores = (winner: string) => {
   
    if (winner === "X") {
      setPlayer1Score(player1Score + 1);
    } else if (winner === "O") {
      setPlayer2Score(player2Score + 1);
    }
  };

  const squares = history[stepNumber].squares;
  const winner = calculateWinner(squares);
  const winnerName = winner === "X" ? player1Name : winner === "O" ? player2Name : null;
  const status = winner
    ? `Winner: ${winnerName}. Scores: ${player1Name} - ${player1Score}, ${player2Name} - ${player2Score}`
    : `Next player: ${xIsNext ? player1Name : player2Name}. Scores: ${player1Name} - ${player1Score}, ${player2Name} - ${player2Score}`;

  return (
    <div className="game">
      {startScreen ? (
        <div>
          <div className="input-container">
            <label>
              Player 1 Name:
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
              />
            </label>
            <label>
              Player 2 Name:
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
              />
            </label>
          </div>
          <button className="start-button" onClick={handleStart}>
            Start Game
          </button>
        </div>
      ) : (
        <>
          <Board
            squares={squares}
            finished={finished}
            onClick={(i) => handleClick(i)}
          />
          <div className="game-info">
            <div className="status">{status}</div>
            {finished && <p>Congratulations, {winnerName}!</p>}
            <div className="scores">
              Scores: {player1Name} - {player1Score}, {player2Name} - {player2Score}
            </div>
            <button onClick={resetGame}>Reset Game</button>
          </div>
        </>
      )}
    </div>
  );
}

function calculateWinner(squares: Array<string | null>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    const player = squares[a];
    if (player && player === squares[b] && player === squares[c]) {
      return player;
    }
  }
  return null;
}

export default App;
