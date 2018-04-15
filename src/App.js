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
      board: makeBoard(10, 10)
    };

    this.setTolive = this.setTolive.bind(this);
  }

  setTolive(x, y) {
    var newBoard = this.state.board;
    newBoard[x][y].live = !newBoard[x][y].live;

    this.setState({ board: newBoard });
  }

  render() {
    return (
      <div className="App">
        <h4>Game of Life</h4>
        <div className="board">
          <Board board={ this.state.board } setTolive={this.setTolive} />
        </div>
      </div>
    );
  }
}

function Board(props) {
  var rows = props.board.map(function(row, idx) {
    return <Row key={idx} row={row} setTolive={props.setTolive} />
  })
  return rows
}

function Row(props) {
  var boxes = props.row.map(function(item, idx) {
    return <Box key={idx} item={item} setTolive={props.setTolive} />
  })
  return <div className="row">{boxes}</div>;
}

function Box(props) {
  var css = "box";
  if (props.item.live) css += " live";
  return <div className={css} onClick={props.setTolive.bind(null, props.item.x, props.item.y)} />;
}

export default App;
