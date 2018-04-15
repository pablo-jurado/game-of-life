import React, { Component } from 'react';
import './App.css';

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
      board: makeBoard(10, 10)
    };
  }

  render() {
    return (
      <div className="App">
        <h4>Game of Life</h4>
        <div className="board">
          <Board board={ this.state.board } />
        </div>
      </div>
    );
  }
}

function Board(props) {
  var rows = props.board.map(function(row, idx) {
    return <Row key={idx} row={row} />
  })
  return rows
}

function Row(props) {
  var boxes = props.row.map(function(item, idx) {
    return <Box key={idx} />
  })
  return <div className="row">{boxes}</div>;
}

function Box() {
  return <div className="box" />;
}

export default App;
