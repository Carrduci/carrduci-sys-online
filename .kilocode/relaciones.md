# Relaciones de carrduci-sys-online con Otros Repositorios

## carrduci-sys-api
- **Backend compartido**: Misma API que GUI, pero para web.
- **Sesiones web**: Manejo diferente de autenticación (cookies vs localStorage).
- **Responsive**: Diseño web vs desktop.

## carrduci-sys-gui
- **Paralelo**: Versión desktop similar, comparte lógica de integración con API.
- **Migración**: Componentes podrían compartirse.

## queries_mongosh
- **Indirecta**: Igual que con GUI.

## documentacion_sistemas
- **Referencia**: Docs aplican a online también.

## api-gateway-carrduci
- **Enrutamiento web**: Proxy para requests de navegador.

## utilidades_carrduci_sys
- **Desarrollo web**: Scripts para setup de entorno online.

## Resumen
- **Alternativa web**: Complementa GUI para acceso remoto.