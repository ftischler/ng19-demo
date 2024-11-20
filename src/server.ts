import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ApiModule } from './api/api.module';

const app = await bootstrap();

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);

async function bootstrap() {
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  const app = express();
  const angularApp = new AngularNodeAppEngine();

  app.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
      redirect: false,
    }),
  );

  app.use('/**', (req, res, next) => {
    angularApp
      .handle(req)
      .then((response) => {
        return response ? writeResponseToNodeResponse(response, res) : next();
      })
      .catch(next);
  });

  const nestApp = await NestFactory.create(ApiModule, new ExpressAdapter(app));
  nestApp.setGlobalPrefix('api');
  await nestApp.init();

  return app;
}
