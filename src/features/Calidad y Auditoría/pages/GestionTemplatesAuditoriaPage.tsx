import { useState, useEffect } from 'react';
import { Plus, RefreshCw, ArrowLeft, ClipboardList, Loader2, Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  obtenerPlantillasAuditoria,
  crearPlantillaAuditoria,
  actualizarPlantillaAuditoria,
  desactivarPlantillaAuditoria,
  AuditTemplate,
  CreateAuditTemplateRequest,
} from '../api/auditTemplatesApi';
import AuditTemplateCard from '../components/AuditTemplateCard';
import ChecklistTemplateBuilder from '../components/ChecklistTemplateBuilder';

interface GestionTemplatesAuditoriaPageProps {
  onVolver?: () => void;
}

export default function GestionTemplatesAuditoriaPage({
  onVolver,
}: GestionTemplatesAuditoriaPageProps) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<AuditTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AuditTemplate | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = user?.role === 'director' || user?.role === 'admin';

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const cargarPlantillas = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Obtener clinicId del contexto de usuario
      const plantillas = await obtenerPlantillasAuditoria();
      setTemplates(plantillas);
    } catch (err: any) {
      setError(err.message || 'Error al cargar plantillas');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarPlantillas();
    setRefreshing(false);
  };

  const handleCreate = async (templateData: CreateAuditTemplateRequest) => {
    try {
      const nuevaPlantilla = await crearPlantillaAuditoria(templateData);
      setTemplates([...templates, nuevaPlantilla]);
      setShowBuilder(false);
      setEditingTemplate(null);
    } catch (err: any) {
      alert(err.message || 'Error al crear plantilla');
    }
  };

  const handleEdit = (template: AuditTemplate) => {
    setEditingTemplate(template);
    setShowBuilder(true);
  };

  const handleUpdate = async (templateData: CreateAuditTemplateRequest) => {
    if (!editingTemplate?._id) return;

    try {
      const plantillaActualizada = await actualizarPlantillaAuditoria(
        editingTemplate._id,
        templateData
      );
      setTemplates(
        templates.map((t) => (t._id === plantillaActualizada._id ? plantillaActualizada : t))
      );
      setShowBuilder(false);
      setEditingTemplate(null);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar plantilla');
    }
  };

  const handleDelete = async (templateId: string) => {
    try {
      await desactivarPlantillaAuditoria(templateId);
      setTemplates(templates.filter((t) => t._id !== templateId));
    } catch (err: any) {
      alert(err.message || 'Error al eliminar plantilla');
    }
  };

  const handleArchive = async (templateId: string) => {
    try {
      const template = templates.find((t) => t._id === templateId);
      if (!template) return;

      const plantillaActualizada = await actualizarPlantillaAuditoria(templateId, {
        isActive: !template.isActive,
      });
      setTemplates(
        templates.map((t) => (t._id === plantillaActualizada._id ? plantillaActualizada : t))
      );
    } catch (err: any) {
      alert(err.message || 'Error al archivar plantilla');
    }
  };

  if (showBuilder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <ClipboardList size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {editingTemplate ? 'Editar Plantilla' : 'Nueva Plantilla de Auditoría'}
                  </h1>
                  <p className="text-gray-600">
                    {editingTemplate 
                      ? 'Modifica los detalles de la plantilla de auditoría'
                      : 'Crea una nueva plantilla de checklist para auditorías clínicas'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="max-w-5xl mx-auto">
            <ChecklistTemplateBuilder
              initialData={
                editingTemplate
                  ? {
                      name: editingTemplate.name,
                      description: editingTemplate.description,
                      items: editingTemplate.items,
                    }
                  : undefined
              }
              onSave={editingTemplate ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowBuilder(false);
                setEditingTemplate(null);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                {onVolver && (
                  <button
                    onClick={onVolver}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                {/* Icono con contenedor */}
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <ClipboardList size={24} className="text-blue-600" />
                </div>
                
                {/* Título y descripción */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Gestión de Plantillas de Auditoría
                  </h1>
                  <p className="text-gray-600">
                    Crea y gestiona plantillas de checklists para auditorías clínicas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Toolbar Superior */}
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-xl ring-1 ring-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
                Actualizar
              </button>
              {isAdmin && (
                <button
                  onClick={() => setShowBuilder(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
                >
                  <Plus size={20} />
                  Nueva Plantilla
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-red-200 p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </div>
          ) : !error && (
            /* Lista de plantillas */
            <div>
              {templates.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay plantillas de auditoría creadas
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comienza creando tu primera plantilla de checklist para auditorías clínicas
                  </p>
                  {isAdmin && (
                    <button
                      onClick={() => setShowBuilder(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all"
                    >
                      <Plus size={20} />
                      Crear Primera Plantilla
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {templates.map((template) => (
                    <AuditTemplateCard
                      key={template._id}
                      template={template}
                      onEdit={isAdmin ? handleEdit : undefined}
                      onDelete={isAdmin ? handleDelete : undefined}
                      onArchive={isAdmin ? handleArchive : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



