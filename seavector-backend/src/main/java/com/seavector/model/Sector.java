package com.seavector.model;

import javax.persistence.*;

@Entity
@Table(name = "SECTORES")
public class Sector {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nombre;

    private Double coeficienteA;
    private Double coeficienteB;
    private Double coeficienteC;
    private Double coeficienteD;

    // Constructores
    public Sector() {}

    public Sector(String nombre, Double coeficienteA, Double coeficienteB, Double coeficienteC, Double coeficienteD) {
        this.nombre = nombre;
        this.coeficienteA = coeficienteA;
        this.coeficienteB = coeficienteB;
        this.coeficienteC = coeficienteC;
        this.coeficienteD = coeficienteD;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Double getCoeficienteA() { return coeficienteA; }
    public void setCoeficienteA(Double coeficienteA) { this.coeficienteA = coeficienteA; }
    public Double getCoeficienteB() { return coeficienteB; }
    public void setCoeficienteB(Double coeficienteB) { this.coeficienteB = coeficienteB; }
    public Double getCoeficienteC() { return coeficienteC; }
    public void setCoeficienteC(Double coeficienteC) { this.coeficienteC = coeficienteC; }
    public Double getCoeficienteD() { return coeficienteD; }
    public void setCoeficienteD(Double coeficienteD) { this.coeficienteD = coeficienteD; }
}