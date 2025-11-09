import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Category[] = [
    {
      id: 1,
      name: 'Technology',
      slug: 'technology',
      description: 'Posts about technology',
      count: 1
    },
    {
      id: 2,
      name: 'Guides',
      slug: 'guides',
      description: 'Helpful guides',
      count: 1
    }
  ];

  private categoriesSubject = new BehaviorSubject<Category[]>(this.categories);
  public categories$ = this.categoriesSubject.asObservable();

  constructor() { }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find(category => category.id === id);
  }

  createCategory(category: Category): Observable<Category> {
    const newCategory = { ...category, id: this.generateId() };
    this.categories.push(newCategory);
    this.categoriesSubject.next(this.categories);
    return new Observable(observer => {
      observer.next(newCategory);
      observer.complete();
    });
  }

  updateCategory(category: Category): Observable<Category> {
    const index = this.categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      this.categories[index] = category;
      this.categoriesSubject.next(this.categories);
    }
    return new Observable(observer => {
      observer.next(category);
      observer.complete();
    });
  }

  deleteCategory(id: number): Observable<void> {
    this.categories = this.categories.filter(category => category.id !== id);
    this.categoriesSubject.next(this.categories);
    return new Observable(observer => {
      observer.complete();
    });
  }

  private generateId(): number {
    return this.categories.length > 0 ? Math.max(...this.categories.map(c => c.id || 0)) + 1 : 1;
  }
}