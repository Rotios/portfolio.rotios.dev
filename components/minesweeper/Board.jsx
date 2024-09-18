
import React, { Component } from "react"
import Cell from "./Cell"
import Solver from './Solver'
import './Minesweeper.css'

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = this.initBoard(this.props.height, this.props.width, this.props.numMines)    
        this.state['revealed'] = 0
        this.state['gameOver'] = false
        this.state['won'] = false
    }
    
    async componentDidMount() {
    }

    initBoard(height, width, mines) {
        let x = 0

        let arr = new Array()
        for (x; x<width; x++) {
            let y = 0

            let innerArr = new Array()
            for (y; y<height; y++) {
                let cellData = {
                    isMine: false, 
                    isFlagged:false, 
                    isHidden:true, 
                    value:0,
                    highlight: ""
                }
                innerArr.push(cellData)
            }

            arr.push(innerArr)
        }

        let count = 0
        while (count < mines) {
            let nextPos = this.getNextMinePos(height, width)

            if (!arr[nextPos[0]][nextPos[1]].isMine) {
                arr[nextPos[0]][nextPos[1]].isMine = true
                arr[nextPos[0]][nextPos[1]].value = -1
            
                count += 1
            }
        }

        return this.updateMineCounts(arr, width, height)
    }

    updateMineCounts(data, width, height) {
        let x = 0
        for (x; x<width; x++) {
            let y = 0

            for (y; y<height; y++) {
                if (data[x][y].isMine) {
                    let minX = (x > 0) ? x-1 : x
                    for (minX; minX < x+2 && minX < width; minX++) {
                        let minY = (y>0) ? y - 1 : y

                        for (minY; minY< (y+2) && minY < height; minY++) {
                            data[minX][minY].value+=1
                        }
                    }
                }
            }
        }

        return {board: data}
    }

    hideAll() { 
        this.setState(this.initBoard(this.props.height, this.props.width, this.props.numMines))

        this.setState({
            gameOver: false,
            won: false,
            revealed : 0
        })
    }

    getNextMinePos(height, width) {
        let randVal = Math.floor(Math.random() * height*width)

        let x = Math.floor(randVal/width)
        let y = randVal % height
        
        return [x,y]
    }

    handleCellClick(x,y) {
        let data = this.state.board
        let cell = data[x][y]

        let revealed = this.state.revealed

        if (this.state.gameOver) {
            this.hideAll()
        }

        if (cell.isHidden === false || cell.isFlagged === true) {
            this.checkWin(revealed)

            return 
        }

        if (cell.isMine === true) {
            this.revealAll()
            return 
        }
        if (cell.value > 0) {
            cell.isHidden = false

            this.updateBoard(data);
            revealed++
        } else {
            revealed += this.revealEmpty(x, y);
        }

        console.log(revealed)

        this.setState({revealed: revealed})

        this.checkWin(revealed)
        return 
    }

    checkWin(revealed) {
        if (revealed === (this.props.width * this.props.height - this.props.numMines)) {
            this.setState({won:true})
            this.revealAll()
        }
    }

    highlightCell(x, y, color) {
        let data = this.state.board
        let cell = data[x][y]
        cell.highlight = (color != null) ? " " + color : ""
        this.updateBoard(data)
    }

    revealEmpty(x, y) {
        let data = this.state.board
        let stack = []
        stack.push({xPos: x, yPos: y})
        data[x][y].isHidden = false

        let revealed = 1

        while (stack.length > 0) {

            let cellLoc = stack.pop()
            let cellX = cellLoc.xPos
            let cellY = cellLoc.yPos


            let minX = (cellX > 0) ? cellX - 1 : cellX;
            for (minX; minX < cellX + 2 && minX < this.props.width; minX++) {
                let minY = (cellY > 0) ? cellY - 1 : cellY;
                for (minY; minY < (cellY + 2) && minY < this.props.height; minY++) {
                    let curCell = data[minX][minY]

                    if (curCell.isHidden === true) {
                        curCell.isHidden = false
                        revealed++
                        if (curCell.value === 0) {
                            stack.push({xPos: minX, yPos: minY})
                        }
                    }
                    
                }
            }
        }

        this.updateBoard(data);
        return revealed
    }

    updateBoard(data) {
        this.setState({ board: data });
    }

    handleContextMenu(e,x,y) {
        e.preventDefault()

        let data = this.state.board
        let cell = data[x][y]
        if (cell.isHidden) {
            cell.isFlagged = !cell.isFlagged
            this.updateBoard(data)
        }
    }

    revealAll() {
        this.setState({'gameOver': true})

        let data = this.state.board
        let x = 0

        for (x; x<this.props.width; x++) {
            let y = 0
            for (y; y<this.props.height; y++) {
                data[x][y].isHidden = false
            }
        }

        this.updateBoard(data)
    }

    renderCells() {
        let arr = new Array()
        let x = 0
        for (x; x<this.props.width; x++) {
            let innerArr = new Array()
            let y = 0

            for (y; y<this.props.height; y++) {
                let cellInfo = this.state.board[x][y]
                let xPos = x
                let yPos = y
                innerArr.push(
                <Cell  key={x*this.props.width+y} 
                    highlight={cellInfo.highlight} 
                    isMine={cellInfo.isMine} 
                    isFlagged={cellInfo.isFlagged} 
                    isHidden={cellInfo.isHidden} 
                    value={cellInfo.value}
                    onClick={() => this.handleCellClick(xPos, yPos)}
                    onCtxMenu={(e) => this.handleContextMenu(e, xPos, yPos)}
                />)
            }

            arr.push(<div className="row" key={x}>{innerArr}</div>)
        }


        return arr
    }

    render() {
        let arr = this.renderCells()   
        let s = 'Game On'

        if (this.state.gameOver) {
            s = (this.state.won) ? 'You Won' : 'Game Over'
        }
        return (
            <section>
                <section>
                    <h1 className="game-title">{s}</h1>
                </section>
                <section className="board">
                    {arr}
                </section>

                <Solver board={this} height={this.props.height} width={this.props.height} numMines={this.props.numMines}/>
                
                {/* <label for="fname">Height: </label>
                <input type="text" id="fname" name="height" placeholder="Number"/>
                
                <label for="fname">Width: </label>
                <input type="text" id="fname" name="width" placeholder="Number"/>
                <br/>

                
                <label for="fname">Mines: </label>
                <input type="text" id="fname" name="mineNum" placeholder="Number"/> */}
                
            </section>
        );
    }
  }
  

