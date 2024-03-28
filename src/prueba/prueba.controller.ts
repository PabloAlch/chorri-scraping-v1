import { Controller, Get } from "@nestjs/common";
import { Payload } from "@nestjs/microservices";
import { ZeebeWorker, ZeebeJob } from 'nestjs-zeebe';
import { ChorriService } from "./prueba.service";
import { linkCourses, linkFirstCourse } from "./data";



@Controller('pruebas')
export class PruebasController {
    constructor(
        private chorriService: ChorriService
    ){}
    
  
    @Get()
    sayHello(){
        return {greet: 'Hello'}
    }


    @Get('prueba')
    async response(): Promise<any> {
        return await this.chorriService.greet();
    }

    @ZeebeWorker('login')
    async firstJob(@Payload() job: ZeebeJob) {
        const { username, password, baseURL } = job.variables;
        
        const waitLog = await this.chorriService.loginPage(username, password, baseURL);

        await job.complete({
            isLogued: waitLog.isLogued,
            cookies: waitLog.cookies
        });
    }

    @ZeebeWorker('courses')
    async coursesJob(@Payload() job: ZeebeJob) {
        const { username, password, baseURL, cookies } = job.variables;
        
        const coursesList = await this.chorriService.getCourses( baseURL, cookies)

        linkFirstCourse // primer curso
        // linkCourses // todos los cursos

        await job.complete({
            coursesList: coursesList
        });
    }

    @ZeebeWorker('courseLessons')
    async courseJob(@Payload() job: ZeebeJob){
        const { course, cookies } = job.variables

        const getLessons = await this.chorriService.getLessons( course, cookies )

        await job.complete({})
    }

}