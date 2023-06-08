const App = {
  //all of selected html elements
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetBTN: document.querySelector('[data-id="reset-btn"]'),
    newRoundBtn: document.querySelector('[data-id= "new-round-btn"]'),
    squares: document.querySelectorAll('[data-id= "square"]'),
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

        // Determine which player icon to add to square
        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);

        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);

        const icon = document.createElement("i");
        if (currentPlayer === 1) {
          icon.classList.add("fa-solid", "fa-x", "yellow");
        } else {
          icon.classList.add("fa-solid", "fa-o", "turquoise");
        }

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        square.replaceChildren(icon);

        //Check for winner or tie
        const game = App.getGameStatus(App.state.moves);
        if(game.status === 'Complete'){
          if(game.winner){
            alert(`Player ${game.winner} wins!`)
          }else{
            alert('Game ends in a tie!')
          }
        }
      });
    });
  },
};

window.addEventListener("load", App.init);
