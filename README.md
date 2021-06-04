# electron-svelte-typescript

Template for apps written with [Electron](https://github.com/electron/electron), [Svelte](https://github.com/sveltejs/svelte) and [Typescript](https://github.com/microsoft/TypeScript).

The template does hot module replacement and reloads electron on main process file changes out of the box.
It also follows some good security practices, such as Content-Security-Policy meta tags in html,
context isolation set to true, remote modules set to false etc.

## Get started

To create a new project based on this template you must first clone the repo and then delete the folder .git:

```bash
git clone https://github.com/fuzzc0re/electron-svelte-typescript MyAppName
cd MyAppName
rm -rf .git
```

_Note that you will need to have [Node.js](https://nodejs.org) installed._

Install the dependencies...

```bash
npm i
```

...then start coding in dev mode:

```bash
npm start
```

The start script spins up [Rollup](https://github.com/rollup/rollup)
in watch mode with a [Rollup-Plugin-Serve](https://github.com/thgh/rollup-plugin-serve) instance
serving the frontend static files on [localhost:5000](http://localhost:5000) and a
nodemon server to watch for file changes related to the main electron process.

Electron loads its html content from [localhost:5000](https://github.com/fuzzc0re/electron-svelte-typescript-boilerplate/src/electron/index.ts#L40)
in dev mode and from [build/public/index.html](https://github.com/fuzzc0re/electron-svelte-typescript-boilerplate/src/electron/index.ts#L38)
in production mode.

The Svelte development happens in [src/frontend](https://github.com/fuzzc0re/electron-svelte-typescript-boilerplate/src/frontend) and the Electron development in [src/electron](https://github.com/fuzzc0re/electron-svelte-typescript-boilerplate/src/electron).

Edit a file in `src`, save it, and see the changes in the app.

## Building and running in production mode

To create an optimized build of the app:

```bash
npm run build
```

To create a distributable version of the app with [electron-builder](https://github.com/electron-userland/electron-builder):

```bash
npm run dist
```

In production mode, sourcemaps are [disabled](https://github.com/fuzzc0re/electron-svelte-typescript-boilerplate/scripts/preBuild.js#L30),
[html](https://github.com/fuzzc0re/electron-svelte-typescript-boilerplate/scripts/postBuild.js#L77)
[css](https://github.com/fuzzc0re/electron-svelte-typescript-boilerplate/scripts/postBuild.js#L104) and
[js](https://github.com/fuzzc0re/electron-svelte-typescript-boilerplate/rollup.config.js#L83) files are compressed and mangled, devTools are [disabled](https://github.com/fuzzc0re/electron-svelte-typescript-boilerplate/src/electron/index.ts#L28) and
[CSP](https://github.com/fuzzc0re/electron-svelte-typescript-boilerplate/scripts/postBuild.js#L82) allows only same origin scripts to load.

## Contributing

In order to lint the code you run:

```bash
npm run lint
```

In order to prettify the code you run:

```bash
npm run format
```

You should run the following command, which runs lint and then format, on your contributed code:

```bash
npm run preversion
```

before creating a pull request.

All suggestions are welcome!

## Licence

This project is licensed under the terms described in [LICENSE](https://github.com/fuzzc0re/electron-svelte-typescript/blob/master/LICENSE).
