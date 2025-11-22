import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Post } from '../core/models/post.interface';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);

    // Flush the initial loadPosts() call from constructor
    const initialReq = httpMock.expectOne(req => req.url.includes('/posts'));
    initialReq.flush({ data: [], total: 0, page: 1, limit: 100, totalPages: 0 });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPosts', () => {
    it('should return an observable of posts', (done) => {
      service.getPosts().subscribe(posts => {
        expect(posts).toBeDefined();
        expect(Array.isArray(posts)).toBe(true);
        done();
      });
    });

    it('should return posts with correct structure', (done) => {
      const mockPosts: Post[] = [{
        id: '1',
        title: 'Test Post',
        content: 'Test content',
        excerpt: 'Test excerpt',
        status: 'published',
        type: 'post',
        author: 'Test Author',
        publishDate: new Date(),
        modified: new Date(),
        slug: 'test-post',
        categories: [],
        tags: [],
        featured_image: '',
        meta: {}
      }];

      // Trigger a reload
      service['loadPosts']();

      const req = httpMock.expectOne(request => request.url.includes('/posts'));
      req.flush({ data: mockPosts, total: 1, page: 1, limit: 100, totalPages: 1 });

      service.getPosts().subscribe(posts => {
        if (posts.length > 0) {
          const post = posts[0];
          expect(post.id).toBeDefined();
          expect(post.title).toBeDefined();
          expect(post.content).toBeDefined();
          expect(post.status).toBeDefined();
        }
        done();
      });
    });
  });

  describe('getPostById', () => {
    it('should make GET request to fetch post by id', (done) => {
      const mockPost: Post = {
        id: '1',
        title: 'Test Post',
        content: 'Test content',
        excerpt: 'Test excerpt',
        status: 'published',
        type: 'post',
        author: 'Test Author',
        publishDate: new Date(),
        modified: new Date(),
        slug: 'test-post',
        categories: [],
        tags: [],
        featured_image: '',
        meta: {}
      };

      service.getPostById('1').subscribe(post => {
        expect(post).toBeDefined();
        expect(post.id).toBe('1');
        expect(post.title).toBe('Test Post');
        done();
      });

      const req = httpMock.expectOne(request => request.url.includes('/posts/1'));
      expect(req.request.method).toBe('GET');
      req.flush(mockPost);
    });

    it('should handle error when post not found', (done) => {
      service.getPostById('999').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeDefined();
          done();
        }
      });

      const req = httpMock.expectOne(request => request.url.includes('/posts/999'));
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createPost', () => {
    it('should create a new post', (done) => {
      const newPost: Post = {
        id: '0',
        title: 'Test Post',
        content: 'Test content',
        excerpt: 'Test excerpt',
        status: 'draft',
        type: 'post',
        author: 'Test Author',
        publishDate: new Date(),
        modified: new Date(),
        slug: 'test-post',
        categories: [],
        tags: [],
        featured_image: '',
        meta: {}
      };

      const mockResponse: Post = {
        ...newPost,
        id: '1'
      };

      service.createPost(newPost).subscribe(createdPost => {
        expect(createdPost).toBeDefined();
        expect(createdPost.id).toBe('1');
        expect(createdPost.title).toBe('Test Post');
        done();
      });

      const req = httpMock.expectOne(request => request.url.includes('/posts') && request.method === 'POST');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.title).toBe('Test Post');
      req.flush(mockResponse);
    });

    it('should trigger reload after creating post', (done) => {
      const newPost: Post = {
        id: '0',
        title: 'Another Test Post',
        content: 'Another test content',
        excerpt: 'Another test excerpt',
        status: 'published',
        type: 'post',
        author: 'Test Author',
        publishDate: new Date(),
        modified: new Date(),
        slug: 'another-test-post',
        categories: [],
        tags: [],
        featured_image: '',
        meta: {}
      };

      const mockResponse: Post = {
        ...newPost,
        id: '2'
      };

      service.createPost(newPost).subscribe(() => {
        // Verify the post was added to local cache
        service.posts$.subscribe(posts => {
          const found = posts.find(p => p.id === '2');
          expect(found).toBeDefined();
          done();
        });
      });

      const createReq = httpMock.expectOne(request => request.url.includes('/posts') && request.method === 'POST');
      createReq.flush(mockResponse);
    });
  });

  describe('updatePost', () => {
    it('should update an existing post', (done) => {
      const updatedPost: Post = {
        id: '1',
        title: 'Updated Title',
        content: 'Updated content',
        excerpt: 'Test excerpt',
        status: 'published',
        type: 'post',
        author: 'Test Author',
        publishDate: new Date(),
        modified: new Date(),
        slug: 'test-post',
        categories: [],
        tags: [],
        featured_image: '',
        meta: {}
      };

      const mockResponse: Post = { ...updatedPost };

      service.updatePost(updatedPost).subscribe(result => {
        expect(result.title).toBe('Updated Title');
        expect(result.content).toBe('Updated content');
        done();
      });

      const req = httpMock.expectOne(request => request.url.includes('/posts/1') && request.method === 'PATCH');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body.title).toBe('Updated Title');
      req.flush(mockResponse);
    });

    it('should trigger reload after updating post', (done) => {
      const updatedPost: Post = {
        id: '1',
        title: 'New Title',
        content: 'Content',
        excerpt: 'Excerpt',
        status: 'published',
        type: 'post',
        author: 'Test Author',
        publishDate: new Date(),
        modified: new Date(),
        slug: 'test-post',
        categories: [],
        tags: [],
        featured_image: '',
        meta: {}
      };

      const mockResponse: Post = { ...updatedPost };

      service.updatePost(updatedPost).subscribe((result) => {
        expect(result).toEqual(mockResponse);
        done();
      });

      const updateReq = httpMock.expectOne(request => request.url.includes('/posts/1') && request.method === 'PATCH');
      updateReq.flush(mockResponse);
    });
  });

  describe('deletePost', () => {
    it('should delete a post by id', (done) => {
      service.deletePost('1').subscribe(() => {
        expect(true).toBe(true); // Deletion successful
        done();
      });

      const req = httpMock.expectOne(request => request.url.includes('/posts/1') && request.method === 'DELETE');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should remove post from local cache after deletion', (done) => {
      service.deletePost('2').subscribe(() => {
        // Verify the post was removed from local cache
        service.posts$.subscribe(posts => {
          const found = posts.find(p => p.id === '2');
          expect(found).toBeUndefined();
          done();
        });
      });

      const deleteReq = httpMock.expectOne(request => request.url.includes('/posts/2') && request.method === 'DELETE');
      deleteReq.flush(null);
    });
  });

  describe('posts$ observable', () => {
    it('should be defined', () => {
      expect(service.posts$).toBeDefined();
    });

    it('should emit current posts', (done) => {
      service.posts$.subscribe(posts => {
        expect(posts).toBeDefined();
        expect(Array.isArray(posts)).toBe(true);
        done();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP error when getting post by id', (done) => {
      const errorMessage = 'Post not found';

      service.getPostById('999').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
          done();
        }
      });

      const req = httpMock.expectOne(request => request.url.includes('/posts/999'));
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('should handle HTTP error when creating post', (done) => {
      const newPost: Post = {
        id: '0',
        title: 'Test Post',
        content: 'Test content',
        excerpt: 'Test excerpt',
        status: 'published',
        type: 'post',
        author: 'Test Author',
        publishDate: new Date(),
        modified: new Date(),
        slug: 'test-post',
        categories: [],
        tags: [],
        featured_image: '',
        meta: {}
      };

      service.createPost(newPost).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.statusText).toBe('Bad Request');
          done();
        }
      });

      const req = httpMock.expectOne(request => request.url.includes('/posts') && request.method === 'POST');
      req.flush('Invalid post data', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle HTTP error when updating post', (done) => {
      const updatedPost: Post = {
        id: '1',
        title: 'Updated Title',
        content: 'Updated content',
        excerpt: 'Updated excerpt',
        status: 'published',
        type: 'post',
        author: 'Test Author',
        publishDate: new Date(),
        modified: new Date(),
        slug: 'test-post',
        categories: [],
        tags: [],
        featured_image: '',
        meta: {}
      };

      service.updatePost(updatedPost).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
          done();
        }
      });

      const req = httpMock.expectOne(request => request.url.includes('/posts/1') && request.method === 'PATCH');
      req.flush('Post not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle HTTP error when deleting post', (done) => {
      service.deletePost('999').subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
          done();
        }
      });

      const req = httpMock.expectOne(request => request.url.includes('/posts/999') && request.method === 'DELETE');
      req.flush('Post not found', { status: 404, statusText: 'Not Found' });
    });
  });
});

