package com.seavector.controller;

import com.seavector.dto.DataPoint;
import com.seavector.service.ErosionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/simulation")
@CrossOrigin(origins = "http://localhost:3000")
public class ErosionController {

    @Autowired
    private ErosionService erosionService;

    @PostMapping("/grid")
    public List<DataPoint> getGrid(@RequestBody Map<String, Object> payload) {
        int year = (int) payload.get("year");
        String sector = (String) payload.get("sector");
        return erosionService.calcularGrilla(year, sector);
    }

    @GetMapping("/gradiente")
    public Map<String, Object> getGradiente(@RequestParam String sector,
                                            @RequestParam double x,
                                            @RequestParam double y,
                                            @RequestParam int year) {
        return erosionService.calcularGradiente(sector, x, y, year);
    }

    @GetMapping("/tangente")
    public Map<String, Object> getPlanoTangente(@RequestParam String sector,
                                                @RequestParam double x,
                                                @RequestParam double y,
                                                @RequestParam int year) {
        return erosionService.calcularPlanoTangente(sector, x, y, year);
    }

    @GetMapping("/diferencial")
    public Map<String, Object> getDiferencial(@RequestParam String sector,
                                              @RequestParam double x,
                                              @RequestParam double y,
                                              @RequestParam int year,
                                              @RequestParam double dx,
                                              @RequestParam double dy,
                                              @RequestParam int dt) {
        return erosionService.diferencialTotal(sector, x, y, year, dx, dy, dt);
    }

    @GetMapping("/sensibilidad")
    public Map<String, Object> getSensibilidad(@RequestParam String sector,
                                               @RequestParam double x,
                                               @RequestParam double y,
                                               @RequestParam int year) {
        return erosionService.sensibilidad(sector, x, y, year);
    }
}