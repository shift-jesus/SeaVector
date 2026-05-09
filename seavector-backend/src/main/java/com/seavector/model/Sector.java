package com.seavector.model;

import jakarta.persistence.*;

@Entity
@Table(name = "SECTORES") // Asegura que el nombre de la tabla es correcto
public class Sector {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", unique = true, nullable = false)
    private String nombre;

    @Column(name = "coeficiente_a", nullable = false)
    private Double coeficienteA;

    @Column(name = "coeficiente_b", nullable = false)
    private Double coeficienteB;

    @Column(name = "coeficiente_c", nullable = false)
    private Double coeficienteC;

    @Column(name = "coeficiente_d", nullable = false)
    private Double coeficienteD;

    // Constructores, Getters y Setters (sin cambios)
    public Sector() {}

    public Sector(String nombre, Double coeficienteA, Double coeficienteB, Double coeficienteC, Double coeficienteD) {
        this.nombre = nombre;
        this.coeficienteA = coeficienteA;
        this.coeficienteB = coeficienteB;
        this.coeficienteC = coeficienteC;
        this.coeficienteD = coeficienteD;
    }

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