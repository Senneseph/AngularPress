import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
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

  async findAll(page: number = 1, limit: number = 10, status?: string) {
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

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return this.transformPost(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
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

  async remove(id: number) {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    await this.postRepository.remove(post);
    return { message: 'Post deleted successfully' };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private transformPost(post: Post) {
    return {
      id: post.id.toString(),
      title: post.postTitle,
      content: post.postContent,
      excerpt: post.postExcerpt,
      author: post.author ? post.author.displayName : '',
      status: post.postStatus as 'draft' | 'published',
      publishDate: post.postDate,
      categories: [],
      tags: [],
      featured_image: '',
      meta: {},
      slug: post.postName,
      type: post.postType as 'post' | 'page',
      modified: post.postModified,
    };
  }
}

