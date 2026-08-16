
import React, { Component } from "react"
import Cell from "./Cell"
import Solver from './Solver'
import { Chip } from "@heroui/chip"
import './Minesweeper.css'

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = this.initEmptyBoard(this.props.height, this.props.width)
        this.state['revealed'] = 0
        this.state['gameOver'] = false
        this.state['won'] = false
        this.state['minesPlaced'] = false
    }

    async componentDidMount() {
    }

    initEmptyBoard(height, width) {
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

        return {board: arr}
    }

    // Places mines after the first click so the clicked cell and its
    // neighbors are never mines - matches the classic Minesweeper guarantee
    // that your opening click is always safe.
    placeMines(data, height, width, mines, safeX, safeY) {
        let safeCells = new Set()
        let minX = (safeX > 0) ? safeX - 1 : safeX
        for (minX; minX < safeX + 2 && minX < width; minX++) {
            let minY = (safeY > 0) ? safeY - 1 : safeY
            for (minY; minY < safeY + 2 && minY < height; minY++) {
                safeCells.add(minX + ',' + minY)
            }
        }

        let target = Math.min(mines, (width * height) - safeCells.size)

        let count = 0
        while (count < target) {
            let nextPos = this.getNextMinePos(height, width)
            let key = nextPos[0] + ',' + nextPos[1]

            if (!data[nextPos[0]][nextPos[1]].isMine && !safeCells.has(key)) {
                data[nextPos[0]][nextPos[1]].isMine = true
                data[nextPos[0]][nextPos[1]].value = -1

                count += 1
            }
        }

        return this.updateMineCounts(data, width, height).board
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
                            if (!data[minX][minY].isMine) {
                                data[minX][minY].value+=1
                            }
                        }
                    }
                }
            }
        }

        return {board: data}
    }

    hideAll() {
        this.setState(this.initEmptyBoard(this.props.height, this.props.width))

        this.setState({
            gameOver: false,
            won: false,
            revealed : 0,
            minesPlaced: false
        })
    }

    getNextMinePos(height, width) {
        let randVal = Math.floor(Math.random() * height*width)

        let x = Math.floor(randVal/height)
        let y = randVal % height
        
        return [x,y]
    }

    handleCellClick(x,y) {
        let data = this.state.board

        if (this.state.gameOver) {
            this.hideAll()
        }

        if (!this.state.minesPlaced) {
            data = this.placeMines(data, this.props.height, this.props.width, this.props.numMines, x, y)
            this.setState({board: data, minesPlaced: true})
        }

        let cell = data[x][y]
        let revealed = this.state.revealed

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
        // Clear the highlight first so the flash animation restarts even when
        // re-highlighting a cell that's already highlighted (a re-applied,
        // identical class name wouldn't retrigger the CSS animation on its own).
        let data = this.state.board
        data[x][y].highlight = ""
        this.updateBoard(data)

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                let latest = this.state.board
                latest[x][y].highlight = (color != null) ? " " + color : ""
                this.updateBoard(latest)
            })
        })
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
        let status = 'Game On'
        let color = 'default'

        if (this.state.gameOver) {
            status = (this.state.won) ? 'You Won' : 'Game Over'
            color = (this.state.won) ? 'success' : 'danger'
        }

        return (
            <section>
                <section className="game-title">
                    <Chip color={color} variant="flat" size="lg">{status}</Chip>
                </section>
                <section className="board">
                    {arr}
                </section>

                <Solver board={this} height={this.props.height} width={this.props.width} numMines={this.props.numMines}/>
            </section>
        );
    }
  }
  

