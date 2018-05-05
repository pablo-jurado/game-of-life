import React, { Component } from 'react';
import './App.css';


class App extends Component {
  constructor() {
    super()

    this.state = {
      renderCount: 0,
      gameOn: false,
      size: "Small",
      boardX: 25,
      boardY: 25,
      board: null
    };

    this.state.board = this.makeBoard(this.state.boardX, this.state.boardY);
    this.intervalId = null;

    this.checkBoxesAround = this.checkBoxesAround.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.makeBoard = this.makeBoard.bind(this);
    this.clickBox = this.clickBox.bind(this);
    this.reRender = this.reRender.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.clear = this.clear.bind(this);
    this.seed = this.seed.bind(this);
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

  clickBox(x, y) {
    var newBoard = this.state.board;
    newBoard[x][y].live = !newBoard[x][y].live;

    this.setState({ board: newBoard });    
  }

  play() {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.reRender, 1000);
    this.setState({ gameOn: true });
  }

  clear() {
    var newBoard = this.makeBoard(this.state.boardX, this.state.boardY);
    clearInterval(this.intervalId);
    this.setState({ gameOn: false, board: newBoard, renderCount: 0 });
  }
  
  pause() {
    this.setState({ gameOn: false });    
    clearInterval(this.intervalId);
  }

  seed() {
    var newBoard = this.state.board;
    var maxRow = this.state.boardX;
    var maxCol = this.state.boardY;
    for (let indexRow = 0; indexRow < maxRow; indexRow++) {
      for (let indexCol = 0; indexCol < maxCol; indexCol++) {
        var num = Math.random();
        var randomBoolean = (num > 0.5) ? true : false;
        newBoard[indexRow][indexCol].live = randomBoolean; 
      }
    }
    this.setState({ board: newBoard});
  }

  handleSizeChange(e) {
    var value = e.target.value;
    var x = 20;
    var y = 20;

    if (value === "Medium") {
      x = 35;
      y = 35;
    }

    if (value === "Large") {
      x = 50;
      y = 50;
    }

    this.setState({
      size: value,
      boardX: x,
      boardY: y,
      board: this.makeBoard(x, y)
    });
  }
  
  reRender() {
    var currentBoard = this.state.board;
    var nextBoard = deepClone(this.state.board);
    var maxRow = this.state.boardX;
    var maxCol = this.state.boardY;

    for (let indexRow = 0; indexRow < maxRow; indexRow++) {
      for (let indexCol = 0; indexCol < maxCol; indexCol++) {

        var liveNeighbours = this.checkBoxesAround(indexRow, indexCol);
        // Any live box with two or three live neighbours lives on to the next generation.
        if (currentBoard[indexRow][indexCol].live) {
          // Any live box with fewer than two live neighbours dies, as if caused by underpopulation.
          // Any live box with more than three live neighbours dies, as if by overpopulation.
          if (liveNeighbours < 2 || liveNeighbours > 3) {
            nextBoard[indexRow][indexCol].live = false;
          } 
        } else {
          // Any dead box with exactly three live neighbours becomes a live box, as if by reproduction.
          if (liveNeighbours === 3) {
            nextBoard[indexRow][indexCol].live = true;
          }
        }
      }
    } // end nested loop
    var newRender = this.state.renderCount;
    this.setState({ board: nextBoard, renderCount: newRender + 1 });
  }

  checkBoxesAround(boxX, boxY) {
    var lives = 0;
    var limitX = this.state.boardX
    var limitY = this.state.boardY

    for (var x = boxX - 1; x < boxX  + 2; x++) {
      for (var y = boxY - 1; y < boxY + 2; y++) {
        // avoid checking itself
        if (boxX === x && boxY === y) {
          continue;
        }
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
        <p>Generation: {this.state.renderCount}</p>
        <SelectSize size={this.state.size} handleSizeChange={this.handleSizeChange} />
        <div className="board">
          <Board
            gameOn={this.state.gameOn}
            board={this.state.board}
            clickBox={this.clickBox}
          />
        </div>
        <br />
        <button type="button" onClick={this.seed}>Seed</button>
        <button type="button" onClick={this.play}>Play</button>
        <button type="button" onClick={this.pause}>Pause</button>
        <button type="button" onClick={this.clear}>Clear</button>

      </div>
    );
  }
}

function SelectSize(props) {
  return (
    <div>
      <label>Board Size: </label>
      <select value={props.size} onChange={props.handleSizeChange}>
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
      </select>
      <br /><br />
    </div>
  );
}

function deepClone(element) {
  return JSON.parse(JSON.stringify(element));
}

function Board(props) {
  var rows = props.board.map((row, idx) => {
    return (
      <Row key={idx}
        row={row}
        gameOn={props.gameOn}
        clickBox={props.clickBox}
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
        clickBox={props.clickBox}
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
      
    return <div className={css} onClick={this.props.clickBox.bind(null, x, y)} />;
  }
}

export default App;
