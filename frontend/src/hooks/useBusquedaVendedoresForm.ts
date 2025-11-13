import { useState } from 'react';
import { VendedoresApiService } from '@/services/vendedores.service';
import type {
  FormDataVendedores,
  TipoBusquedaVendedor,
  VendedorResultado
} from '@/types/vendedores.types';

const LIMITE_DEFAULT = 501;

export const useBusquedaVendedoresForm = () => {
  const [formData, setFormData] = useState<FormDataVendedores>({
    tipoBusqueda: 'CLA',
    nombre: '',
    apellido: '',
    tipoComision: '',
    clave: '',
    soloActivos: true,
  });

  const [resultados, setResultados] = useState<VendedorResultado[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResultados, setTotalResultados] = useState(0);
  const [mensaje, setMensaje] = useState('');

  const handleTabChange = (tab: TipoBusquedaVendedor) => {
    setFormData((prev) => ({ ...prev, tipoBusqueda: tab }));
  };

  const handleFieldChange = (field: keyof FormDataVendedores, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getValorBusqueda = (): string => {
    switch (formData.tipoBusqueda) {
      case 'NOM':
        return formData.nombre.toUpperCase();
      case 'APE':
        return formData.apellido.toUpperCase();
      case 'COMI':
        return formData.tipoComision.toUpperCase();
      case 'CLA':
        return formData.clave.toUpperCase();
      default:
        return '';
    }
  };

  const isFormValid = (): boolean => {
    const valor = getValorBusqueda();
    return valor.trim().length > 0;
  };

  const handleBusqueda = async () => {
    if (!isFormValid()) {
      setMensaje('Debe ingresar un valor para buscar');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const valor = getValorBusqueda();
      const response = await VendedoresApiService.buscarVendedores({
        tipoBusqueda: formData.tipoBusqueda,
        valor,
        soloActivos: formData.soloActivos,
        limite: LIMITE_DEFAULT,
      });

      if (response.success) {
        setResultados(response.vendedores);
        setTotalResultados(response.totalResultados);

        if (response.vendedores.length === 0) {
          setMensaje('No se encontraron vendedores con los criterios especificados');
        } else if (response.totalResultados >= LIMITE_DEFAULT) {
          setMensaje(
            `Se alcanzó el límite de ${LIMITE_DEFAULT} resultados. Considere refinar su búsqueda.`
          );
        }
      } else {
        setMensaje(response.message || 'Error al realizar la búsqueda');
        setResultados([]);
        setTotalResultados(0);
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setMensaje('Error al comunicarse con el servidor');
      setResultados([]);
      setTotalResultados(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setFormData({
      tipoBusqueda: formData.tipoBusqueda,
      nombre: '',
      apellido: '',
      tipoComision: '',
      clave: '',
      soloActivos: formData.soloActivos,
    });
    setResultados([]);
    setTotalResultados(0);
    setMensaje('');
  };

  return {
    formData,
    resultados,
    loading,
    totalResultados,
    mensaje,
    handleTabChange,
    handleFieldChange,
    handleBusqueda,
    handleLimpiar,
    isFormValid,
  };
};
