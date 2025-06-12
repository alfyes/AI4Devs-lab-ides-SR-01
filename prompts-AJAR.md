# Prompts 

Lo primero que hice cómo no he trabajado muchas las técnologias utilizadas en la aplicación solicite que me ayudara con la especificación de los tickets y con lo que me entregó le realice una depuración a estos y luego los realice un prompt para la ejecución de cada uno de estos.  

Entre cada uno de los prompts «principales» se ejecuraton otro indicando que corriguiera algún error.

El tercer ticket por cuestión de tiempo no lo ejecute y que no estaba seguro del alcance que me habia propuesto.

Cuando quedó completado cada ticket tambien le pedi que me realizara el commit de los cambios realizados.

## Prompt para la especificación de los tickets

Con base a la historia de usuario cargada en el archivo y el archivo readme del proyecto  requiero definir  tres tickets para atender estas tres tareas técnicas: implementar la interfaz de usuario para el formulario de añadir candidato. 
Desarrollar el backend necesario para procesar la información ingresada en el formulario. Y 
Asegurar la seguridad y privacidad de los datos del candidato.   Además de tener en cuenta que no hay nada aún en el proyecto base, se requerirá tareas extra como crear el modelo de datos, lanzar la migración en PostgreSQL, etc. 

## Prompt primer ticket

Se va a realizar la implementación de la HU @HU-Añadir Candidato al Sistema.md en la aplicación y se crearon algunso tickets y vamos a iniciar con el primero relacionado con el backend:

# Desarrollar backend para procesar la información del formulario

**Descripción**
Implementar en Express/TypeScript el endpoint que reciba los datos del formulario, los valide y los persista en PostgreSQL usando Prisma como ORM .

**Tareas técnicas**

1. Definir modelo `Candidate` en `prisma/schema.prisma` con campos:

   * `firstName`, `lastName`, `email`, `phone`, `address`, `education`, `experience`, `cvUrl`, `createdAt`.
2. Crear y ejecutar migración para PostgreSQL (`docker-compose up -d` + `npx prisma migrate dev`).
3. Configurar conexión a la base de datos en `/backend/.env`.
4. Implementar ruta **POST** `/api/candidates`:

   * Validar datos servidor (class-validator o Zod).
   * Almacenar fichero de CV en local.
   * Guardar registro en DB y devolver JSON con `{ success: true, id }`.
5. Manejo de errores y logs:

   * Capturar excepciones, devolver códigos HTTP adecuados (400/500).
   * Registrar en logger Winston.
6. Escribir tests de integración (Jest + Supertest) para el endpoint.

**Criterios de Aceptación**

* El endpoint persiste correctamente un candidato en la tabla `Candidate`.
* El CV se guarda y su URL queda en el campo `cvUrl`.
* Ante datos inválidos, responde con 400 y mensaje de error.
* Pasan todos los tests de integración.


## Prompt segundo ticket

Continuando con la implementación de la HU @HU-Añadir Candidato al Sistema.md en la aplicación se debe realizar ticket del frontend:  

# Implementar interfaz de usuario para el formulario “Añadir candidato”

**Descripción**
Crear la página y componentes React necesarios para mostrar el formulario de alta de candidato desde el dashboard de reclutador .

**Tareas técnicas**

1. Añadir botón/enlace “Añadir candidato” en el dashboard principal.
2. Crear componente `AddCandidateForm` en React (Create React App):

   * Campos: nombre, apellido, correo electrónico, teléfono, dirección, educación, experiencia laboral.
   * Campo de subida de CV (PDF/DOCX).
3. Implementar validación cliente (Formik/Yup):

   * Formato válido de email, campos obligatorios, tamaño/límite de archivo.
4. Estilos y responsividad:

   * Seguir guía de estilos del proyecto (CSS Modules / Tailwind).
   * Asegurar compatibilidad cross-browser y accesibilidad (WCAG).
5. Stub de autocompletar para educación y experiencia (futuras integraciones).
6. Mostrar mensajes de éxito/error en UI y estados de carga (spinner, deshabilitar botón).
7. Escribir tests unitarios de componentes (React Testing Library).
8. Enviar al backend al enponpint ya implementado para recibir el formulario.

**Criterios de Aceptación**

* Al hacer clic en “Añadir candidato” se carga el formulario.
* Todos los campos aparecen con labels claros y validan en tiempo real.
* Se permite subir un PDF o DOCX y muestra vista previa del nombre de archivo.
* Envío bloqueado si hay errores; muestra mensajes de validación.
* Es responsive y accesible en desktop y móvil.
* El formulario debe enviarse correctamente al backend
