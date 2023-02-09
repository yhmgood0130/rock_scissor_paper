const Choice = {
  Rock: "rock",
  Scissor: "scissor",
  Paper: "paper",
};

const checkWinner = (first, second) => {
  if (first === Choice.Rock && second === Choice.Rock) {
    return "draw";
  } else if (first === Choice.Rock && second === Choice.Scissor) {
    return "win";
  } else if (first === Choice.Rock && second === Choice.Paper) {
    return "lose";
  } else if (first === Choice.Paper && second === Choice.Paper) {
    return "draw";
  } else if (first === Choice.Paper && second === Choice.Rock) {
    return "win";
  } else if (first === Choice.Paper && second === Choice.Scissor) {
    return "lose";
  } else if (first === Choice.Scissor && second === Choice.Scissor) {
    return "draw";
  } else if (first === Choice.Scissor && second === Choice.Rock) {
    return "lose";
  } else if (first === Choice.Scissor && second === Choice.Paper) {
    return "win";
  }

  return null;
};

export { checkWinner };
