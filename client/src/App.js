import { Routes, Route } from "react-router-dom";
import Main from "./Components/Main";
import SelectPlayer from "./Components/Game/SelectPlayer";
import Game from "./Components/Game/Game";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/SelectPlayer" element={<SelectPlayer />} />
        <Route path="/Game" element={<Game />} />
      </Routes>
    </>
  );
};

export default App;
