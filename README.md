# Velity — Frontend

Aplicación móvil de salud digital construida con React Native y Expo.

Este repositorio contiene únicamente la **base del proyecto frontend**: una estructura
profesional, escalable y limpia, preparada para comenzar el desarrollo. En esta etapa
no se incluye ninguna funcionalidad de negocio ni conexión a servicios externos.

## Stack tecnológico

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/) (navegación basada en archivos)
- JavaScript
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (LTS recomendado)
- npm 9 o superior
- [Expo Go](https://expo.dev/go) en tu dispositivo móvil, o un emulador de Android / simulador de iOS
- Git

## Instalación

```bash
npm install
```

## Ejecución

Inicia el servidor de desarrollo de Expo:

```bash
npx expo start
```

Luego:

- Escanea el código QR con la app **Expo Go** (Android / iOS), o
- Presiona `a` para abrir en un emulador de Android, o
- Presiona `i` para abrir en el simulador de iOS, o
- Presiona `w` para abrir en el navegador web.

La pantalla inicial debe mostrar:

```
Velity
Frontend initialized successfully
```

### Scripts disponibles

| Script                 | Descripción                              |
| ---------------------- | ---------------------------------------- |
| `npm start`            | Inicia el servidor de desarrollo de Expo |
| `npm run android`      | Abre la app en un emulador de Android    |
| `npm run ios`          | Abre la app en el simulador de iOS       |
| `npm run web`          | Abre la app en el navegador              |
| `npm run lint`         | Ejecuta ESLint                           |
| `npm run lint:fix`     | Ejecuta ESLint y corrige automáticamente |
| `npm run format`       | Formatea el código con Prettier          |
| `npm run format:check` | Verifica el formato con Prettier         |

## Estructura de carpetas

```
Frontend/
│
├── app/                    # Rutas de Expo Router (navegación por archivos)
│   ├── _layout.js          # Layout raíz de la aplicación
│   └── index.js            # Pantalla inicial
│
├── src/                    # Código fuente de la aplicación
│   ├── components/         # Componentes reutilizables de UI
│   ├── screens/            # Vistas / pantallas
│   ├── services/           # Servicios e integraciones (a futuro)
│   ├── hooks/              # Custom hooks de React
│   ├── utils/              # Funciones utilitarias
│   ├── constants/          # Constantes de la aplicación
│   ├── assets/             # Recursos estáticos
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── theme/              # Tema visual (colores, tipografías, etc.)
│   └── navigation/         # Configuración de navegación (a futuro)
│
├── .gitignore
├── .prettierrc
├── .eslintrc.json
├── app.json
├── babel.config.js
├── package.json
└── README.md
```

## Convenciones

- Separación clara de responsabilidades por carpeta dentro de `src/`.
- Las rutas y la navegación viven en `app/` gracias a Expo Router.
- El código se mantiene formateado con Prettier y validado con ESLint.
