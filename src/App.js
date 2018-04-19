import React, { Component } from 'react';
import './App.css';


class App extends Component {
  constructor() {
    super()

    this.state = {
      gameOn: false,
      boardX: 10,
      boardY: 10,
      board: null
    };

    this.prevBoard = this.makeBoard(this.state.boardX, this.state.boardY);
    this.state.board = this.prevBoard;
    this.intervalId = null;

    this.checkBoxesAround = this.checkBoxesAround.bind(this);
    this.toggleLive = this.toggleLive.bind(this);
    this.makeBoard = this.makeBoard.bind(this);
    this.clickBox = this.clickBox.bind(this);
    this.reRender = this.reRender.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
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

  toggleLive(x, y) {
    this.prevBoard[x][y].live = !this.prevBoard[x][y].live;
  }

  clickBox(x, y) {
    var newBoard = this.state.board;
    newBoard[x][y].live = !newBoard[x][y].live;

    this.setState({ board: newBoard });    
  }

  play() {
    this.stop();
    this.intervalId = setInterval(this.reRender, 1000);
    this.setState({ gameOn: true });
  }

  stop() {
    this.setState({ gameOn: false });    
    clearInterval(this.intervalId);
  }

  reRender() {
    this.setState({ board: this.prevBoard });    
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
          <Board
            gameOn={this.state.gameOn}
            board={this.state.board}
            toggleLive={this.toggleLive}
            clickBox={this.clickBox}
            checkBoxesAround={this.checkBoxesAround}
          />
        </div>
        <br />
        <button type="button" onClick={this.play}>Play</button>
        <button type="button" onClick={this.stop}>Stop</button>

      </div>
    );
  }
}

function Board(props) {
  var rows = props.board.map((row, idx) => {
    return (
      <Row key={idx}
        row={row}
        gameOn={props.gameOn}
        toggleLive={props.toggleLive}
        clickBox={props.clickBox}
        checkBoxesAround={props.checkBoxesAround}
      />
    )  
  })
  return rows
}

function Row(props) {
  var boxes = props.row.map((box, idx) => {
    return (
      <Box 
        key={idx}
        gameOn={props.gameOn}
        toggleLive={props.toggleLive}
        clickBox={props.clickBox}
        checkBoxesAround={props.checkBoxesAround} 
        box={box} 
      />
    )
  })

  return <div className="row">{boxes}</div>;
}

class Box extends Component {
  render() {
    var box = this.props.box
    var x = box.x;
    var y = box.y;
    var css = "box";
    if (box.live) css += " live";

    var liveNeighbours = this.props.checkBoxesAround(x, y);

    if (this.props.gameOn) {
      // Any live box with two or three live neighbours lives on to the next generation.
      if (this.props.box.live) {
        // Any live box with fewer than two live neighbours dies, as if caused by underpopulation.
        if (liveNeighbours < 2) {
          this.props.toggleLive(x, y)
        }
        
        // Any live box with more than three live neighbours dies, as if by overpopulation.
        if (liveNeighbours > 3) {
          this.props.toggleLive(x, y)
        }  
      } else {
        // Any dead box with exactly three live neighbours becomes a live box, as if by reproduction.
        if (liveNeighbours === 3) {
          this.props.toggleLive(x, y)
        }
      }
    }
      
    return <div className={css} onClick={this.props.clickBox.bind(null, x, y)} />;
  }
}

export default App;
