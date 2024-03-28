import { Module } from "@nestjs/common";
import { PruebasController } from "./prueba.controller";
import { ChorriService } from "./prueba.service";


@Module({
    controllers: [PruebasController],
    providers: [ChorriService]
})

export class PruebaModule {}