import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: any): Promise<import("../entities/post.entity").Post>;
    findAll(page?: string, limit?: string, status?: string): Promise<{
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
    findOne(id: string): Promise<{
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
    update(id: string, updatePostDto: UpdatePostDto, req: any): Promise<import("../entities/post.entity").Post>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
