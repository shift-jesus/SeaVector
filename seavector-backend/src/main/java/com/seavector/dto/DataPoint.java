package com.seavector.dto;

public class DataPoint {
    private double x;
    private double y;
    private double z;
    private double gradX;
    private double gradY;

    public DataPoint(double x, double y, double z, double gradX, double gradY) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.gradX = gradX;
        this.gradY = gradY;
    }

    // Getters (necesarios para JSON)
    public double getX() { return x; }
    public double getY() { return y; }
    public double getZ() { return z; }
    public double getGradX() { return gradX; }
    public double getGradY() { return gradY; }
}