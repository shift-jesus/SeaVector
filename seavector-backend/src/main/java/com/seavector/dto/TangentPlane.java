package com.seavector.dto;

public class TangentPlane {
    private double E0;
    private double Ex;
    private double Ey;
    private double Et;
    private double x0;
    private double y0;
    private int t0;

    public TangentPlane(double E0, double Ex, double Ey, double Et, double x0, double y0, int t0) {
        this.E0 = E0;
        this.Ex = Ex;
        this.Ey = Ey;
        this.Et = Et;
        this.x0 = x0;
        this.y0 = y0;
        this.t0 = t0;
    }

    // Getters
    public double getE0() { return E0; }
    public double getEx() { return Ex; }
    public double getEy() { return Ey; }
    public double getEt() { return Et; }
    public double getX0() { return x0; }
    public double getY0() { return y0; }
    public int getT0() { return t0; }

    // Ecuación del plano: E(x,y,t) = E0 + Ex*(x-x0) + Ey*(y-y0) + Et*(t-t0)
    public double evaluate(double x, double y, int t) {
        return E0 + Ex * (x - x0) + Ey * (y - y0) + Et * (t - t0);
    }
}