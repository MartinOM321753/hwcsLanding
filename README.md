# Cohorte de Trabajadores de la Salud

Landing informativa y propuesta de login, en HTML, CSS y JavaScript. Sin dependencias ni compilación.

## Estructura

- `site/index.html`: landing de la Cohorte.
- `site/login/index.html`: login con fondo verde, formulario blanco, niebla, órbitas y logos institucionales fijos.
- `site/assets/`: recursos de la landing.
- `site/login/assets/`: recursos del login.
- `.github/workflows/pages.yml`: despliegue automático del contenido de `site/` en GitHub Pages.

El botón **Acceder** de la landing abre `login/`. El logo del login y **Explorar la Cohorte** vuelven a la landing. Las rutas son relativas y funcionan bajo la ruta de proyecto de GitHub Pages.

## GitHub Pages

En **Settings → Pages → Build and deployment → Source**, selecciona **GitHub Actions**. El workflow se ejecuta con los pushes a `main`; también se puede ejecutar desde **Actions → Publicar landing y login en GitHub Pages → Run workflow**.

La URL publicada se muestra en el resultado de ese workflow y en Settings → Pages. No necesita dominio personalizado ni servicios de backend para mostrar las páginas.

## Vista local

Desde la raíz del repositorio:

```bash
python -m http.server 8080 --directory site
```

Abre `http://localhost:8080`.

## Autenticación

El login es una interfaz sin conexión al backend. Al pulsar **Iniciar sesión**, se conserva la validación nativa de campos requeridos, pero no aparece ningún mensaje de demostración, no se inicia una sesión, no se envían credenciales y no se guardan datos. El manejador de `submit` en `site/login/app.js` queda disponible para conectar posteriormente el sistema institucional real.

La recuperación de acceso muestra el correo de contacto del equipo. No simula envíos de correo ni cambios de contraseña. El sitio informativo no tiene inscripción pública.

La investigación y la información del equipo de la landing se conservan; no se publica el informe privado de fuentes. Los archivos de configuración de Sites y sus credenciales no forman parte de este repositorio.
