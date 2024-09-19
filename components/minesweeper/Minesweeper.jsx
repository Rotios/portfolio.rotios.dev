'use client'

import React, { Component } from "react"
import './Minesweeper.css'
import Board from './Board'

export default class Minesweeper extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          isHidden: true
        };
    }

    render() {
      return (
          <div className="game background--hidden">
            <br/>
              <Board height={10} width={10} numMines={12}></Board>
          </div>
      );
    }
  }
  