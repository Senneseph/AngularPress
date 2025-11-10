"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermTaxonomy = void 0;
const typeorm_1 = require("typeorm");
const term_entity_1 = require("./term.entity");
let TermTaxonomy = class TermTaxonomy {
    termTaxonomyId;
    termId;
    taxonomy;
    description;
    parent;
    count;
    term;
};
exports.TermTaxonomy = TermTaxonomy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'term_taxonomy_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", Number)
], TermTaxonomy.prototype, "termTaxonomyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'term_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", Number)
], TermTaxonomy.prototype, "termId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'taxonomy', type: 'varchar', length: 32 }),
    __metadata("design:type", String)
], TermTaxonomy.prototype, "taxonomy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'longtext' }),
    __metadata("design:type", String)
], TermTaxonomy.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent', type: 'bigint', unsigned: true, default: 0 }),
    __metadata("design:type", Number)
], TermTaxonomy.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'count', type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], TermTaxonomy.prototype, "count", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => term_entity_1.Term, term => term.taxonomy),
    (0, typeorm_1.JoinColumn)({ name: 'term_id' }),
    __metadata("design:type", term_entity_1.Term)
], TermTaxonomy.prototype, "term", void 0);
exports.TermTaxonomy = TermTaxonomy = __decorate([
    (0, typeorm_1.Entity)('wp_term_taxonomy')
], TermTaxonomy);
//# sourceMappingURL=term-taxonomy.entity.js.map