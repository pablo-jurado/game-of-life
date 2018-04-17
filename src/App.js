import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';



class App extends Component {
  constructor() {
    super() 

    this.state = {
      boardX: 10,
      boardY: 10,
      gameOn: false,
      board: null
    };

    this.state.board = this.makeBoard(this.state.boardX, this.state.boardY)

    this.makeBoard = this.makeBoard.bind(this);
    this.updateBoard = this.updateBoard.bind(this);
    this.checkBoxesAround = this.checkBoxesAround.bind(this);
  }
  
  makeBoard(maxRow, maxCol) {
    var board = [];
    for (let indexRow = 0; indexRow < maxRow; indexRow++) {
      board[indexRow] = [];
      for (let indexCol = 0; indexCol < maxCol; indexCol++) {
        board[indexRow][indexCol] = {
          live: false,
          x: indexRow,
          y: indexCol 
        }
      }
    }
    return board;
  }

  updateBoard(x, y) {
    var newBoard = this.state.board;
    newBoard[x][y].live = !newBoard[x][y].live;

    this.setState({ board: newBoard });    
  }

  checkBoxesAround(boxX, boxY) {
    var lives = 0;
    var limitX = this.state.boardX
    var limitY = this.state.boardY

    for (var x = boxX - 1; x < boxX  + 2; x++) {
      for (var y = boxY - 1; y < boxY + 2; y++) {
        // check for limits outside the board
        if (x >= 0 && x < limitX && y >= 0 && y < limitY) {
          if (this.state.board[x][y].live) {
            lives++;
          }
        }
      }
    }
    return lives;
  }

  render() {
    return (
      <div className="App">
        <h4>Game of Life</h4>
        <div className="board">
          <Board board={this.state.board} updateBoard={this.updateBoard} checkBoxesAround={this.checkBoxesAround} />
        </div>
      </div>
    );
  }
}

function Board(props) {
  var rows = props.board.map(function(row, idx) {
    return <Row key={idx} row={row} updateBoard={props.updateBoard} checkBoxesAround={props.checkBoxesAround} />
  })
  return rows
}

function Row(props) {
  var boxes = props.row.map(function(box, idx) {
    var x = box.x;
    var y = box.y;
    var css = "box";
    if (box.live) css += " live";
    
    var result = props.checkBoxesAround(x, y)
    
    setTimeout(() => { if(result > 0) console.log(result); }, 1000);
    // ***** RULES ******
    // Any live box with fewer than two live neighbours dies, as if caused by underpopulation.
    // Any live box with two or three live neighbours lives on to the next generation.
    // Any live box with more than three live neighbours dies, as if by overpopulation.
    // Any dead box with exactly three live neighbours becomes a live box, as if by reproduction.

    return <div key={idx} className={css} onClick={props.updateBoard.bind(null, x, y)} />;
  })

  return <div className="row">{boxes}</div>;
}


export default App;
