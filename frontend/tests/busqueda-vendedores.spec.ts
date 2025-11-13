import { test, expect } from '@playwright/test';

const BASE_API = 'http://localhost:5986/api/v1/busqueda/vendedores';

test.describe('Búsqueda de Vendedores - E2E', () => {
  test('debe buscar vendedor por clave CAMT', async ({ request }) => {
    const payload = {
      tipoBusqueda: 'CLA',
      valor: 'CAMT',
      soloActivos: true,
      limite: 501,
    };

    const response = await request.post(BASE_API, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);

    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.vendedores).toBeDefined();
    expect(result.vendedores.length).toBeGreaterThan(0);

    // Verificar vendedor CAMT existe
    const vendedorCAMT = result.vendedores.find((v: any) => v.empleado === 'CAMT');
    expect(vendedorCAMT).toBeDefined();
    expect(vendedorCAMT.nombre).toContain('CARLOS MAGOS TAPIA');
  });

  test('debe buscar por nombre', async ({ request }) => {
    const payload = {
      tipoBusqueda: 'NOM',
      valor: 'CARLOS',
      soloActivos: true,
      limite: 501,
    };

    const response = await request.post(BASE_API, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);

    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.totalResultados).toBeGreaterThan(0);
  });

  test('debe buscar por apellido', async ({ request }) => {
    const payload = {
      tipoBusqueda: 'APE',
      valor: 'MAGOS',
      soloActivos: true,
      limite: 501,
    };

    const response = await request.post(BASE_API, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);

    const result = await response.json();
    expect(result.success).toBe(true);
  });

  test('debe buscar por tipo de comisión exacta', async ({ request }) => {
    const payload = {
      tipoBusqueda: 'COMI',
      valor: 'CA',
      soloActivos: false,
      limite: 501,
    };

    const response = await request.post(BASE_API, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);

    const result = await response.json();
    expect(result.success).toBe(true);

    // Verificar que todos tienen el tipo de comisión buscado
    if (result.vendedores.length > 0) {
      result.vendedores.forEach((v: any) => {
        expect(v.tipocomi).toBe('CA');
      });
    }
  });

  test('debe respetar el filtro soloActivos', async ({ request }) => {
    const payload = {
      tipoBusqueda: 'CLA',
      valor: 'CA',
      soloActivos: true,
      limite: 501,
    };

    const response = await request.post(BASE_API, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);

    const result = await response.json();
    if (result.vendedores.length > 0) {
      result.vendedores.forEach((v: any) => {
        expect(v.activo).toBe(true);
      });
    }
  });

  test('debe retornar mensaje cuando no hay resultados', async ({ request }) => {
    const payload = {
      tipoBusqueda: 'CLA',
      valor: 'XXXXXXXXX',
      soloActivos: true,
      limite: 501,
    };

    const response = await request.post(BASE_API, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);

    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.totalResultados).toBe(0);
    expect(result.vendedores.length).toBe(0);
  });

  test('debe respetar el límite de resultados', async ({ request }) => {
    const payload = {
      tipoBusqueda: 'NOM',
      valor: 'A', // Letra común que debería retornar muchos
      soloActivos: false,
      limite: 10,
    };

    const response = await request.post(BASE_API, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);

    const result = await response.json();
    expect(result.vendedores.length).toBeLessThanOrEqual(10);
  });
});
