package com.seavector.controller;

import com.seavector.dto.DataPoint;
import com.seavector.service.ErosionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/simulation")
@CrossOrigin(origins = "http://localhost:3000") // permitir frontend React
public class ErosionController {

    @Autowired
    private ErosionService erosionService;

    @PostMapping("/grid")
    public List<DataPoint> getGrid(@RequestBody Map<String, Object> payload) {
        int year = (int) payload.get("year");
        String sector = (String) payload.get("sector");
        return erosionService.calcularGrilla(year, sector);
    }
}