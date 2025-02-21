import { NestFactory } from '@nestjs/core';
import { AppModule } from './common/modules/app.module';
import * as os from 'os';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);

  const networkInterfaces = os.networkInterfaces();
  const ip =
    Object.values(networkInterfaces)
      .flat()
      .find((iface) => iface?.family === 'IPv4' && !iface.internal)?.address ||
    'localhost';

  Logger.log(
    `🚀 Server running at http://${ip}:${process.env.PORT ?? 3000}`,
    'Bootstrap',
  );
}
bootstrap();
