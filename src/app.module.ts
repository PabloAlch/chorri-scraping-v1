    // app.module.ts
    import { Module } from '@nestjs/common';
    // import { AppController } from './app.controller';
    import { ZeebeModule, ZeebeServer } from 'nestjs-zeebe';
import { InternalZeebeModule } from './zeebe/zeebe.module';
import { ConfigModule } from '@nestjs/config';
import { PruebaModule } from './prueba/prueba.module';

    @Module({
    imports: [ 
        ConfigModule.forRoot({ isGlobal: true }),
        InternalZeebeModule,
        PruebaModule
    ],
    controllers: [
        // AppController
    ],
    providers: [ZeebeServer],
    })
    export class AppModule {}