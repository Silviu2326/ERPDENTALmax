import { useState, useEffect } from 'react';
import { Plus, RefreshCw, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onVolver && (
                <button
                  onClick={onVolver}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Gestión de Plantillas de Auditoría
                </h1>
                <p className="text-gray-600 text-lg">
                  Crea y gestiona plantillas de checklists para auditorías clínicas
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
              {isAdmin && (
                <button
                  onClick={() => setShowBuilder(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Nueva Plantilla
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : (
          /* Lista de plantillas */
          <div className="space-y-4">
            {templates.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">
                  No hay plantillas de auditoría creadas
                </p>
                {isAdmin && (
                  <button
                    onClick={() => setShowBuilder(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Crear Primera Plantilla
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  );
}


