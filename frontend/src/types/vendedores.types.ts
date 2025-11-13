/**
 * Types para el módulo de búsqueda de vendedores
 */

export type TipoBusquedaVendedor = "NOM" | "APE" | "COMI" | "CLA";

export interface BusquedaVendedoresRequest {
  tipoBusqueda: TipoBusquedaVendedor;
  valor: string;
  soloActivos: boolean;
  limite?: number;
}

export interface VendedorResultado {
  empleado: string;
  nombre: string;
  localidad: string;
  tipocomi: string;
  activo: boolean;
}

export interface BusquedaVendedoresResponse {
  success: boolean;
  message: string;
  totalResultados: number;
  vendedores: VendedorResultado[];
}

export interface FormDataVendedores {
  tipoBusqueda: TipoBusquedaVendedor;
  nombre: string;
  apellido: string;
  tipoComision: string;
  clave: string;
  soloActivos: boolean;
}
