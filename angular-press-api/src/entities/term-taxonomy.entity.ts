import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Term } from './term.entity';

@Entity('wp_term_taxonomy')
export class TermTaxonomy {
  @PrimaryGeneratedColumn({ name: 'term_taxonomy_id', type: 'bigint', unsigned: true })
  termTaxonomyId: number;

  @Column({ name: 'term_id', type: 'bigint', unsigned: true })
  termId: number;

  @Column({ name: 'taxonomy', type: 'varchar', length: 32 })
  taxonomy: string;

  @Column({ name: 'description', type: 'longtext' })
  description: string;

  @Column({ name: 'parent', type: 'bigint', unsigned: true, default: 0 })
  parent: number;

  @Column({ name: 'count', type: 'bigint', default: 0 })
  count: number;

  @OneToOne(() => Term, term => term.taxonomy)
  @JoinColumn({ name: 'term_id' })
  term: Term;
}

