package com.seavector.repository;

import com.seavector.model.Sector;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SectorRepository extends JpaRepository<Sector, Long> {
    Optional<Sector> findByNombre(String nombre);
}