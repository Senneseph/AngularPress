import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { TermTaxonomy } from './term-taxonomy.entity';

@Entity('wp_terms')
export class Term {
  @PrimaryGeneratedColumn({ name: 'term_id', type: 'bigint', unsigned: true })
  termId: number;

  @Column({ name: 'name', type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'slug', type: 'varchar', length: 200 })
  slug: string;

  @Column({ name: 'term_group', type: 'bigint', default: 0 })
  termGroup: number;

  @OneToOne(() => TermTaxonomy, termTaxonomy => termTaxonomy.term)
  taxonomy: TermTaxonomy;
}

