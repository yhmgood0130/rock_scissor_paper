import { useState } from "react";
import { useLocation } from "react-router-dom";
import "./game.css";
import "../../App.css";
import Button from "react-bootstrap/esm/Button";
import { checkWinner } from "./Game-Helper";

const Game = () => {
  const location = useLocation();
  const { player1, player2, id, user1Choice } = location.state;
  const [gameId, setGameId] = useState(id);
  const [playerOneSelection, setPlayerOneSelection] = useState(user1Choice);
  const [gameResult, setGameResult] = useState(null);
  const isAI = id ? false : true;
  const [playerOneTurn, togglePlayerOneTurn] = useState(() =>
    user1Choice ? false : true
  );
  const [playerTwoTurn, togglePlayerTwoTurn] = useState(() =>
    user1Choice ? true : false
  );

  const updateGameStat = ({ player1Choice, player2Choice, winner }) => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_1_choice: player1Choice,
        user_2_choice: player2Choice,
        winner,
      }),
    };

    fetch(`/games/${gameId}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const startNewGame = (user1, user2) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player_1: user1,
        player_2: user2,
      }),
    };

    fetch("/games", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setGameId(data.game_id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getRandomInt = () => {
    return Math.floor(Math.random() * 3);
  };

  const handleClick = (e) => {
    const { value } = e.target;
    let winner;
    let result;

    playerOneTurn && setPlayerOneSelection(value);

    if (isAI) {
      const options = ["rock", "scissor", "paper"];
      result = checkWinner(value, options[getRandomInt()]);
      printResult(result);
    } else {
      if (playerTwoTurn) {
        result = checkWinner(playerOneSelection, value);

        if (result === "win") {
          winner = player1;
        } else if (result === "lose") {
          winner = player2;
        } else if (result === "draw") {
          winner = result;
        }

        printResult(result);
      } else {
        togglePlayerOneTurn(() => !playerOneTurn);
        togglePlayerTwoTurn(() => !playerTwoTurn);
      }

      const body = {
        player1Choice: playerOneTurn ? value : playerOneSelection,
        player2Choice: playerTwoTurn ? value : null,
        winner,
      };

      updateGameStat(body);
    }
  };

  const handleReset = () => {
    togglePlayerOneTurn(true);
    togglePlayerTwoTurn(false);
    setPlayerOneSelection(null);
    setGameResult(null);
    !isAI && startNewGame(player1, player2);
  };

  const isActive = (turn) => {
    return turn ? "success" : "secondary";
  };

  const printResult = (result) => {
    if (result === "win") {
      setGameResult("Player 1 Win!");
    } else if (result === "lose") {
      setGameResult("Player 2 Win!");
    } else if (result === "draw") {
      setGameResult("Draw! No Winner!");
    } else {
      setGameResult("Something went wrong! Please try again!");
    }
    togglePlayerOneTurn(false);
    togglePlayerTwoTurn(false);
  };
  return (
    <div className="app-container">
      <div className="game-container">
        <div className="game-selector">
          <h1>{player1}</h1>
          <Button
            variant={isActive(playerOneTurn)}
            onClick={handleClick}
            size="lg"
            disabled={!playerOneTurn}
            value="rock"
          >
            Rock
          </Button>
          <Button
            variant={isActive(playerOneTurn)}
            onClick={handleClick}
            size="lg"
            disabled={!playerOneTurn}
            value="scissor"
          >
            Scissor
          </Button>
          <Button
            variant={isActive(playerOneTurn)}
            onClick={handleClick}
            size="lg"
            disabled={!playerOneTurn}
            value="paper"
          >
            Paper
          </Button>
        </div>
        {gameResult && (
          <div className="result-container">
            <h2 className="result-font">{gameResult}</h2>
            <Button onClick={handleReset}>Try Again</Button>
          </div>
        )}
        <div className="game-selector">
          <h1>{player2 ? player2 : "AI"}</h1>
          <Button
            variant={isActive(playerTwoTurn)}
            onClick={handleClick}
            size="lg"
            disabled={!playerTwoTurn}
            value="rock"
          >
            Rock
          </Button>
          <Button
            variant={isActive(playerTwoTurn)}
            onClick={handleClick}
            size="lg"
            disabled={!playerTwoTurn}
            value="scissor"
          >
            Scissor
          </Button>
          <Button
            variant={isActive(playerTwoTurn)}
            onClick={handleClick}
            size="lg"
            disabled={!playerTwoTurn}
            value="paper"
          >
            Paper
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Game;
