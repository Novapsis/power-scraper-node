![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-starter

This repo contains example nodes to help you get started building your own custom integrations for [n8n](https://n8n.io). It includes the node linter and other dependencies.

To make your custom node available to the community, you must create it as an npm package, and [submit it to the npm registry](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry).

If you would like your node to be available on n8n cloud you can also [submit your node for verification](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/).

## Prerequisites

You need the following installed on your development machine:

* [git](https://git-scm.com/downloads)
* Node.js and npm. Minimum version Node 20. You can find instructions on how to install both using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
* Install n8n with:
  ```
  npm install n8n -g
  ```
* Recommended: follow n8n's guide to [set up your development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).

## Using this starter

These are the basic steps for working with the starter. For detailed guidance on creating and publishing nodes, refer to the [documentation](https://docs.n8n.io/integrations/creating-nodes/).

1. [Generate a new repository](https://github.com/n8n-io/n8n-nodes-starter/generate) from this template repository.
2. Clone your new repo:
   ```
   git clone https://github.com/<your organization>/<your-repo-name>.git
   ```
3. Run `npm i` to install dependencies.
4. Open the project in your editor.
5. Browse the examples in `/nodes` and `/credentials`. Modify the examples, or replace them with your own nodes.
6. Update the `package.json` to match your details.
7. Run `npm run lint` to check for errors or `npm run lintfix` to automatically fix errors when possible.
8. Test your node locally. Refer to [Run your node locally](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/) for guidance.
9. Replace this README with documentation for your node. Use the [README_TEMPLATE](README_TEMPLATE.md) to get started.
10. Update the LICENSE file to use your details.
11. [Publish](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry) your package to npm.

## More information

Refer to our [documentation on creating nodes](https://docs.n8n.io/integrations/creating-nodes/) for detailed information on building your own nodes.

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)

## Probar localmente con n8n en Docker (instrucciones en español)

Si ejecutas n8n dentro de Docker, puedes probar tu nodo personalizado de dos maneras principales: montando la carpeta `dist` como volumen o copiando los archivos dentro del contenedor.

1) Opción — Montar `dist` como volumen (recomendado para desarrollo rápido)

  - Construye el paquete y los iconos locales:

  ```bash
  npm run build
  ```

  - Inicia n8n en Docker montando la carpeta `dist` de tu proyecto en `/home/node/.n8n/custom` (o en la ruta que uses para cargar nodes locales). Un ejemplo con `docker run`:

  ```bash
  docker run -it --rm \
    --name n8n-local \
    -p 5678:5678 \
    -v "$(pwd)/dist:/home/node/.n8n/custom" \
    n8nio/n8n:latest
  ```

  - Alternativamente, si usas `docker-compose`, monta el volumen en la configuración del servicio `n8n` apuntando a la carpeta `dist`.

  - Reinicia n8n y abre la UI (http://localhost:5678). Deberías ver tu nodo `Power Scraper` en el panel de nodos; el icon se cargará desde `dist/nodes/PowerScraper/PowerScraper.png`.

2) Opción — Copiar los archivos al contenedor (útil si no quieres montar volúmenes)

  - Construye primero `dist`:
  ```bash
  npm run build
  ```

  - Copia los archivos dentro del contenedor (suponiendo que ya tienes un contenedor n8n en ejecución llamado `n8n`):

  ```bash
  docker cp dist/. n8n:/home/node/.n8n/custom
  docker restart n8n
  ```

Notas y recomendaciones
 - Asegúrate de que `package.json` en `dist` (si existe) esté correctamente configurado para que n8n detecte los nodes; en este starter el proceso `npm run build` compila TS y copia los icons a `dist`.
 - Si no ves el nodo en la UI, revisa los logs del contenedor n8n y revisa permisos en los archivos copiados.
 - El icon del nodo ahora es `PowerScraper.png` y está incluido en `dist/nodes/PowerScraper/PowerScraper.png` tras correr `npm run build`.

Si quieres, puedo generar un ejemplo `docker-compose.yml` mínimo que monte `dist` y arranque n8n listo para pruebas.
