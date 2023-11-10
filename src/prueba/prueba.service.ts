import { Injectable } from "@nestjs/common";
import axios from "axios"
const fetch = require('node-fetch');
const fs = require('fs');

@Injectable()
export class PruebasService{
    constructor(

    ){}

   
    // findAllEstablishmentsAndClients
    async greet(): Promise<any> {
        try {
          const response = {greet: 'Hello world'};
    
          return response;
        } catch (e) {
          console.log(e.toString());
        }
    }
    
    async loginPage (username: string, password: string, baseURL: string): Promise<{isLogued:boolean, cookies?: string}>{
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
        // const responseData = await axios.get(baseURL)
        const responseData = await fetch(baseURL, { method: 'GET', headers })

          if (responseData.ok) {
            const getData = await responseData.text();
            const searchHtml = '<p class="subtitulo">¡Bienvenido olbapdow!</p>';
            if (getData.includes(searchHtml))
              console.log('Login correcto')
          }
          



        if (response.data.data.message && response.data.data.logged_in && responseData.ok){
          return {
            isLogued: true,
            cookies: wordpressCookie,
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

    
}