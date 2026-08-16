'use client'

import React, { Component } from "react"
import './Minesweeper.css'
import Board from './Board'
import { Button } from "@heroui/button"

const DEFAULT_WIDTH = 10
const DEFAULT_HEIGHT = 10
const DEFAULT_MINES = 12
const MIN_DIM = 5
const MAX_DIM = 40

export default class Minesweeper extends Component {
    constructor(props) {
        super(props);

        this.state = {
          isHidden: true,
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
          numMines: DEFAULT_MINES,
          widthInput: String(DEFAULT_WIDTH),
          heightInput: String(DEFAULT_HEIGHT),
          minesInput: String(DEFAULT_MINES),
          fullscreen: false,
          gameId: 0
        };

        this.applySettings = this.applySettings.bind(this)
        this.openFullscreen = this.openFullscreen.bind(this)
        this.closeFullscreen = this.closeFullscreen.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown)
        document.body.style.overflow = ''
    }

    // A first click always clears its own 3x3 neighborhood, so that's the
    // most mines a board can ever hold while still guaranteeing a safe open.
    maxMines(width, height) {
        return Math.max(1, (width * height) - 9)
    }

    applySettings(e) {
        e.preventDefault()

        let width = Math.min(MAX_DIM, Math.max(MIN_DIM, parseInt(this.state.widthInput, 10) || DEFAULT_WIDTH))
        let height = Math.min(MAX_DIM, Math.max(MIN_DIM, parseInt(this.state.heightInput, 10) || DEFAULT_HEIGHT))
        let numMines = Math.min(this.maxMines(width, height), Math.max(1, parseInt(this.state.minesInput, 10) || DEFAULT_MINES))

        this.setState((prevState) => ({
            width, height, numMines,
            widthInput: String(width),
            heightInput: String(height),
            minesInput: String(numMines),
            gameId: prevState.gameId + 1
        }))
    }

    openFullscreen() {
        document.addEventListener('keydown', this.handleKeyDown)
        document.body.style.overflow = 'hidden'
        this.setState({fullscreen: true})
    }

    closeFullscreen() {
        document.removeEventListener('keydown', this.handleKeyDown)
        document.body.style.overflow = ''
        this.setState({fullscreen: false})
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.closeFullscreen()
        }
    }

    render() {
      let { width, height, numMines, fullscreen, gameId } = this.state
      let gameClassName = "game background--hidden" + (fullscreen ? " minesweeper-fullscreen" : "")

      return (
          <div className={gameClassName}>
            {fullscreen &&
                <button type="button" className="minesweeper-fullscreen-close"
                    onClick={this.closeFullscreen} aria-label="Exit fullscreen">
                    &times;
                </button>
            }
            <br/>
            <form className="board-settings" onSubmit={this.applySettings}>
                <label htmlFor="board-width">Width:</label>
                <input type="text" id="board-width" placeholder="Number"
                    value={this.state.widthInput}
                    onChange={(e) => this.setState({widthInput: e.target.value})} />

                <label htmlFor="board-height">Height:</label>
                <input type="text" id="board-height" placeholder="Number"
                    value={this.state.heightInput}
                    onChange={(e) => this.setState({heightInput: e.target.value})} />

                <label htmlFor="board-mines">Mines:</label>
                <input type="text" id="board-mines" placeholder="Number"
                    value={this.state.minesInput}
                    onChange={(e) => this.setState({minesInput: e.target.value})} />

                <input type="submit" value="New Game" />

                {!fullscreen &&
                    <Button className="hint-buttons" type="button" onClick={this.openFullscreen}>
                        Fullscreen
                    </Button>
                }
            </form>
              <Board key={`${width}-${height}-${numMines}-${gameId}`} height={height} width={width} numMines={numMines}></Board>
          </div>
      );
    }
  }
