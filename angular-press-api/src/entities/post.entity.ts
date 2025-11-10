import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Term } from './term.entity';

@Entity('wp_posts')
export class Post {
  @PrimaryGeneratedColumn({ name: 'ID', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'post_author', type: 'bigint', unsigned: true })
  postAuthor: number;

  @CreateDateColumn({ name: 'post_date', type: 'datetime' })
  postDate: Date;

  @CreateDateColumn({ name: 'post_date_gmt', type: 'datetime' })
  postDateGmt: Date;

  @Column({ name: 'post_content', type: 'longtext' })
  postContent: string;

  @Column({ name: 'post_title', type: 'text' })
  postTitle: string;

  @Column({ name: 'post_excerpt', type: 'text' })
  postExcerpt: string;

  @Column({ name: 'post_status', type: 'varchar', length: 20, default: 'draft' })
  postStatus: string;

  @Column({ name: 'comment_status', type: 'varchar', length: 20, default: 'open' })
  commentStatus: string;

  @Column({ name: 'ping_status', type: 'varchar', length: 20, default: 'open' })
  pingStatus: string;

  @Column({ name: 'post_password', type: 'varchar', length: 255, default: '' })
  postPassword: string;

  @Column({ name: 'post_name', type: 'varchar', length: 200 })
  postName: string;

  @Column({ name: 'to_ping', type: 'text' })
  toPing: string;

  @Column({ name: 'pinged', type: 'text' })
  pinged: string;

  @UpdateDateColumn({ name: 'post_modified', type: 'datetime' })
  postModified: Date;

  @UpdateDateColumn({ name: 'post_modified_gmt', type: 'datetime' })
  postModifiedGmt: Date;

  @Column({ name: 'post_content_filtered', type: 'longtext' })
  postContentFiltered: string;

  @Column({ name: 'post_parent', type: 'bigint', unsigned: true, default: 0 })
  postParent: number;

  @Column({ name: 'guid', type: 'varchar', length: 255 })
  guid: string;

  @Column({ name: 'menu_order', type: 'int', default: 0 })
  menuOrder: number;

  @Column({ name: 'post_type', type: 'varchar', length: 20, default: 'post' })
  postType: string;

  @Column({ name: 'post_mime_type', type: 'varchar', length: 100, default: '' })
  postMimeType: string;

  @Column({ name: 'comment_count', type: 'bigint', default: 0 })
  commentCount: number;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'post_author' })
  author: User;

  @ManyToMany(() => Term)
  @JoinTable({
    name: 'wp_term_relationships',
    joinColumn: { name: 'object_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'term_taxonomy_id' }
  })
  terms: Term[];
}

