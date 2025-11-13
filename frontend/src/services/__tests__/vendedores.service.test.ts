/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { VendedoresApiService } from '../vendedores.service';
import type { BusquedaVendedoresRequest } from '@/types/vendedores.types';

// Mock de Axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    isAxiosError: vi.fn(),
  },
}));

const axiosMock = axios as any;

describe('VendedoresApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe realizar búsqueda exitosa por clave', async () => {
    const mockRequest: BusquedaVendedoresRequest = {
      tipoBusqueda: 'CLA',
      valor: 'CAMT',
      soloActivos: true,
      limite: 501,
    };

    const mockResponse = {
      success: true,
      message: 'Búsqueda exitosa',
      totalResultados: 1,
      vendedores: [
        {
          empleado: 'CAMT',
          nombre: 'CARLOS MAGOS TAPIA',
          localidad: 'CD. VICTORIA',
          tipocomi: 'CA',
          activo: true,
        },
      ],
    };

    axiosMock.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await VendedoresApiService.buscarVendedores(mockRequest);

    expect(result).toEqual(mockResponse);
    expect(axiosMock.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/busqueda/vendedores'),
      mockRequest,
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('debe manejar error de servidor', async () => {
    const mockRequest: BusquedaVendedoresRequest = {
      tipoBusqueda: 'NOM',
      valor: 'INEXISTENTE',
      soloActivos: true,
    };

    axiosMock.isAxiosError.mockReturnValue(true);
    axiosMock.post.mockRejectedValueOnce({
      response: {
        data: { message: 'Error en búsqueda' },
      },
    });

    const result = await VendedoresApiService.buscarVendedores(mockRequest);

    expect(result.success).toBe(false);
    expect(result.vendedores).toEqual([]);
    expect(result.totalResultados).toBe(0);
  });

  it('debe buscar por nombre', async () => {
    const mockRequest: BusquedaVendedoresRequest = {
      tipoBusqueda: 'NOM',
      valor: 'CARLOS',
      soloActivos: true,
      limite: 501,
    };

    const mockResponse = {
      success: true,
      message: 'Búsqueda exitosa',
      totalResultados: 2,
      vendedores: [
        {
          empleado: 'CAMT',
          nombre: 'CARLOS MAGOS TAPIA',
          localidad: 'CD. VICTORIA',
          tipocomi: 'CA',
          activo: true,
        },
        {
          empleado: 'CARL',
          nombre: 'CARLOS LOPEZ GARCIA',
          localidad: 'MONTERREY',
          tipocomi: 'CB',
          activo: true,
        },
      ],
    };

    axiosMock.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await VendedoresApiService.buscarVendedores(mockRequest);

    expect(result.success).toBe(true);
    expect(result.vendedores.length).toBe(2);
  });

  it('debe buscar por tipo de comisión', async () => {
    const mockRequest: BusquedaVendedoresRequest = {
      tipoBusqueda: 'COMI',
      valor: 'CA',
      soloActivos: false,
    };

    const mockResponse = {
      success: true,
      message: 'Búsqueda exitosa',
      totalResultados: 1,
      vendedores: [
        {
          empleado: 'CAMT',
          nombre: 'CARLOS MAGOS TAPIA',
          localidad: 'CD. VICTORIA',
          tipocomi: 'CA',
          activo: false,
        },
      ],
    };

    axiosMock.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await VendedoresApiService.buscarVendedores(mockRequest);

    expect(result.success).toBe(true);
    expect(result.vendedores[0].activo).toBe(false);
  });
});
