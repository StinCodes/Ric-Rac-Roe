import View from "./view.js";
import Store from "./store.js";

const App = {
  //all of selected html elements
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetBTN: document.querySelector('[data-id="reset-btn"]'),
    newRoundBtn: document.querySelector('[data-id= "new-round-btn"]'),
    squares: document.querySelectorAll('[data-id= "square"]'),
    modal: document.querySelector('[data-id= "modal"]'),
    modalText: document.querySelector('[data-id= "modal-text"]'),
    modalBtn: document.querySelector('[data-id= "modal-btn"]'),
    turn: document.querySelector('[data-id= "turn"]'),
  },
  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => {
        return move.playerId === 1;
      })
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => {
        return move.playerId === 2;
      })
      .map((move) => +move.squareId);
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];
    let winner = null;
    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));
      if (p1Wins) {
        winner = 1;
      }
      if (p2Wins) {
        winner = 2;
      }
    });
    return {
      status: moves.length === 9 || winner != null ? "Complete" : "In-Progress",
      winner,
    };
  },

  init() {
    App.registerEventListeners();
  },
  registerEventListeners() {
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });
    App.$.resetBTN.addEventListener("click", () => {
      console.log("reset game");
    });
    App.$.newRoundBtn.addEventListener("click", () => {
      console.log("add new round");
    });
    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        // console.log(`Square with id ${event.target.id} was clicked`);
        // console.log(`Current player is ${App.state.currentPlayer}`)

        //check there is a move in square, if so return early (prevents multiple X/O in 1 square)
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };
        if (hasMove(+square.id)) {
          return;
        }

        // Determine which player icon to add to square, check who moved last
        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        //Set current player turn
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);
        const nextPlayer = getOppositePlayer(currentPlayer);

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer} you are up!`;

        if (currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnLabel.classList = "turquoise";
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnLabel.classList = "yellow";
        }

        App.$.turn.replaceChildren(turnIcon, turnLabel);

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        square.replaceChildren(squareIcon);

        //Check for winner or tie
        const game = App.getGameStatus(App.state.moves);
        if (game.status === "Complete") {
          App.$.modal.classList.remove("hidden");
          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = `The game ends in a tie!`;
          }
          App.$.modalText.textContent = message;
        }
      });
    });
    App.$.modalBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add("hidden");
    });
  },
};
// window.addEventListener("load", App.init);

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

function init() {
  const view = new View();
  const store = new Store(players);
  console.log(store.game);

  view.bindGameResetEvent((event) => {
    console.log("Reset event");
    console.log(event);
  });
  view.bindNewRoundEvent((event) => {
    console.log("New round event");
    console.log(event);
  });

  view.bindPlayerMoveEvent((square) => {

    const existingMove = store.game.moves.find(move => move.squareId === +square.id)

    if(existingMove){
      return
    }
    //put current player icon in square
    view.handlePlayerMove(square, store.game.currentPlayer);
    //adv to next state by pushing move to moves
    store.playerMove(+square.id);
    //set players next turn indicator
    view.setTurnIndicator(store.game.currentPlayer);
  });
}

window.addEventListener("load", init);
