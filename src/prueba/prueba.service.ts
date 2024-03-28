import { Injectable } from "@nestjs/common";
import axios from "axios"
import * as puppeteer from 'puppeteer';

const fetch = require('node-fetch');
let browserContext: puppeteer.BrowserContext | null = null

@Injectable()
export class ChorriService{
    constructor(

    ){}
    async greet(): Promise<any> {
        try {
          const response = {greet: 'Hello world'};
    
          return response;
        } catch (e) {
          console.log(e.toString());
        }
    }
    
    async loginPage (username: string, password: string, baseURL: string): Promise<{isLogued:boolean, cookies?: Object| null}>{
      try{
        console.log(username, password)

        const payload = `username=${username}&password=${password}&remember-me=on&redirect_to=&lrm_action=login&wp-submit=1&lp-ajax=login&security-login=793db5b58f&_wp_http_referer=%2F`
        const response = await axios.post( baseURL + '?lrm=1', payload )
        const cookiesArray = response.headers["set-cookie"] || [];

        let wordpressCookie = null;

        for (const cookie of cookiesArray) {
          const match = cookie.match(/wordpress_logged_in_[^=]+=[^;]*/);
          if (match) {
            wordpressCookie = match[0];
            break; // Sal del bucle una vez que encuentres la cookie deseada
          }
        }
        const headers = {
          'Cookie': wordpressCookie, // Include the extracted cookie value
        };

        const responseData = await fetch(baseURL, { method: 'GET', headers })
        
        if (responseData.ok) {
          const getData = await responseData.text();
          const searchHtml = '<p class="subtitulo">¡Bienvenido olbapdow!</p>';
          if (getData.includes(searchHtml))
            console.log('Login correcto')
        }
        
        if (response.data.data.message && response.data.data.logged_in && responseData.ok){
        const cookieParts = wordpressCookie.split('=');
        const cookieName = cookieParts[0];
        const cookieValue = cookieParts[1];
          return {
            isLogued: true,
            cookies: {
              name:cookieName,
              value: cookieValue,
              },
          }
        } else{
          return {
            isLogued: false,
            cookies: null
          }
        }

      } catch(e) {
        console.log(e.toString())
      }
    }

    async getCourses( baseURL: string ,cookies: {name: string, value:string}){
      
      if(!browserContext){
        const newContext = await this.loadBrowser(browserContext)
        browserContext = newContext
      }
      const page = await browserContext.newPage();

      await page.goto(baseURL+'cursos');
      
    
      await page.setCookie({name: cookies.name, value: cookies.value})
      await page.goto(baseURL + 'cursos')
      await page.waitForSelector('#post-3874 > div > div > div.facetwp-template > div > div.fwpl-result')

      const links = await page.evaluate(() => {
        const elements = document.querySelectorAll('#post-3874 > div > div > div.facetwp-template > div > div.fwpl-result');
        const linksArray = [];
    
        elements.forEach(element => {
          const link: any = element.querySelector('div.fwpl-item.tools-title a');
          if (link) {
            linksArray.push(link.href);
          }
        });
      
        return linksArray;
      });

      // await page.close()
      return links
    }
    
    async getLessons( course: string, cookies: {name: string, value:string}){
      
      if(!browserContext){
        const newContext = await this.loadBrowser(browserContext)
        browserContext = newContext
      }

      const page = await browserContext.newPage();
      
      await page.setCookie({name: cookies.name, value: cookies.value})
      await page.goto(course)

      await page.evaluate(() => {
        // Este código se ejecutará en el contexto de la página
      });
      
      const scripts = await page.evaluate(() => {
        const scriptElements = Array.from(document.querySelectorAll('script'));
        return scriptElements.map(script => script.src || script.innerText);
      });

      
  
      // Espera un tiempo suficiente para que se cargue la pestaña "Sources"
      await page.waitForTimeout(5000);

      await page.close();
      // console.log(cookies)
      console.log(course)
      await browserContext.close()
    }



    
    async loadBrowser(existingContext: puppeteer.BrowserContext | null){
      let browserContext: puppeteer.BrowserContext | null = existingContext;
      {
        const browser = await puppeteer.launch({
          headless: false,
          defaultViewport: {
            width: 1280,
            height: 780,
          },
         
        });
        browserContext = await browser.createIncognitoBrowserContext();
      }
      return browserContext
    }
    

    
}