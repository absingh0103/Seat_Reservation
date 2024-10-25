import React, { useEffect, useState } from "react";
import axios from "axios";
import t1 from './assets/t2.jpg';

function App() {

  const [seats, setSeats] = useState([]);
  const [numSeats, setNumSeats] = useState(1);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [error, setError] = useState('');

  // Fetch Seat Details on Initial Render
  useEffect(() => {
      fetchSeats();
  }, []);

  // Fetch all seat data from the server
  const fetchSeats = async () => {
      try {
          const response = await axios.get('/seats/available');
          setSeats(response.data);
      } catch (err) {
          console.error("Error fetching seat data:", err);
      }
  };

  // Book Seats
  const bookSeats = async () => {
      try {
          const response = await axios.post('/seats/book-seats', { numSeats });
          setBookedSeats(response.data.bookedSeats);
          setError('');
          fetchSeats(); // Refresh Seats after booking To Update The Ui
      } catch (err) {
          setError(err.response?.data?.message || "Error booking seats");
      }
  };

  // Clear all seats
  const clearSeats = async () => {
      try {
          await axios.post('/seats/clear-seats');
          fetchSeats(); // Refresh seats after clearing All The Seats
          setBookedSeats([]);
          setError('');
      } catch (err) {
          console.error("Error clearing seats:", err);
      }
  };

  return (
    <div className="flex flex-col items-center p-5  min-h-screen backgrong" style={{
      backgroundImage:`url(${t1})`,
      backgroundSize: 'cover'
  }}>
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Train Seat Reservation
      </h1>

      <div className="flex items-center mb-6 space-x-4">
        <label className="text-lg">Number of Seats:</label>
        <input
          type="number"
          min="1"
          max="7"
          value={numSeats}
          onChange={(e) => setNumSeats(Number(e.target.value))}
          className="border border-gray-300 rounded p-2 w-16 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={bookSeats}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-5 py-2 shadow-md transition duration-150 ease-in-out"
        >
          Book Seats
        </button>
        <button
          onClick={clearSeats}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-5 py-2 shadow-md transition duration-150 ease-in-out"
        >
          Clear Seats
        </button>
      </div>

      {error && <p className="text-red-500 mb-2 font-bold">{error}</p>}
      {bookedSeats.length > 0 && (
        <p className="text-green-600 mb-2 font-bold">
          Seats booked: {bookedSeats.join(", ")}
        </p>
      )}

      <div className="grid grid-cols-7 gap-2 mt-4 ">
        {seats.map((seat, index) => (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center border rounded-lg ${
              seat.isBooked ? "bg-red-500" : "bg-green-500"
            } text-white font-bold`}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
