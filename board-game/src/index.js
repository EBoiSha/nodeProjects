import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square key={i}
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		const board_size = 3;
		let square = 0;
		const board = [];

		for(let i = 0; i < board_size; i++) {
			this.board = board.push(<div></div>);
			for(let i2 = 0; i2 < board_size; i2++) {
				this.board = board.push(this.renderSquare(square));
				square++;
			}
		}

		return (
			<div>
				{board}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
					pos: [0, 0],
					stepNumber_old: 0
				}
			],
			stepNumber: 0,
			setBold: true,
			xIsNext: true
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const column = (i % 3) + 1;
		const row = Math.floor(i / 3 + 1);
		const pos = [column, row];

		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([
				{
					squares: squares,
					pos: pos,
					stepNumber_old: history.length
				}
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0
		});
	}

	render() {
		const history = this.state.history;
		const current = history[history.length - 1];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			if (this.state.stepNumber === history[move].stepNumber_old) {
				this.setBold = true;
			} else {
				this.setBold = false;
			}

			const buttonStyle = {
				fontWeight: this.setBold ? "bold" : "normal"
			};

			const desc = move
				? "Go to move #" + move + "You played on: "
				: "Go to game start: Play on:";

			return (
				<li key={move}>
					<button
						style={buttonStyle}
						onClick={() => {
							this.jumpTo(move);
						}}
					>
						{desc}{" "}
						{"Column: " +
							history[move].pos[0] +
							" Row: " +
							history[move].pos[1]}
					</button>
				</li>
			);
		});

		let status;
		if (winner) {
			status = "Winner: " + winner;
		} else {
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={i => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			return squares[a];
		}
	}
	return null;
}
