import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { Conferance } from '../models/conferance';

@Injectable({
  providedIn: 'root',
})
export class ConferanceService {
    conferences: Conferance[] = [];
   http = inject(HttpClient); 
apiUrl = 'http://localhost:3000/conferences';

  getAll(){
    return this.http.get<Conferance[]>(this.apiUrl);
  }

  getById(id: number) {
      return this.http.get<Conferance>(this.apiUrl+"/"+id);
    //return this.http.get<Conferance>(`${this.apiUrl}/${id}`);
  }

  addConferance(conf: Omit<Conferance, 'id'>) {
    return this.http.post<Conferance>(this.apiUrl, conf);
  }

  updateConferance(id: number, conf: Omit<Conferance, 'id'>) {
    return this.http.put<Conferance>(`${this.apiUrl}/${id}`, conf);
  }

  deleteConferance(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
