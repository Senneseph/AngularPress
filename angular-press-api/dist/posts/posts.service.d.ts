import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsService {
    private postRepository;
    constructor(postRepository: Repository<Post>);
    create(createPostDto: CreatePostDto, userId: number): Promise<Post>;
    findAll(page?: number, limit?: number, status?: string): Promise<{
        data: {
            id: string;
            title: string;
            content: string;
            excerpt: string;
            author: string;
            status: "draft" | "published";
            publishDate: Date;
            categories: never[];
            tags: never[];
            featured_image: string;
            meta: {};
            slug: string;
            type: "post" | "page";
            modified: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        id: string;
        title: string;
        content: string;
        excerpt: string;
        author: string;
        status: "draft" | "published";
        publishDate: Date;
        categories: never[];
        tags: never[];
        featured_image: string;
        meta: {};
        slug: string;
        type: "post" | "page";
        modified: Date;
    }>;
    update(id: number, updatePostDto: UpdatePostDto, userId: number): Promise<Post>;
    remove(id: number): Promise<{
        message: string;
    }>;
    private generateSlug;
    private transformPost;
}
