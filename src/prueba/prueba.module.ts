import { Module } from "@nestjs/common";
import { PruebasController } from "./prueba.controller";
import { PruebasService } from "./prueba.service";


@Module({
    controllers: [PruebasController],
    providers: [PruebasService]
})

export class PruebaModule {}