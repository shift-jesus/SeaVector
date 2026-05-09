package com.seavector.service;

import com.seavector.dto.DataPoint;
import com.seavector.model.Sector;
import com.seavector.repository.SectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ErosionService {

    @Autowired
    private SectorRepository sectorRepository;

    public List<DataPoint> calcularGrilla(int year, String sectorNombre) {
        Sector sector = sectorRepository.findByNombre(sectorNombre)
                .orElseThrow(() -> new EntityNotFoundException("Sector no encontrado: " + sectorNombre));

        double A = sector.getCoeficienteA();
        double B = sector.getCoeficienteB();
        double C = sector.getCoeficienteC();
        double D = sector.getCoeficienteD();

        int steps = 50;
        double min = -10.0;
        double max = 10.0;

        List<DataPoint> grid = new ArrayList<>();
        double delta = (max - min) / (steps - 1);

        int tDelta = year - 2024; // años desde base

        for (int i = 0; i < steps; i++) {
            for (int j = 0; j < steps; j++) {
                double x = min + i * delta;
                double y = min + j * delta;

                // Modelo cuadrático: E(x,y,t) = A*x² + B*y² + C*t + D
                double z = A * x * x + B * y * y + C * tDelta + D;

                // Gradiente analítico: ∇E = (2A x , 2B y)
                double gradX = 2 * A * x;
                double gradY = 2 * B * y;

                grid.add(new DataPoint(x, y, z, gradX, gradY));
            }
        }
        return grid;
    }
}