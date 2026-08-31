import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id?: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/users';

  // GET /api/users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // GET /api/users/:id
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // POST /api/users
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // PUT /api/users/:id
  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/${id}`,
      user
    );
  }

  // DELETE /api/users/:id
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}