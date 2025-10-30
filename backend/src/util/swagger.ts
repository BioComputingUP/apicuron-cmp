import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, getSchemaPath, SwaggerModule } from '@nestjs/swagger';

export function wrapApiResponse<T>(type: new () => T, prop: string = 'data') {
  return {
    type: 'object',
    properties: {
      [prop]: {
        type: 'array',
        items: {
          $ref: getSchemaPath(type),
        },
      },
    },
  };
}

export function setupSwagger(
  app: NestExpressApplication,
  apiDocsPath: string = 'docs',
) {
  const config = new DocumentBuilder()
    .setTitle('Consent Management Platform')
    .setDescription('The Consent Management Platform API description')
    .setVersion('1.0')
    .setBasePath('/docs')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(apiDocsPath, app, documentFactory, {
    swaggerOptions: {
      syntaxHighlight: {
        theme: 'monokai',
      },
    },
  });

  return;
}
