import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(
  app: INestApplication,
  apiDocsPath: string = 'docs',
) {
  const config = new DocumentBuilder()
    .setTitle('Consent Management Platform')
    .setDescription('The Consent Management Platform API description')
    .setVersion('1.0')
    .addTag('consent')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(apiDocsPath, app, documentFactory);

  return;
}
