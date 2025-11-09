import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [
    {
      id: 1,
      title: 'Welcome to Angular Press',
      content: 'This is a sample post created with Angular Press CMS.',
      excerpt: 'Sample post introduction',
      status: 'publish',
      type: 'post',
      authorId: 1,
      dateCreated: new Date(),
      dateModified: new Date(),
      slug: 'welcome-to-angular-press',
      categories: [1],
      tags: ['angular', 'cms']
    },
    {
      id: 2,
      title: 'Getting Started Guide',
      content: 'This guide will help you get started with Angular Press.',
      excerpt: 'Getting started with Angular Press',
      status: 'publish',
      type: 'page',
      authorId: 1,
      dateCreated: new Date(),
      dateModified: new Date(),
      slug: 'getting-started',
      categories: [2]
    }
  ];

  private postsSubject = new BehaviorSubject<Post[]>(this.posts);
  public posts$ = this.postsSubject.asObservable();

  constructor() { }

  getPosts(): Observable<Post[]> {
    return this.posts$;
  }

  getPostById(id: number): Post | undefined {
    return this.posts.find(post => post.id === id);
  }

  createPost(post: Post): Observable<Post> {
    const newPost = { ...post, id: this.generateId() };
    this.posts.push(newPost);
    this.postsSubject.next(this.posts);
    return new Observable(observer => {
      observer.next(newPost);
      observer.complete();
    });
  }

  updatePost(post: Post): Observable<Post> {
    const index = this.posts.findIndex(p => p.id === post.id);
    if (index !== -1) {
      this.posts[index] = post;
      this.postsSubject.next(this.posts);
    }
    return new Observable(observer => {
      observer.next(post);
      observer.complete();
    });
  }

  deletePost(id: number): Observable<void> {
    this.posts = this.posts.filter(post => post.id !== id);
    this.postsSubject.next(this.posts);
    return new Observable(observer => {
      observer.complete();
    });
  }

  private generateId(): number {
    return this.posts.length > 0 ? Math.max(...this.posts.map(p => p.id || 0)) + 1 : 1;
  }
}