import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Cell(props) {
  return (
    <div className="grid-cell" id={props.id}>
      <div className="cell-number-1">{props.id}</div>
      {props.player1 && <div className="player1"></div>}
      {props.player2 && <div className="player2"></div>}
    </div>
  );
}

class Board extends Component {
  renderRow(row) {
    return (
      <div className="row">
        {" "}
        {row.map((elem, idx) => {
          if (elem === this.props.player1Position) {
            return <Cell id={elem} player1={this.props.player1Position} />;
          } else if (elem === this.props.player2Position) {
            return <Cell id={elem} player2={this.props.player2Position} />;
          } else {
            return <Cell id={elem} />;
          }
        })}
      </div>
    );
  }
  renderGrid() {
    const arr = [];
    for (let i = 100; i >= 1; i--) {
      if (i % 10 === 0) {
        arr.push([i]);
      } else {
        arr[arr.length - 1].push(i);
      }
    }
    arr.map((e, i) => (i % 2 === 0 ? e : e.reverse()));
    return arr.map((elem) => {
      return this.renderRow(elem);
    });
  }
  render() {
    return <div className="board">{this.renderGrid()}</div>;
  }
}

class SnakesLaddersGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player1Turn: true,
      status: "To play: Player 1",
      diceValue: 0,
      player1Position: 1,
      player2Position: 1,
      isGameComplete: false,
      previousMove: "",
    };
    // this.rollDice = this.rollDice.bind(this);
  }
  snakesAndLadders = {
    2: { goTo: 18, type: "Ladder" },
    4: { goTo: 14, type: "Ladder" },
    9: { goTo: 31, type: "Ladder" },
    17: { goTo: 7, type: "Snake" },
    20: { goTo: 38, type: "Ladder" },
    28: { goTo: 84, type: "Ladder" },
    29: { goTo: 11, type: "Snake" },
    40: { goTo: 59, type: "Ladder" },
    51: { goTo: 67, type: "Ladder" },
    54: { goTo: 34, type: "Snake" },
    62: { goTo: 19, type: "Snake" },
    63: { goTo: 81, type: "Ladder" },
    64: { goTo: 43, type: "Ladder" },
    71: { goTo: 91, type: "Ladder" },
    87: { goTo: 23, type: "Snake" },
    93: { goTo: 73, type: "Snake" },
    95: { goTo: 75, type: "Snake" },
    99: { goTo: 78, type: "Snake" },
  };

  rollDice = () => {
    const diceValue = Math.round(Math.random() * 5 + 1);
    let previousMove = "";
    let player1Position, player2Position;
    if (this.state.player1Turn) {
      player1Position = this.state.player1Turn
        ? this.calculatePlayerPosition(diceValue, this.state.player1Position)
        : { position: this.state.player1Position, desc: "" };
      previousMove = player1Position.desc;
      player2Position = {
        position: this.state.player2Position,
        desc: "",
      };
    } else {
      player2Position = !this.state.player1Turn
        ? this.calculatePlayerPosition(diceValue, this.state.player2Position)
        : { position: this.state.player2Position, desc: "" };
      previousMove = player2Position.desc;
      player1Position = {
        position: this.state.player1Position,
        desc: "",
      };
    }
    let status =
      "To play: " + (!this.state.player1Turn ? "Player 1" : "Player 2");
    let isGameComplete = false;
    if (player1Position.position === 100) {
      status = "Player 1 has Won!";
      isGameComplete = true;
    } else if (player2Position.position === 100) {
      status = "Player 2 has Won!";
      isGameComplete = true;
    }
    if (!this.state.isGameComplete) {
      this.setState({
        status: status,
        diceValue: diceValue,
        player1Turn: !this.state.player1Turn,
        player1Position: player1Position.position,
        player2Position: player2Position.position,
        isGameComplete,
        previousMove,
      });
    }
  };
  calculatePlayerPosition(diceValue, currentPosition) {
    let moveDesc = this.state.player1Turn ? "Player 1 " : "Player 2 ";
    if (currentPosition + diceValue > 100) {
      moveDesc += "cannot move forward since it is an invalid move.";
      return { position: currentPosition, desc: moveDesc };
    } else {
      let newPosition = currentPosition + diceValue;
      var found = this.snakesAndLadders[newPosition];
      if (found) {
        const finalPosition = found.goTo;
        if (found.type === "Ladder") {
          moveDesc += ` found a Ladder at ${newPosition} and climbed to ${finalPosition}`;
        } else if (found.type === "Snake") {
          moveDesc += ` was attacked by a Snake at ${newPosition} and was sent to ${finalPosition}`;
        }
        newPosition = found.goTo;
      } else {
        moveDesc += "moved to position " + newPosition;
      }
      return { position: newPosition, desc: moveDesc };
    }
  }
  render() {
    return (
      <div>
        <h1 align="center">Snakes and Ladders</h1>
        <div className="game">
          <Board
            diceValue={this.state.diceValue}
            currentPlayer={this.state.player1Turn}
            player1Position={this.state.player1Position}
            player2Position={this.state.player2Position}
          />
        </div>
        <div className="console">
          <div className="status">{this.state.status}</div>
          <button className="dice-roll" onClick={this.rollDice}>
            Roll Dice
          </button>
          <div className="status">Dice Value: {this.state.diceValue}</div>
          <div className="history">{this.state.previousMove}</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<SnakesLaddersGame />, document.getElementById("root"));
