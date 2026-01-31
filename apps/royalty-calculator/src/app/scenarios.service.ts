import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Scenario {
  _id: string;
  name: string;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  mode: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ScenariosService {
  private apiUrl = environment.apiUrl || 'http://localhost:3333';

  constructor(private http: HttpClient) {}

  list(): Observable<Scenario[]> {
    return this.http.get<Scenario[]>(`${this.apiUrl}/scenarios`);
  }

  get(id: string): Observable<Scenario> {
    return this.http.get<Scenario>(`${this.apiUrl}/scenarios/${id}`);
  }

  create(body: { name: string; input: Record<string, unknown>; result: Record<string, unknown>; mode: string }): Observable<Scenario> {
    return this.http.post<Scenario>(`${this.apiUrl}/scenarios`, body);
  }
}
