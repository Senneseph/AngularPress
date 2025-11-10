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
exports.Term = void 0;
const typeorm_1 = require("typeorm");
const term_taxonomy_entity_1 = require("./term-taxonomy.entity");
let Term = class Term {
    termId;
    name;
    slug;
    termGroup;
    taxonomy;
};
exports.Term = Term;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'term_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", Number)
], Term.prototype, "termId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Term.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'slug', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Term.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'term_group', type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], Term.prototype, "termGroup", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => term_taxonomy_entity_1.TermTaxonomy, termTaxonomy => termTaxonomy.term),
    __metadata("design:type", term_taxonomy_entity_1.TermTaxonomy)
], Term.prototype, "taxonomy", void 0);
exports.Term = Term = __decorate([
    (0, typeorm_1.Entity)('wp_terms')
], Term);
//# sourceMappingURL=term.entity.js.map