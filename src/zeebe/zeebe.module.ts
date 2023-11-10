import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ZeebeClientOptions, ZeebeModule, ZeebeServer } from 'nestjs-zeebe';
import { ZeebeController } from './zeebe.controller';
import { Duration, ZBClient } from 'zeebe-node';

export const ZEEBE_CLIENT_KEY = 'ZBCLIENT';

const ZBClientProvider = {
  provide: ZEEBE_CLIENT_KEY,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const gatewayAddress = config.get('ZEEBE_GATEWAY');
    return new ZBClient(gatewayAddress, {
      loglevel: 'ERROR',
      longPoll: Duration.seconds.from(60),
      pollInterval: Duration.seconds.from(60),
      connectionTolerance: Duration.milliseconds.from(
        Number(process.env.CONNECTION_TOLERANCE ?? 60000) ?? 60000,
      ),
    });
  },
};

@Global()
@Module({
  imports: [
    ZeebeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const gatewayAddress = config.get('ZEEBE_GATEWAY');
        const settings: ZeebeClientOptions = {
          gatewayAddress,
          options: {
            debug: false,
            loglevel: 'ERROR',
          },
        };
        return settings;
      },
    }),
  ],
  providers: [ZeebeServer, ZBClientProvider],
  controllers: [ZeebeController],
  exports: [ZBClientProvider],
})
export class InternalZeebeModule {}
