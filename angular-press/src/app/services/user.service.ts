import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'administrator',
      dateCreated: new Date(),
      isActive: true
    },
    {
      id: 2,
      username: 'editor',
      email: 'editor@example.com',
      firstName: 'Content',
      lastName: 'Editor',
      role: 'editor',
      dateCreated: new Date(),
      isActive: true
    }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);
  public users$ = this.usersSubject.asObservable();

  constructor() { }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find(user => user.username === username);
  }

  createUser(user: User): Observable<User> {
    const newUser = { ...user, id: this.generateId() };
    this.users.push(newUser);
    this.usersSubject.next(this.users);
    return new Observable(observer => {
      observer.next(newUser);
      observer.complete();
    });
  }

  updateUser(user: User): Observable<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      this.usersSubject.next(this.users);
    }
    return new Observable(observer => {
      observer.next(user);
      observer.complete();
    });
  }

  deleteUser(id: number): Observable<void> {
    this.users = this.users.filter(user => user.id !== id);
    this.usersSubject.next(this.users);
    return new Observable(observer => {
      observer.complete();
    });
  }

  private generateId(): number {
    return this.users.length > 0 ? Math.max(...this.users.map(u => u.id || 0)) + 1 : 1;
  }
}