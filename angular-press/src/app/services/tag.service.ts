import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tags: Tag[] = [
    {
      id: 1,
      name: 'angular',
      slug: 'angular',
      description: 'Angular framework posts',
      count: 1
    },
    {
      id: 2,
      name: 'cms',
      slug: 'cms',
      description: 'Content management system posts',
      count: 1
    }
  ];

  private tagsSubject = new BehaviorSubject<Tag[]>(this.tags);
  public tags$ = this.tagsSubject.asObservable();

  constructor() { }

  getTags(): Observable<Tag[]> {
    return this.tags$;
  }

  getTagById(id: number): Tag | undefined {
    return this.tags.find(tag => tag.id === id);
  }

  createTag(tag: Tag): Observable<Tag> {
    const newTag = { ...tag, id: this.generateId() };
    this.tags.push(newTag);
    this.tagsSubject.next(this.tags);
    return new Observable(observer => {
      observer.next(newTag);
      observer.complete();
    });
  }

  updateTag(tag: Tag): Observable<Tag> {
    const index = this.tags.findIndex(t => t.id === tag.id);
    if (index !== -1) {
      this.tags[index] = tag;
      this.tagsSubject.next(this.tags);
    }
    return new Observable(observer => {
      observer.next(tag);
      observer.complete();
    });
  }

  deleteTag(id: number): Observable<void> {
    this.tags = this.tags.filter(tag => tag.id !== id);
    this.tagsSubject.next(this.tags);
    return new Observable(observer => {
      observer.complete();
    });
  }

  private generateId(): number {
    return this.tags.length > 0 ? Math.max(...this.tags.map(t => t.id || 0)) + 1 : 1;
  }
}