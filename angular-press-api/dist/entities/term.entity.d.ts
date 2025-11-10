import { TermTaxonomy } from './term-taxonomy.entity';
export declare class Term {
    termId: number;
    name: string;
    slug: string;
    termGroup: number;
    taxonomy: TermTaxonomy;
}
