package com.seavector.service;

import com.seavector.dto.DataPoint;
import com.seavector.model.Sector;
import com.seavector.repository.SectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import java.util.*;

@Service
public class ErosionService {

    @Autowired
    private SectorRepository sectorRepository;

    // Obtener un sector por nombre
    public Sector obtenerSector(String nombre) {
        return sectorRepository.findByNombre(nombre)
                .orElseThrow(() -> new EntityNotFoundException("Sector no encontrado: " + nombre));
    }

    // Generar grilla de puntos para la simulación (endpoint original)
    public List<DataPoint> calcularGrilla(int year, String sectorNombre) {
        Sector sector = obtenerSector(sectorNombre);
        double A = sector.getCoeficienteA();
        double B = sector.getCoeficienteB();
        double C = sector.getCoeficienteC();
        double D = sector.getCoeficienteD();

        int steps = 50;
        double min = -10.0;
        double max = 10.0;
        double delta = (max - min) / (steps - 1);
        int tDelta = year - 2024;

        List<DataPoint> grid = new ArrayList<>();
        for (int i = 0; i < steps; i++) {
            for (int j = 0; j < steps; j++) {
                double x = min + i * delta;
                double y = min + j * delta;
                double z = A * x * x + B * y * y + C * tDelta + D;
                double gradX = 2 * A * x;
                double gradY = 2 * B * y;
                grid.add(new DataPoint(x, y, z, gradX, gradY));
            }
        }
        return grid;
    }

    // Gradiente en un punto
    public Map<String, Object> calcularGradiente(String sectorNombre, double x, double y, int year) {
        Sector s = obtenerSector(sectorNombre);
        double A = s.getCoeficienteA();
        double B = s.getCoeficienteB();
        double C = s.getCoeficienteC();

        double Ex = 2 * A * x;
        double Ey = 2 * B * y;
        double Et = C;

        Map<String, Object> grad = new HashMap<>();
        grad.put("gradX", Ex);
        grad.put("gradY", Ey);
        grad.put("gradT", Et);
        grad.put("magnitud", Math.sqrt(Ex * Ex + Ey * Ey));
        return grad;
    }

    // Plano tangente en un punto
    public Map<String, Object> calcularPlanoTangente(String sectorNombre, double x0, double y0, int year) {
        Sector s = obtenerSector(sectorNombre);
        double A = s.getCoeficienteA();
        double B = s.getCoeficienteB();
        double C = s.getCoeficienteC();
        double D = s.getCoeficienteD();

        double E0 = A * x0 * x0 + B * y0 * y0 + C * (year - 2024) + D;
        double Ex = 2 * A * x0;
        double Ey = 2 * B * y0;

        Map<String, Object> plano = new HashMap<>();
        plano.put("E0", E0);
        plano.put("Ex", Ex);
        plano.put("Ey", Ey);
        plano.put("ecuacion", String.format("z = %.4f + %.4f*(x - %.2f) + %.4f*(y - %.2f)", E0, Ex, x0, Ey, y0));
        return plano;
    }

    // Diferencial total
    public Map<String, Object> diferencialTotal(String sectorNombre, double x, double y, int year,
                                                double dx, double dy, int dt) {
        Map<String, Object> grad = calcularGradiente(sectorNombre, x, y, year);
        double Ex = (double) grad.get("gradX");
        double Ey = (double) grad.get("gradY");
        double Et = (double) grad.get("gradT");

        double dE = Ex * dx + Ey * dy + Et * dt;
        Map<String, Object> res = new HashMap<>();
        res.put("dE", dE);
        res.put("interpretacion", String.format("ΔE = %.4f m (pérdida de elevación)", -dE));
        return res;
    }

    // Análisis de sensibilidad (derivadas parciales)
    public Map<String, Object> sensibilidad(String sectorNombre, double x, double y, int year) {
        Sector s = obtenerSector(sectorNombre);
        double A = s.getCoeficienteA();
        double B = s.getCoeficienteB();
        double C = s.getCoeficienteC();

        double dEdx = 2 * A * x;
        double dEdy = 2 * B * y;
        double dEdt = C;

        Map<String, Object> sens = new HashMap<>();
        sens.put("dEdx", dEdx);
        sens.put("dEdy", dEdy);
        sens.put("dEdt", dEdt);
        sens.put("interpretacion", Math.abs(dEdx) > Math.abs(dEdy) ?
                "La tasa de erosión es más sensible a la coordenada x (dirección longitudinal)" :
                "La tasa de erosión es más sensible a la coordenada y (dirección perpendicular a la costa)");
        return sens;
    }
}