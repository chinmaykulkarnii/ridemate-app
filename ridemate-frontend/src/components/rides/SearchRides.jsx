import React, { useState } from 'react';
import { rideService } from '../../services/rideService';
import RideCard from './RideCard';

const SearchRides = () => {
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    departureTime: '',
    seatsRequired: 1,
    vehicleType: '',
    maxPrice: ''
  });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const searchFilters = {
        origin: filters.origin,
        destination: filters.destination,
        departureTime: filters.departureTime,
        seatsRequired: filters.seatsRequired
      };

      if (filters.vehicleType) searchFilters.vehicleType = filters.vehicleType;
      if (filters.maxPrice) searchFilters.maxPrice = filters.maxPrice;

      const data = await rideService.searchRides(searchFilters);
      setRides(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2>Search for Rides</h2>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-row">
          <div className="form-group">
            <label>From</label>
            <input
              type="text"
              name="origin"
              value={filters.origin}
              onChange={handleChange}
              required
              placeholder="Enter origin"
            />
          </div>

          <div className="form-group">
            <label>To</label>
            <input
              type="text"
              name="destination"
              value={filters.destination}
              onChange={handleChange}
              required
              placeholder="Enter destination"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Departure Date & Time</label>
            <input
              type="datetime-local"
              name="departureTime"
              value={filters.departureTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Seats Required</label>
            <input
              type="number"
              name="seatsRequired"
              value={filters.seatsRequired}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Vehicle Type</label>
            <select name="vehicleType" value={filters.vehicleType} onChange={handleChange}>
              <option value="">All</option>
              <option value="BIKE">Bike</option>
              <option value="CAR">Car</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Price per Seat</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Any"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search Rides'}
        </button>
      </form>

      {searched && (
        <div className="search-results">
          <h3>Search Results ({rides.length})</h3>
          {rides.length > 0 ? (
            <div className="rides-grid">
              {rides.map(ride => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          ) : (
            <p className="no-results">No rides found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchRides;