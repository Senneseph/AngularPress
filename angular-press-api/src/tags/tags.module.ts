import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Term } from '../entities/term.entity';
import { TermTaxonomy } from '../entities/term-taxonomy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Term, TermTaxonomy])],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}

