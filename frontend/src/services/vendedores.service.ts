import axios from 'axios';
import type {
  BusquedaVendedoresRequest,
  BusquedaVendedoresResponse
} from '@/types/vendedores.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5986';

export class VendedoresApiService {
  private static readonly ENDPOINT = '/api/v1/busqueda/vendedores';

  /**
   * Busca vendedores según los criterios especificados
   */
  static async buscarVendedores(
    request: BusquedaVendedoresRequest
  ): Promise<BusquedaVendedoresResponse> {
    try {
      const response = await axios.post<BusquedaVendedoresResponse>(
        `${API_BASE_URL}${this.ENDPOINT}`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Error al buscar vendedores';
        return {
          success: false,
          message,
          totalResultados: 0,
          vendedores: [],
        };
      }
      throw error;
    }
  }
}
