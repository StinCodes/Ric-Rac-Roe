export default class View {
  $ = {};
  $$ = {};
  constructor() {
    this.$.menu = this.#qs('[data-id="menu"]');
    this.$.menuBtn = this.#qs('[data-id ="menu-btn" ]');
    this.$.menuItems = this.#qs('[data-id="menu-items"]');
    this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
    this.$.newRoundBtn = this.#qs('[data-id= "new-round-btn"]');
    this.$$.squares = this.#qsAll('[data-id= "square"]');
    this.$.modal = this.#qs('[data-id= "modal"]');
    this.$.modalText = this.#qs('[data-id= "modal-text"]');
    this.$.modalBtn = this.#qs('[data-id= "modal-btn"]');
    this.$.turn = this.#qs('[data-id= "turn"]');

    //UI only (view) event listeners
    this.$.menu.addEventListener("click", () => {
      this.#toggleMenu();
    });
  }

  // Register all event listeners
  bindGameResetEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
  }
  bindNewRoundEvent(handler) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }
  bindPlayerMoveEvent(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", handler);
    });
  }
  //DOM helper methods
  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menuBtn.classList.toggle("border");

    const icon = this.$.menuBtn.querySelector("i");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }

  handlePlayerMove(squareEl, player) {
    const icon = document.createElement("i");
    icon.classList.add(
      "fa-solid",
      player === 1 ? "fa-x" : "fa-o",
      player === 1 ? "yellow" : "turquoise"
    );
    squareEl.replaceChildren(icon);
  }

  setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");
    icon.classList.add("fa-solid");
    icon.classList.add(player === 1 ? "fa-x" : "fa-o");

    this.$.turn.classList.add(player === 1 ? "yellow" : "turquoise");
    this.$.turn.classList.remove(player === 1 ? "turquoise" : "yellow");

    label.innerText =
      player === 1 ? "Player 1, you are up" : "Player 2, you are up";

    this.$.turn.replaceChildren(icon, label);
  }

  //QuerySelector function to refactor constructor to use this.qs
  //# makes the function a private function in the view class
  #qs(selector, parent) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);
    if (!el) {
      throw new Error("Could not find elements");
    }
    return el;
  }

  #qsAll(selector) {
    const elList = document.querySelectorAll(selector);

    if (!elList) {
      throw new Error("Could not find elements");
    }
    return elList;
  }
}
