import React from 'react';
// import './MilkStatusCard.css'; // Import the CSS file for custom styles

function MilkStatusCard({ date, shift, rate, liter }) {
  return (
    <div className="card milk-status-card shadow-sm mb-3">
      <div className="card-body">
        <p className="card-text text-start">
          <strong>Date:</strong> {date} &nbsp; 
          <strong>Shift:</strong> {shift} &nbsp; 
          <strong>Rate:</strong> ₹{rate} &nbsp; 
          <strong>Liters:</strong> {liter} &nbsp; 
          <strong>Final Amount:</strong> ₹{(rate * liter).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default MilkStatusCard;
