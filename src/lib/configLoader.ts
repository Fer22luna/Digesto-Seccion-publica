/**
 * Configuration Loader - Carga la configuración desde config.json
 */

let config: { API_BASE_URL: string } | null = null;

const DEFAULT_CONFIG = { API_BASE_URL: 'http://localhost:5000/api' };

export async function loadConfig() {
  if (config) return config;

  try {
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar config.json');
    }
    config = await response.json();
    return config;
  } catch (error) {
    console.error('Error al cargar configuración:', error);
    // Fallback a valor por defecto
    config = DEFAULT_CONFIG;
    return config;
  }
}

export function getConfig() {
  if (!config) {
    console.warn('Configuración no ha sido cargada aún. Usando valores por defecto.');
    return DEFAULT_CONFIG;
  }
  return config;
}

export async function getApiBaseUrl() {
  const cfg = config || (await loadConfig());
  return cfg?.API_BASE_URL || DEFAULT_CONFIG.API_BASE_URL;
}
