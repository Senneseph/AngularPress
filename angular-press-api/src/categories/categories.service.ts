import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Term } from '../entities/term.entity';
import { TermTaxonomy } from '../entities/term-taxonomy.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
    @InjectRepository(TermTaxonomy)
    private termTaxonomyRepository: Repository<TermTaxonomy>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = createCategoryDto.slug || this.generateSlug(createCategoryDto.name);

    const term = this.termRepository.create({
      name: createCategoryDto.name,
      slug: slug,
    });

    const savedTerm = await this.termRepository.save(term);

    const taxonomy = this.termTaxonomyRepository.create({
      termId: savedTerm.termId,
      taxonomy: 'category',
      description: createCategoryDto.description || '',
      parent: createCategoryDto.parentId || 0,
      count: 0,
    });

    await this.termTaxonomyRepository.save(taxonomy);

    return this.transformCategory(savedTerm, taxonomy);
  }

  async findAll(page: number = 1, limit: number = 50) {
    const query = this.termTaxonomyRepository.createQueryBuilder('taxonomy')
      .leftJoinAndSelect('taxonomy.term', 'term')
      .where('taxonomy.taxonomy = :taxonomy', { taxonomy: 'category' })
      .orderBy('term.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [taxonomies, total] = await query.getManyAndCount();

    return {
      data: taxonomies.map(t => this.transformCategory(t.term, t)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const taxonomy = await this.termTaxonomyRepository.findOne({
      where: { termTaxonomyId: id, taxonomy: 'category' },
      relations: ['term'],
    });

    if (!taxonomy) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.transformCategory(taxonomy.term, taxonomy);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const taxonomy = await this.termTaxonomyRepository.findOne({
      where: { termTaxonomyId: id, taxonomy: 'category' },
      relations: ['term'],
    });

    if (!taxonomy) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (updateCategoryDto.name) {
      taxonomy.term.name = updateCategoryDto.name;
      await this.termRepository.save(taxonomy.term);
    }

    if (updateCategoryDto.slug) {
      taxonomy.term.slug = updateCategoryDto.slug;
      await this.termRepository.save(taxonomy.term);
    }

    if (updateCategoryDto.description !== undefined) {
      taxonomy.description = updateCategoryDto.description;
    }

    if (updateCategoryDto.parentId !== undefined) {
      taxonomy.parent = updateCategoryDto.parentId;
    }

    await this.termTaxonomyRepository.save(taxonomy);

    return this.transformCategory(taxonomy.term, taxonomy);
  }

  async remove(id: number) {
    const taxonomy = await this.termTaxonomyRepository.findOne({
      where: { termTaxonomyId: id, taxonomy: 'category' },
      relations: ['term'],
    });

    if (!taxonomy) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.termTaxonomyRepository.remove(taxonomy);
    await this.termRepository.remove(taxonomy.term);

    return { message: 'Category deleted successfully' };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private transformCategory(term: Term, taxonomy: TermTaxonomy) {
    return {
      id: taxonomy.termTaxonomyId.toString(),
      name: term.name,
      slug: term.slug,
      description: taxonomy.description,
      parentId: taxonomy.parent,
      count: taxonomy.count,
    };
  }
}

