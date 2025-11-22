import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Term } from '../entities/term.entity';
import { TermTaxonomy } from '../entities/term-taxonomy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Term, TermTaxonomy])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}

