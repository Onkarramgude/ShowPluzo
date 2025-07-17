// src/SeatSelector.js
import React, { useState, useEffect } from "react";
import "./index.css";

const ROWS = 10;
const COLUMNS = 10;
const MAX_SELECTION = 100;

const seatRowRange = {
  front: [0, 2],
  middle: [3, 6],
  back: [7, 9],
};

function SeatSelector({ onSelectionChange, bookedSeats = [], seatType }) {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const isBooked = (seatId) => bookedSeats.includes(seatId);

  const toggleSeat = (row, col) => {
    const seatId = `${row}-${col}`;
    const [minRow, maxRow] = seatRowRange[seatType] || [0, 9];

    if (row < minRow || row > maxRow || isBooked(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((s) => s !== seatId);
      } else {
        if (prev.length >= MAX_SELECTION) {
          alert(`Only ${MAX_SELECTION} seats can be selected.`);
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  // Clear seat selection when seat type changes
  useEffect(() => {
    setSelectedSeats([]);
  }, [seatType]);

  // Notify parent of selected seats
  useEffect(() => {
    onSelectionChange(selectedSeats);
  }, [selectedSeats, onSelectionChange]);

  return (
    <div className="seat-grid">
      {Array.from({ length: ROWS }).map((_, row) => (
        <div className="seat-row" key={row}>
          {Array.from({ length: COLUMNS }).map((_, col) => {
            const seatId = `${row}-${col}`;
            const selected = selectedSeats.includes(seatId);
            const booked = isBooked(seatId);
            const [minRow, maxRow] = seatRowRange[seatType] || [0, 9];
            const isValid = row >= minRow && row <= maxRow;
            const seatLabel = `${String.fromCharCode(65 + row)}${col + 1}`;

            return (
              <div
                key={seatId}
                role="button"
                aria-label={`Seat ${seatLabel}`}
                aria-pressed={selected}
                aria-disabled={booked || !isValid}
                tabIndex={0}
                className={`seat ${selected ? "selected" : ""} ${booked ? "booked" : ""} ${!isValid ? "disabled" : ""}`}
                onClick={() => toggleSeat(row, col)}
              >
                {seatLabel}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default SeatSelector;
