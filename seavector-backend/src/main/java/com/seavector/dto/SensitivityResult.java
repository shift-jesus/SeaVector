package com.seavector.dto;

public class SensitivityResult {
    private double sensitivityX;
    private double sensitivityY;
    private double sensitivityT;
    private double originalE;

    public SensitivityResult(double sensitivityX, double sensitivityY, double sensitivityT, double originalE) {
        this.sensitivityX = sensitivityX;
        this.sensitivityY = sensitivityY;
        this.sensitivityT = sensitivityT;
        this.originalE = originalE;
    }

    // Getters...
    public double getSensitivityX() { return sensitivityX; }
    public double getSensitivityY() { return sensitivityY; }
    public double getSensitivityT() { return sensitivityT; }
    public double getOriginalE() { return originalE; }
}