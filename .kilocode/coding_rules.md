# Reglas de Codificación para carrduci-sys-online

**Nota: Estas reglas pueden mejorarse con el tiempo según patrones observados, sugerencias del usuario o evoluciones tecnológicas.**

## Tailwind CSS
- **Clases utilitarias** consistentes.
- **Responsive** con prefijos sm:, md:, lg:.
- **Custom utilities** en tailwind.config.js.

## Angular 20
- **Standalone components** preferidos.
- **Signals** para reactividad.
- **Control flow** con @if, @for.

## Estado y Servicios
- **Servicios inyectables** para lógica compartida.
- **HttpClient** con interceptors.
- **Local storage** para persistencia simple.

## Formularios
- **Template-driven** para simples, reactivos para complejos.
- **Validación** integrada.
- **Submit handling** con loading states.

## Bundles y Performance
- **Lazy loading** de rutas.
- **Tree shaking** automático.
- **Service workers** para PWA.

## Testing
- **Unit tests** con Jest.
- **Integration** para componentes.
- **Visual regression** con herramientas.

## SEO y Accesibilidad
- **Meta tags** dinámicos.
- **Structured data** para motores de búsqueda.
- **Screen readers** support.

Estas reglas optimizan la app web moderna.