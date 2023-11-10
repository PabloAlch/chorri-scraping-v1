import { Controller, Get } from "@nestjs/common";
import { Payload } from "@nestjs/microservices";
import { ZeebeWorker, ZeebeJob } from 'nestjs-zeebe';
import { PruebasService } from "./prueba.service";



@Controller('pruebas')
export class PruebasController {
    constructor(
        private testService: PruebasService
    ){}
    
  
    @Get()
    sayHello(){
        return {greet: 'Hello'}
    }


    @Get('prueba')
    async response(): Promise<any> {
        return await this.testService.greet();
    }

    @ZeebeWorker('login')
    async firstJob(@Payload() job: ZeebeJob) {
        const { username, password, baseURL } = job.variables;
        
        // console.log(username)
        // console.log(password)
        const waitLog = await this.testService.loginPage(username, password, baseURL);

        await job.complete({
            isLogued: waitLog.isLogued,
            cookies: waitLog.cookies
        });
    }

    // @ZeebeWorker('')

}