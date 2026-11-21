import React, { useState } from "react";
import "./App.css";

const LADDERS = { 2: 38, 7: 14, 8: 31, 15: 26, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 78: 98, 87: 94 };
const SNAKES = { 16: 6, 46: 25, 49: 11, 62: 19, 64: 60, 74: 53, 89: 68, 92: 88, 95: 75, 99: 80 };

const PLAYERS = [
  { id: 1, name: "Player 1", label: "P1", color: "p1" },
  { id: 2, name: "Player 2", label: "P2", color: "p2" },
];

// Rows go bottom -> top; odd rows (from the bottom) run left->right,
// even rows right->left. Rendered top row first (100 ... 91).
function buildSquares() {
  const rows = [];
  for (let r = 9; r >= 0; r--) {
    const row = [];
    for (let c = 0; c < 10; c++) {
      const n = r % 2 === 0 ? r * 10 + c + 1 : r * 10 + (10 - c);
      row.push(n);
    }
    rows.push(row);
  }
  return rows.flat();
}
const SQUARES = buildSquares();

export default function App() {
  const [positions, setPositions] = useState([0, 0]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState(null);
  const [winner, setWinner] = useState(null);

  const rollDice = () => {
    if (winner !== null) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);

    let next = positions[turn] + roll;
    if (next > 100) next = positions[turn]; // exact 100 required
    else if (LADDERS[next]) next = LADDERS[next];
    else if (SNAKES[next]) next = SNAKES[next];

    const updated = [...positions];
    updated[turn] = next;
    setPositions(updated);

    if (next === 100) setWinner(turn);
    else setTurn((turn + 1) % 2);
  };

  const reset = () => {
    setPositions([0, 0]);
    setTurn(0);
    setDice(null);
    setWinner(null);
  };

  const tokensAt = (n) =>
    PLAYERS.filter((_, i) => (positions[i] === n) || (n === 1 && positions[i] === 0));

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">Snake &amp; Ladders</h1>

        <div className="topbar">
          {winner === null ? (
            <div className="turn">
              <span>Turn:</span>
              <span className={`pill ${PLAYERS[turn].color}`}>{PLAYERS[turn].label}</span>
            </div>
          ) : (
            <div className="results">
              <span className="win">🏆 {PLAYERS[winner].name} wins!</span>
              <span className="lose">
                🎲 {PLAYERS[1 - winner].name} loses
              </span>
            </div>
          )}
          <div className="legend">
            <span><i className="dot p1" /> P1</span>
            <span><i className="dot p2" /> P2</span>
          </div>
        </div>

        <div className="board">
          {SQUARES.map((n) => (
            <div className="cell" key={n}>
              <div className="cell-head">
                <span className="num">{n}</span>
                {LADDERS[n] && <span className="tag ladder">▲ {LADDERS[n]}</span>}
                {SNAKES[n] && <span className="tag snake">▼ {SNAKES[n]}</span>}
              </div>
              <div className="tokens">
                {tokensAt(n).map((p) => (
                  <span key={p.id} className={`token ${p.color}`}>{p.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="actions">
          <button className="btn roll" onClick={rollDice} disabled={winner !== null}>
            🎲 Roll Dice{dice !== null ? ` (${dice})` : ""}
          </button>
          <button className="btn reset" onClick={reset}>Reset</button>
        </div>

        <p className="footer">
          Exact 100 is required to win. Land on a <b>ladder</b> to climb up, a <b>snake</b> to slide down.
        </p>
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import "./App.css";

// export default function App() {
//   const [digits, setDigits] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
//   const [dragIndex, setDragIndex] = useState(null);
//   const [overIndex, setOverIndex] = useState(null);

//   const handleDragStart = (e, index) => {
//     setDragIndex(index);
//     e.dataTransfer.effectAllowed = "move";
//     e.dataTransfer.setData("text/plain", String(index));
//   };

//   const handleDragOver = (e, index) => {
//     e.preventDefault(); // allow drop
//     e.dataTransfer.dropEffect = "move";
//     if (overIndex !== index) setOverIndex(index);
//   };

//   const handleDrop = (e, index) => {
//     e.preventDefault();
//     if (dragIndex === null || dragIndex === index) return reset();
//     // Shift (not swap): remove the dragged item and insert it at the target.
//     setDigits((prev) => {
//       const next = [...prev];
//       const [moved] = next.splice(dragIndex, 1);
//       next.splice(index, 0, moved);
//       return next;
//     });
//     reset();
//   };

//   const reset = () => {
//     setDragIndex(null);
//     setOverIndex(null);
//   };

//   return (
//     <div className="app">
//       <div className="card">
//         <h1 className="title">Drag &amp; Drop Digits</h1>
//         <p className="subtitle">Drag the boxes to reorder the digits 0–9.</p>

//         <div className="grid">
//           {digits.map((d, index) => {
//             const classes = ["box"];
//             if (index === dragIndex) classes.push("dragging");
//             if (index === overIndex && index !== dragIndex) classes.push("over");
//             return (
//               <div
//                 key={d}
//                 className={classes.join(" ")}
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, index)}
//                 onDragOver={(e) => handleDragOver(e, index)}
//                 onDrop={(e) => handleDrop(e, index)}
//                 onDragEnd={reset}
//               >
//                 {d}
//               </div>
//             );
//           })}
//         </div>

//         <p className="tip">
//           Tip: Try reordering to make <code>0123456789</code> or reverse it!
//         </p>
//       </div>
//     </div>
//   );
// }