import React, { Component } from "react"
import './Minesweeper.css'

export default class Solver extends Component {
    constructor(props) {
        super(props);

        this.state = {
            board: this.props.board,
            numMines: this.props.numMines
        }
    }

    getExpandablePositions(data) {
        let items = []
        let x = 0
        let y = 0
        for (x; x < data.length; x++) {
            let y = 0
            for (y; y<data[x].length; y++) {
                let cell = data[x][y]
                if (cell.value !== 0 && !cell.isFlagged && !cell.isHidden) {
                    items.push(cell)
                }
            }
        }

        return items
    }

    takeStep() {
        let expansions = this.getPossibleExpansions()

        if (expansions != null && expansions.clickable != null && expansions.clickable.length > 0) {
            //Map too fast to update reveal count
        
            let cell = expansions.clickable[0]
            this.state.board.handleCellClick(cell.xPos, cell.yPos)
            this.state.board.highlightCell(cell.xPos, cell.yPos, ' highlight-safe')
            
        }
    }

    getHint() {
        let expansions = this.getPossibleExpansions()

        if (expansions != null && expansions.clickable != null && expansions.clickable.length > 0) {
            let cell = expansions.clickable[0]
            console.log(cell)

            this.state.board.highlightCell(cell.xPos, cell.yPos, ' highlight-safe')
        }
    }

    findBomb() {
        let expansions = this.getPossibleExpansions()
        let bombs = expansions.possibleBombs
        if (bombs.length > 0) {
            
            for(let x= 0; x < bombs.length; x++) {
                let bomb = bombs[x]

                if (!bomb.isFlagged) {
                    this.state.board.highlightCell(bomb.xPos, bomb.yPos, 'highlight-bomb')
                    return;
                }
            }
        }
    }

    getPossibleExpansions() {
        let origData = this.state.board.state.board
        let data = []

        for (let x = 0; x < origData.length; x++) {
            let cop = []

            for (let y= 0; y < origData[x].length; y++) {
                let cell = origData[x][y]
                cop.push({
                    isHidden: cell.isHidden,
                    value: cell.value,
                    isFlagged: cell.isFlagged
                })
            }
            
            data.push(cop)
        }
        

        data = data.map((arr) => {
            let d = []
            arr.map((inner) => d.push(inner))
            return d
        })


        const width = data.length
        const height = data[0].length

        let expandableCells = []
        let possibleBombs = []
    
        let x = 0
        for (x; x < width; x++) {
            let y = 0
            for (y; y < height; y++) {
                if(!data[x][y].isHidden && data[x][y].value > 0) {
                    let val = data[x][y].value
                    
                    let cellDat = {
                        xPos: x,
                        yPos: y,
                        value: val,
                        undiscoveredNeighbors: []
                    }

                    let minX = (x > 0) ? x-1 : x
                    for (minX; minX < x+2 && minX < width; minX++) {
                        let minY = (y > 0) ? y-1 : y
                        for (minY; minY < y+2 && minY < height;minY++) {
                            if (data[minX][minY].isHidden) {
                                val -= 1
                                cellDat.undiscoveredNeighbors.push({xPos: minX, yPos: minY, isFlagged: data[minX][minY].isFlagged})
                            }
                        }
                    }

                    if (val === 0) {
                        cellDat.value = 0
                        expandableCells.push(cellDat)
                        cellDat.undiscoveredNeighbors.map((e)=>possibleBombs.push(e))
                    }
                }
            }
        }

        let bombsToCheck = []
        for (let x = 0; x < possibleBombs.length; x++) {
            let isUnique = true
            let b = possibleBombs[x]
            for (let y = 0; y < bombsToCheck.length; y++) {
                if (b.xPos === bombsToCheck[y].xPos && b.yPos === bombsToCheck[y].yPos) {
                    isUnique = false
                }
            }

            if (isUnique) bombsToCheck.push(b)
        }

        possibleBombs = bombsToCheck

        let expansions = new Set()
        possibleBombs.map((bomb) => {
            let x = bomb.xPos
            let y = bomb.yPos
            data[x][y].isFlagged = true
            
            let minX = (x > 0) ? x-1: x
            
            for (minX; minX < width && minX < x + 2; minX++) {
                let minY = (y > 0) ? y-1: y
                for (minY; minY < height && minY < y + 2; minY++) {
                    if (!data[minX][minY].isHidden) {
                        data[minX][minY].value -= 1
                        if (data[minX][minY].value === 0) {
                            expansions.add({xPos: minX, yPos: minY})
                        }
                    }
                }
            }
        })

        let clickable = new Set()
        expansions = [... expansions]

        expansions.map((exp) => {
            let x = exp.xPos
            let y = exp.yPos
            
            let minX = (x > 0) ? x-1: x
            
            for (minX; minX < width && minX < x + 2; minX++) {
                let minY = (y > 0) ? y-1: y
                for (minY; minY < height && minY < y + 2; minY++) {
                    if (data[minX][minY].isHidden && !data[minX][minY].isFlagged) {
                        clickable.add({xPos: minX, yPos: minY, bomb: {xPos: x, yPos: y}})
                    }
                }
            }
        })
        
        return {possibleBombs: possibleBombs, cells: expandableCells, clickable: [... clickable]}
    }

    render() {
        return (
            <div className='hint-buttons-container'>
                <button className='hint-buttons' onClick={()=>this.findBomb()}>
                    Find Bomb for Me
                </button>
                <button className='hint-buttons' onClick={()=>this.getHint()}>
                    Get Hint
                </button>
                <button className='hint-buttons' onClick={()=>this.takeStep()}>
                    Take Step
                </button>
            </div>
            
        );
    }
}
