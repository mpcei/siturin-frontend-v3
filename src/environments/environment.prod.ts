const HOST = 'https://siturin-pruebas.turismo.gob.ec:8443/public';
export const environment = {
    production: true,
    APP_URL: 'https://siturin.produccion.gob.ec',
    APP_SHORT_NAME: 'SITURIN',
    APP_NAME: 'Sistema de Turismo Inteligente',
    APP_PATH_ASSETS: 'production',
    APP_VERSION: '3.0.0',
    API_URL: 'https://api-siturin.produccion.gob.ec/api/v1',
    API_ASSETS: 'https://api-siturin.produccion.gob.ec/assets',
    MINISTERIO: 'Ministerio de Desarrollo Económico y Productivo',
    HOST,
    STORAGE_URL: `${HOST}/storage`,
    // URL_PUBLIC,
    URL_PRIVATE: HOST,
    API_URL_PRIVATE: `${HOST}/api/v1/private`,
    API_URL_PUBLIC: `${HOST}/api/v1/public`,

    API_URL_DINARDAP: `${HOST}/api/v1/public`,
    API_URL_INTERNO: `${HOST}/api/v1/public`,
    URL_VALIDADOR_DOCUMENTO: 'http://siturin-pruebas.turismo.gob.ec/document-validator?q=',

    MINISTERIO_UPPER: 'MINISTERIO DE PRODUCCIÓN, COMERCIO EXTERIOR E INVERSIONES'
};
