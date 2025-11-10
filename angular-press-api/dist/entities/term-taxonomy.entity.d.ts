import { Term } from './term.entity';
export declare class TermTaxonomy {
    termTaxonomyId: number;
    termId: number;
    taxonomy: string;
    description: string;
    parent: number;
    count: number;
    term: Term;
}
