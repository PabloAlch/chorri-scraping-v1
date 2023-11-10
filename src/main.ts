import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ZeebeServer } from 'nestjs-zeebe';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // const microservice = app.connectMicroservice({
    //     strategy: app.get(ZeebeServer),
    // });


    const zeebeEnabled = configService.get('ZEEBE_ENABLED', 'true') === 'true';

    if (zeebeEnabled) {
        const zeebeInstance = app.get(ZeebeServer);
        app.connectMicroservice({ strategy: zeebeInstance });
      }
    
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(
        bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
        }),
    );


    app.setGlobalPrefix('/v1');
    app.enableCors();
    // app.useGlobalGuards(new UserGuard(app.get(Reflector), configService));
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    if (zeebeEnabled) {
        await app.startAllMicroservices();
    }

    await app.listen(3010);
}
bootstrap();
