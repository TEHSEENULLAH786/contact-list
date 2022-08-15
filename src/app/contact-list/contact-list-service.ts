import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient) {
  }

  getContactList(): Observable<any> {
    return this.http.get('assets/contact-list.json');
  }
  postContactList(): Observable<any> {
    return this.http.get('assets/contact-detail.json')

  }
}
