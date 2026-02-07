# 📝 Task Tracker App (Angular + Serverless)

> Aplicación de gestión de tareas, persistente y desplegada en la nube.

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## 🚀 Demo Online
**[Ver Proyecto Desplegado en Vercel](https://task-list-angular-js.vercel.app)**

---

## 💡 Sobre el Proyecto
Este proyecto comenzó como parte del curso **Argentina Programa**, utilizando `json-server` para simular un backend local.

En **2026**, realicé una **refactorización completa de la arquitectura** para transformar una demo local en una aplicación de producción real, persistente y gratuita, sin alterar la base de código "legacy" de Angular 13.

### ✨ Características
* **Crear Tareas:** Persistencia inmediata en la nube.
* **Borrar Tareas:** Eliminación en tiempo real.
* **Recordatorios:** Doble click para activar/desactivar recordatorios visuales.
* **SPA:** Navegación fluida sin recargas (Routing).

---

## 🛠️ Arquitectura & Stack Tecnológico

La aplicación utiliza una arquitectura **Serverless** para eliminar costos de servidor y mantenimiento.

* **Frontend:** Angular 13 (TypeScript, HTML, CSS).
* **Backend:** Vercel Serverless Functions (Node.js). Actúa como API Gateway y Proxy.
* **Base de Datos:** Firebase Realtime Database (NoSQL).
* **Infraestructura:** Despliegue continuo (CI/CD) mediante Vercel y GitHub.
