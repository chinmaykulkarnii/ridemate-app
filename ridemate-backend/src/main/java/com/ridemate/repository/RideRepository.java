package com.ridemate.repository;

import com.ridemate.model.Ride;
import com.ridemate.model.enums.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByDriverId(Long driverId);

    @Query("SELECT r FROM Ride r WHERE r.isActive = true " +
            "AND r.origin LIKE %:origin% " +
            "AND r.destination LIKE %:destination% " +
            "AND r.departureTime >= :departureTime " +
            "AND r.availableSeats >= :seatsRequired")
    List<Ride> searchRides(String origin, String destination,
                           LocalDateTime departureTime, Integer seatsRequired);

    @Query("SELECT r FROM Ride r WHERE r.isActive = true " +
            "AND r.origin LIKE %:origin% " +
            "AND r.destination LIKE %:destination% " +
            "AND r.departureTime >= :departureTime " +
            "AND r.availableSeats >= :seatsRequired " +
            "AND r.vehicleType = :vehicleType " +
            "AND r.pricePerSeat <= :maxPrice")
    List<Ride> searchRidesWithFilters(String origin, String destination,
                                      LocalDateTime departureTime, Integer seatsRequired,
                                      VehicleType vehicleType, Double maxPrice);
}