import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';

function makeBoard(maxRow, maxCol) {
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

class App extends Component {
  constructor() {
    super() 

    this.state = {
      gameOn: false,
      board: makeBoard(10, 10)
    };

    this.updateBoard = this.updateBoard.bind(this);
  }

  updateBoard(x, y) {
    var newBoard = this.state.board;
    newBoard[x][y].live = !newBoard[x][y].live;
  
    this.setState({ board: newBoard });
  }

  render() {
    return (
      <div className="App">
        <h4>Game of Life</h4>
        <div className="board">
          <Board board={ this.state.board } updateBoard={this.updateBoard} />
        </div>
      </div>
    );
  }
}

function Board(props) {
  var rows = props.board.map(function(row, idx) {
    return <Row key={idx} row={row} updateBoard={props.updateBoard} />
  })
  return rows
}

function Row(props) {
  var boxes = props.row.map(function(item, idx) {
    var css = "box";
    if (item.live) css += " live";

    return <div className={css} onClick={props.updateBoard.bind(null, item.x, item.y)} />;
  })

  return <div className="row">{boxes}</div>;
}


export default App;
