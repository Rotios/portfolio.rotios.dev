
import React, { Component } from "react"
import './Minesweeper.css'
import {Button} from "@heroui/button";


export default class Cell extends Component {
    getChar() {
        if (this.props.isFlagged) {
            return "🚩"
        }

        if (this.props.isHidden) {
            return ""
        }

        if (this.props.isMine) {
            return "💣"
        }

        return this.props.value
    }

    render() {
        let cName = (this.props.isHidden) ? "cell hidden" : "cell"

        cName += this.props.highlight
 
        return (
            <Button className={cName} isIconOnly onClick={this.props.onClick} onContextMenu={this.props.onCtxMenu}>
                {this.getChar()}
            </Button>
        );
    }
  }
  