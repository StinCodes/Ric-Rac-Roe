const App = {
  //all of selected html elements
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetBTN: document.querySelector('[data-id="reset-btn"]'),
    newRoundBtn: document.querySelector('[data-id= "new-round-btn"]'),
    squares: document.querySelectorAll('[data-id= "square"]'),
  },
  state:{
    currentPlayer: 1,
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

        if(square.hasChildNodes()){
          return
        }

        const currentPlayer = App.state.currentPlayer
        const icon = document.createElement('i')
        if(currentPlayer === 1){
          icon.classList.add('fa-solid', 'fa-x', 'yellow')
        }else{
          icon.classList.add('fa-solid', 'fa-o', 'turquoise')
        }

        //if current player is equal to 1, change to 2
        App.state.currentPlayer = App.state.currentPlayer === 1 ? 2 : 1

        square.replaceChildren(icon)
        // <i class="fa-solid fa-x yellow"></i>
        // <i class="fa-solid fa-o turquoise"></i>
      });
    });
  },
};

window.addEventListener("load", App.init);
