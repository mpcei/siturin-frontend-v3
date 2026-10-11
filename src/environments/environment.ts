const HOST = 'http://localhost:8000';

export const environment = {
    production: false,
    APP_URL: 'http://localhost:4200',
    APP_SHORT_NAME: '(Local) SITURIN',
    APP_NAME: '(Local) Sistema de Turismo Inteligente',
    APP_PATH_ASSETS: 'development',
    APP_VERSION: '3.0.0',
    API_URL: 'http://localhost:3000/api/v1',
    API_ASSETS: 'http://localhost:3000/assets',
    MINISTERIO: 'Ministerio de Desarrollo Económico y Productivo',

    HOST,
    STORAGE_URL: `${HOST}/storage`,
    // URL_PUBLIC,
    URL_PRIVATE: HOST,
    API_URL_PRIVATE: `${HOST}/api/v1/private`,
    API_URL_PUBLIC: `${HOST}/api/v1/public`,

    API_URL_DINARDAP: `${HOST}/api/v1/public`,
    API_URL_INTERNO: `${HOST}/api/v1/public`,
    URL_VALIDADOR_DOCUMENTO: 'http://siturin-pruebas.economicoproductivo.gob.ec/document-validator?q=',

    MINISTERIO_UPPER: 'MINISTERIO DE PRODUCCIÓN, COMERCIO EXTERIOR E INVERSIONES'
};
