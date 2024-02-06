# Process Reporter Cli for Windows

Process Reporter Cli is a windows cli. It is designed to report in real time the name of the foreground application being used by the current user on windows.

## Related projects

- [ProcessReporterMac](https://github.com/mx-space/ProcessReporterMac)

## Before you start

You need to install [Node.js](https://nodejs.org/en/) and [pnpm](https://pnpm.io/).

## Environment

Before you start, you need to create a `.env` file in the root directory of the project. The file should contain the following environment variables:

```env
# reporter key
UPDATE_KEY=
# api url
API_URL=

# aws S3 key
S3_ACCESS_KEY=
S3_SECRET_KEY=
```

## Config

And after save your env file, then you can edit `./src/configs.ts`, to set your own configurations.

## Run it

For development, you can run the following commands:

```bash
pnpm install
pnpm run dev
```

For production


```bash
pnpm install
pnpm run build
cd dist
## before your run it, you need to check your env file is in the dist directory
node index.js
```

## License

2024 Innei, MIT
