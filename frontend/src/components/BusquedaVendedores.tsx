import { Search, User, Users, Award, Key, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useBusquedaVendedoresForm } from '@/hooks/useBusquedaVendedoresForm';

const BusquedaVendedores = () => {
  const {
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
  } = useBusquedaVendedoresForm();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isFormValid()) {
      handleBusqueda();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="glass-violeta p-6 rounded-xl border border-violeta-200 shadow-lg">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-violeta-700 to-violeta-900 bg-clip-text text-transparent">
          Búsqueda de Vendedores
        </h2>
        <p className="text-violeta-600 font-medium mt-2">
          Localice vendedores por nombre, apellidos, tipo de comisión o clave
        </p>

        {/* Control Solo Activos */}
        <div className="mt-4 flex items-center space-x-2 glass-violeta p-3 rounded-lg border border-violeta-200 w-fit">
          <Label htmlFor="solo-activos" className="text-sm font-medium text-violeta-700">
            Solo vendedores activos
          </Label>
          <Switch
            id="solo-activos"
            checked={formData.soloActivos}
            onCheckedChange={(checked) => handleFieldChange('soloActivos', checked)}
          />
        </div>
      </div>

      {/* Formulario de Búsqueda */}
      <Card className="glass-violeta border-violeta-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-violeta-900">
            <Search className="h-5 w-5 text-violeta-600" />
            Criterios de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={formData.tipoBusqueda}
            onValueChange={(value) => handleTabChange(value as any)}
            className="w-full"
          >
            <TabsList className="bg-white border border-violeta-300 h-12 w-full grid grid-cols-4">
              <TabsTrigger
                value="NOM"
                className="data-[state=active]:bg-violet-200 data-[state=active]:text-violet-900 data-[state=active]:border-violet-400 data-[state=active]:shadow-sm"
              >
                <User className="h-4 w-4 mr-2" />
                Nombre
              </TabsTrigger>
              <TabsTrigger
                value="APE"
                className="data-[state=active]:bg-violet-200 data-[state=active]:text-violet-900 data-[state=active]:border-violet-400 data-[state=active]:shadow-sm"
              >
                <Users className="h-4 w-4 mr-2" />
                Apellidos
              </TabsTrigger>
              <TabsTrigger
                value="COMI"
                className="data-[state=active]:bg-violet-200 data-[state=active]:text-violet-900 data-[state=active]:border-violet-400 data-[state=active]:shadow-sm"
              >
                <Award className="h-4 w-4 mr-2" />
                Tipo de Comisión
              </TabsTrigger>
              <TabsTrigger
                value="CLA"
                className="data-[state=active]:bg-violet-200 data-[state=active]:text-violet-900 data-[state=active]:border-violet-400 data-[state=active]:shadow-sm"
              >
                <Key className="h-4 w-4 mr-2" />
                Clave
              </TabsTrigger>
            </TabsList>

            {/* Tab Nombre */}
            <TabsContent value="NOM" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-violeta-700">
                  Nombre del vendedor
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ingrese el nombre"
                  value={formData.nombre}
                  onChange={(e) => handleFieldChange('nombre', e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={50}
                  className="uppercase"
                />
              </div>
            </TabsContent>

            {/* Tab Apellido */}
            <TabsContent value="APE" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apellido" className="text-violeta-700">
                  Apellido paterno o materno
                </Label>
                <Input
                  id="apellido"
                  placeholder="Ingrese el apellido"
                  value={formData.apellido}
                  onChange={(e) => handleFieldChange('apellido', e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={50}
                  className="uppercase"
                />
              </div>
            </TabsContent>

            {/* Tab Tipo de Comisión */}
            <TabsContent value="COMI" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipoComision" className="text-violeta-700">
                  Tipo de comisión (código exacto)
                </Label>
                <Input
                  id="tipoComision"
                  placeholder="Ej: CA, CB"
                  value={formData.tipoComision}
                  onChange={(e) => handleFieldChange('tipoComision', e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={50}
                  className="uppercase"
                />
              </div>
            </TabsContent>

            {/* Tab Clave */}
            <TabsContent value="CLA" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clave" className="text-violeta-700">
                  Clave del vendedor
                </Label>
                <Input
                  id="clave"
                  placeholder="Ingrese la clave"
                  value={formData.clave}
                  onChange={(e) => handleFieldChange('clave', e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={11}
                  className="uppercase"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Botones */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleBusqueda}
              disabled={!isFormValid() || loading}
              className="bg-violeta-600 hover:bg-violeta-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleLimpiar}>
              Limpiar
            </Button>
          </div>

          {/* Mensaje */}
          {mensaje && (
            <div className="mt-4 p-3 bg-violeta-50 border border-violeta-200 rounded-lg text-violeta-700">
              {mensaje}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resultados */}
      {resultados.length > 0 && (
        <Card className="glass-violeta border-violeta-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-violeta-900">
              Resultados ({totalResultados} encontrados)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-violeta-200">
                    <th className="text-left p-3 text-violeta-700 font-semibold">Clave</th>
                    <th className="text-left p-3 text-violeta-700 font-semibold">Nombre</th>
                    <th className="text-left p-3 text-violeta-700 font-semibold">Localidad</th>
                    <th className="text-left p-3 text-violeta-700 font-semibold">
                      Tipo Comisión
                    </th>
                    <th className="text-left p-3 text-violeta-700 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((vendedor, index) => (
                    <tr
                      key={vendedor.empleado + index}
                      className="border-b border-violeta-100 hover:bg-violeta-50 transition-colors"
                    >
                      <td className="p-3 text-violeta-900 font-medium">{vendedor.empleado}</td>
                      <td className="p-3 text-violeta-800">{vendedor.nombre}</td>
                      <td className="p-3 text-violeta-700">{vendedor.localidad || '-'}</td>
                      <td className="p-3 text-violeta-700">{vendedor.tipocomi || '-'}</td>
                      <td className="p-3">
                        <Badge
                          variant={vendedor.activo ? 'default' : 'secondary'}
                          className={
                            vendedor.activo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {vendedor.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusquedaVendedores;
