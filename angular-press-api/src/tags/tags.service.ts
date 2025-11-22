import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Term } from '../entities/term.entity';
import { TermTaxonomy } from '../entities/term-taxonomy.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
    @InjectRepository(TermTaxonomy)
    private termTaxonomyRepository: Repository<TermTaxonomy>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const slug = createTagDto.slug || this.generateSlug(createTagDto.name);

    const term = this.termRepository.create({
      name: createTagDto.name,
      slug: slug,
    });

    const savedTerm = await this.termRepository.save(term);

    const taxonomy = this.termTaxonomyRepository.create({
      termId: savedTerm.termId,
      taxonomy: 'post_tag',
      description: createTagDto.description || '',
      parent: 0,
      count: 0,
    });

    await this.termTaxonomyRepository.save(taxonomy);

    return this.transformTag(savedTerm, taxonomy);
  }

  async findAll(page: number = 1, limit: number = 50) {
    const query = this.termTaxonomyRepository.createQueryBuilder('taxonomy')
      .leftJoinAndSelect('taxonomy.term', 'term')
      .where('taxonomy.taxonomy = :taxonomy', { taxonomy: 'post_tag' })
      .orderBy('term.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [taxonomies, total] = await query.getManyAndCount();

    return {
      data: taxonomies.map(t => this.transformTag(t.term, t)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const taxonomy = await this.termTaxonomyRepository.findOne({
      where: { termTaxonomyId: id, taxonomy: 'post_tag' },
      relations: ['term'],
    });

    if (!taxonomy) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return this.transformTag(taxonomy.term, taxonomy);
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const taxonomy = await this.termTaxonomyRepository.findOne({
      where: { termTaxonomyId: id, taxonomy: 'post_tag' },
      relations: ['term'],
    });

    if (!taxonomy) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    if (updateTagDto.name) {
      taxonomy.term.name = updateTagDto.name;
      await this.termRepository.save(taxonomy.term);
    }

    if (updateTagDto.slug) {
      taxonomy.term.slug = updateTagDto.slug;
      await this.termRepository.save(taxonomy.term);
    }

    if (updateTagDto.description !== undefined) {
      taxonomy.description = updateTagDto.description;
    }

    await this.termTaxonomyRepository.save(taxonomy);

    return this.transformTag(taxonomy.term, taxonomy);
  }

  async remove(id: number) {
    const taxonomy = await this.termTaxonomyRepository.findOne({
      where: { termTaxonomyId: id, taxonomy: 'post_tag' },
      relations: ['term'],
    });

    if (!taxonomy) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    await this.termTaxonomyRepository.remove(taxonomy);
    await this.termRepository.remove(taxonomy.term);

    return { message: 'Tag deleted successfully' };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private transformTag(term: Term, taxonomy: TermTaxonomy) {
    return {
      id: taxonomy.termTaxonomyId.toString(),
      name: term.name,
      slug: term.slug,
      description: taxonomy.description,
      count: taxonomy.count,
    };
  }
}

