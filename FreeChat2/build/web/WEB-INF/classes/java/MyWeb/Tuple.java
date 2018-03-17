/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package MyWeb;

/**
 *
 * @author SoftwareEngineer
 */
public class Tuple<X, Y> { 
  public final X x; 
  public final Y y; 
  public Tuple(X x, Y y) { 
       GuarbageWatch.add(this) ;
    this.x = x; 
    this.y = y; 
  } 
} 
