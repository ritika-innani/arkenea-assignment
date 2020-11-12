import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl: string = "http://localhost:4000/api/user";
  constructor(private httpClient: HttpClient) { }

  get(options?: any ) {
    let url = `${this.apiUrl}`;
    if(options && options.id) {
      url += `?id=${options.id}`;
    }
    return this.httpClient.get(url, options);
  }

  post(request: any) {
    return this.httpClient.post(this.apiUrl, request);
  }

  put(request: any) {
    return this.httpClient.put(this.apiUrl, request);
  }

  delete(request: any) {
    return this.httpClient.delete(`${this.apiUrl}?id=${request.id}`);
  }

  getUserImage(path) {
    const url = `${this.apiUrl}/image?path=${path}`;
    return this.httpClient.get(url, {responseType: "arraybuffer"});
  }

}
