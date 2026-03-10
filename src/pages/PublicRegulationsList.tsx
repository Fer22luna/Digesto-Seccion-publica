import React, { useState, useEffect } from 'react';
import { Regulation, RegulationType } from '../types';
import { fetchPublishedRegulations } from '../lib/regulationService';
import RegulationsTable from '../components/RegulationsTable';
import { downloadRegulationPDF } from '../lib/regulationService';

type PublicFilters = {
  type?: RegulationType;
  searchText?: string;
  year?: string;
  month?: string;
  expediente?: string;
};

const PublicRegulationsList: React.FC = () => {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [allPublishedRegulations, setAllPublishedRegulations] = useState<Regulation[]>([]);
  const [filters, setFilters] = useState<PublicFilters>({});
  const [formFilters, setFormFilters] = useState<PublicFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 8 }, (_, idx) => String(currentYear - idx));
  const monthOptions = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  // Load published regulations from API
  useEffect(() => {
    const loadPublishedRegulations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPublishedRegulations();
        setAllPublishedRegulations(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar normativas';
        setError(message);
        console.error('Error loading published regulations:', err);
        setAllPublishedRegulations([]);
      } finally {
        setLoading(false);
      }
    };
    loadPublishedRegulations();
  }, []);

  // Apply filters to published regulations
  useEffect(() => {
    let data = allPublishedRegulations;

    if (filters.searchText) {
      const text = filters.searchText.toLowerCase();
      data = data.filter(
        (r) =>
          r.reference.toLowerCase().includes(text) ||
          (r.content && r.content.toLowerCase().includes(text)) ||
          (r.keywords && r.keywords.some((k) => k.toLowerCase().includes(text)))
      );
    }

    if (filters.type) {
      data = data.filter((r) => r.type === filters.type);
    }

    if (filters.year) {
      const year = Number(filters.year);
      data = data.filter((r) => {
        try {
          const date = new Date(r.publicationDate);
          return date.getFullYear() === year;
        } catch {
          return true; // Si no puede parsear, incluir el registro
        }
      });
    }

    if (filters.month) {
      const month = Number(filters.month) - 1;
      data = data.filter((r) => {
        try {
          const date = new Date(r.publicationDate);
          return date.getMonth() === month;
        } catch {
          return true; // Si no puede parsear, incluir el registro
        }
      });
    }

    if (filters.expediente) {
      const exp = filters.expediente.toLowerCase();
      data = data.filter(
        (r) =>
          (r.reference && r.reference.toLowerCase().includes(exp)) ||
          (r.specialNumber && r.specialNumber.toLowerCase().includes(exp))
      );
    }

    setRegulations(data);
  }, [filters, allPublishedRegulations]);

  const clearFilters = () => {
    setFormFilters({});
    setFilters({});
  };

  // Auto-apply filters as user types
  useEffect(() => {
    setFilters(formFilters);
  }, [formFilters]);

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Digesto Público</h1>
          <p style={{ color: 'red' }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Digesto Público</h1>
        <p>Busca por año, mes, tipo de documento y número de expediente. Descarga o visualiza en línea.</p>
      </div>

      {/* Filter Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e0e4eb',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Search Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#f8f9fb',
              border: '1px solid #e0e4eb',
              borderRadius: '6px',
              padding: '12px 14px',
            }}
          >
            <span style={{ color: '#667085', fontSize: '18px' }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar por referencia, palabras clave..."
              value={formFilters.searchText ?? ''}
              onChange={(e) => setFormFilters((prev) => ({ ...prev, searchText: e.target.value }))}
              style={{
                flex: 1,
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                color: '#1a1a1a',
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: '#e0e4eb',
            marginBottom: '16px',
          }}
        />

        {/* Advanced Filters Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          {/* Tipo de Documento */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#667085',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Tipo
            </label>
            <select
              value={formFilters.type ?? ''}
              onChange={(e) =>
                setFormFilters((prev) => ({ ...prev, type: e.target.value as RegulationType }))
              }
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #e0e4eb',
                borderRadius: '4px',
                fontSize: '13px',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff',
                color: '#1a1a1a',
                cursor: 'pointer',
              }}
            >
              <option value="">Todos</option>
              <option value="DECREE">Decreto</option>
              <option value="RESOLUTION">Resolución</option>
              <option value="ORDINANCE">Ordenanza</option>
              <option value="TRIBUNAL_RESOLUTION">Tribunal</option>
              <option value="BID">Licitación</option>
            </select>
          </div>

          {/* Año */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#667085',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Año
            </label>
            <select
              value={formFilters.year ?? ''}
              onChange={(e) => setFormFilters((prev) => ({ ...prev, year: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #e0e4eb',
                borderRadius: '4px',
                fontSize: '13px',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff',
                color: '#1a1a1a',
                cursor: 'pointer',
              }}
            >
              <option value="">Todos</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Mes */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#667085',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Mes
            </label>
            <select
              value={formFilters.month ?? ''}
              onChange={(e) => setFormFilters((prev) => ({ ...prev, month: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #e0e4eb',
                borderRadius: '4px',
                fontSize: '13px',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff',
                color: '#1a1a1a',
                cursor: 'pointer',
              }}
            >
              <option value="">Todos</option>
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Expediente */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#667085',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Expediente
            </label>
            <input
              type="text"
              placeholder="EXP D 930/2025"
              value={formFilters.expediente ?? ''}
              onChange={(e) => setFormFilters((prev) => ({ ...prev, expediente: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 10px',
                border: '1px solid #e0e4eb',
                borderRadius: '4px',
                fontSize: '13px',
                fontFamily: 'inherit',
                backgroundColor: '#ffffff',
                color: '#1a1a1a',
              }}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(formFilters.searchText ||
          formFilters.type ||
          formFilters.year ||
          formFilters.month ||
          formFilters.expediente) && (
          <button
            onClick={clearFilters}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              backgroundColor: '#f5f6f8',
              color: '#667085',
              border: '1px solid #e0e4eb',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            ✕ Limpiar Filtros
          </button>
        )}
      </div>

      {/* Results Section */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e0e4eb',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Results Header */}
        <div
          style={{
            backgroundColor: '#f0f4fa',
            padding: '14px 20px',
            borderBottom: '1px solid #e0e4eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '13px', color: '#667085' }}>
            <strong style={{ color: '#1a1a1a' }}>{regulations.length}</strong> de{' '}
            <strong style={{ color: '#1a1a1a' }}>{allPublishedRegulations.length}</strong> documentos
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#1a3a5c',
                  borderRadius: '2px',
                }}
              />
              <span style={{ color: '#666' }}>Decreto</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#0d5c4a',
                  borderRadius: '2px',
                }}
              />
              <span style={{ color: '#666' }}>Resolución</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#5c3a0d',
                  borderRadius: '2px',
                }}
              />
              <span style={{ color: '#666' }}>Ordenanza</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#5c1a1a',
                  borderRadius: '2px',
                }}
              />
              <span style={{ color: '#666' }}>Tribunal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#3a0d5c',
                  borderRadius: '2px',
                }}
              />
              <span style={{ color: '#666' }}>Licitación</span>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#667085' }}>
            Cargando documentos...
          </div>
        ) : regulations.length === 0 ? (
          <div
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              color: '#667085',
              fontSize: '14px',
            }}
          >
            <p style={{ marginBottom: '8px' }}>No se encontraron documentos</p>
            <p style={{ fontSize: '12px', color: '#999' }}>
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          <RegulationsTable
            regulations={regulations}
            showState={false}
            onDownloadPDF={downloadRegulationPDF}
          />
        )}
      </div>
    </div>
  );
};

export default PublicRegulationsList;
