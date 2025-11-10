"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("../entities/post.entity");
let PostsService = class PostsService {
    postRepository;
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async create(createPostDto, userId) {
        const slug = createPostDto.slug || this.generateSlug(createPostDto.title);
        const post = this.postRepository.create({
            postTitle: createPostDto.title,
            postContent: createPostDto.content,
            postExcerpt: createPostDto.excerpt || '',
            postStatus: createPostDto.status || 'draft',
            postName: slug,
            postAuthor: userId,
            guid: '',
            toPing: '',
            pinged: '',
            postContentFiltered: '',
            postType: 'post',
        });
        return this.postRepository.save(post);
    }
    async findAll(page = 1, limit = 10, status) {
        const query = this.postRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .where('post.postType = :type', { type: 'post' })
            .orderBy('post.postDate', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (status) {
            query.andWhere('post.postStatus = :status', { status });
        }
        const [posts, total] = await query.getManyAndCount();
        return {
            data: posts.map(post => this.transformPost(post)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        return this.transformPost(post);
    }
    async update(id, updatePostDto, userId) {
        const post = await this.postRepository.findOne({ where: { id } });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        if (updatePostDto.title) {
            post.postTitle = updatePostDto.title;
        }
        if (updatePostDto.content) {
            post.postContent = updatePostDto.content;
        }
        if (updatePostDto.excerpt !== undefined) {
            post.postExcerpt = updatePostDto.excerpt;
        }
        if (updatePostDto.status) {
            post.postStatus = updatePostDto.status;
        }
        if (updatePostDto.slug) {
            post.postName = updatePostDto.slug;
        }
        return this.postRepository.save(post);
    }
    async remove(id) {
        const post = await this.postRepository.findOne({ where: { id } });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        await this.postRepository.remove(post);
        return { message: 'Post deleted successfully' };
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    transformPost(post) {
        return {
            id: post.id.toString(),
            title: post.postTitle,
            content: post.postContent,
            excerpt: post.postExcerpt,
            author: post.author ? post.author.displayName : '',
            status: post.postStatus,
            publishDate: post.postDate,
            categories: [],
            tags: [],
            featured_image: '',
            meta: {},
            slug: post.postName,
            type: post.postType,
            modified: post.postModified,
        };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PostsService);
//# sourceMappingURL=posts.service.js.map