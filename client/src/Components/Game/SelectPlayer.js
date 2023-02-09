import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./select-player.css";

const SelectPlayer = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(null);
  const [currentUser, setCurrentUser] = useState(0);
  const [userName, setUsername] = useState("");

  const createOrLoadGame = (user1, user2) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player_1: user1,
        player_2: user2 || "AI",
      }),
    };

    fetch("/games", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        const {
          game_id: id,
          user_1_choice: user1Choice,
          user_2_choice: user2Choice,
        } = data;
        console.log(id, user1Choice, user2Choice);
        navigate("/Game", {
          state: {
            player1: user1,
            player2: user2,
            id,
            user1Choice,
            user2Choice,
          },
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const optionClicked = (e) => {
    const { innerText: totalPlayer } = e.target;
    setPlayers(new Array(parseInt(totalPlayer)).fill(""));
  };

  const handleUsername = (e) => {
    const { value: userName } = e.target;
    if (e.key === "Enter") {
      if (userName.trim()) {
        const playerNames = [...players];

        playerNames[currentUser] = userName;

        setPlayers(playerNames);
        setUsername("");

        if (players.length > currentUser + 1) {
          setCurrentUser(currentUser + 1);
        } else {
          if (players.length === 2) {
            createOrLoadGame(playerNames[0], playerNames[1]);
          } else {
            navigate("/Game", {
              state: {
                player1: playerNames[0],
              },
            });
          }
        }
      }
    } else {
      setUsername(userName);
    }
  };

  return (
    <div className="app-container select-container">
      {!players ? (
        <>
          <p>How many players are playing?</p>
          <div className="button-container">
            <Button variant="outline-primary" onClick={optionClicked}>
              1
            </Button>
            <Button variant="outline-primary" onClick={optionClicked}>
              2
            </Button>
          </div>
        </>
      ) : (
        <>
          <Fragment>
            <p>{`Please enter the name for Player${currentUser + 1}`}</p>
            <input
              type="text"
              value={userName}
              onChange={handleUsername}
              onKeyDown={handleUsername}
            />
          </Fragment>
        </>
      )}
    </div>
  );
};

export default SelectPlayer;
