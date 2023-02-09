import "../App.css";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="App">
      <div className="app-container">
        <h1>Welcome to Anaconda's Rock, Scissor, Paper Game</h1>
        <h3>Press START to start the game</h3>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate("SelectPlayer")}
        >
          START
        </Button>
      </div>
    </div>
  );
};

export default Home;
