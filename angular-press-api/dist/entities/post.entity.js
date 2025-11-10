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
exports.Post = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const term_entity_1 = require("./term.entity");
let Post = class Post {
    id;
    postAuthor;
    postDate;
    postDateGmt;
    postContent;
    postTitle;
    postExcerpt;
    postStatus;
    commentStatus;
    pingStatus;
    postPassword;
    postName;
    toPing;
    pinged;
    postModified;
    postModifiedGmt;
    postContentFiltered;
    postParent;
    guid;
    menuOrder;
    postType;
    postMimeType;
    commentCount;
    author;
    terms;
};
exports.Post = Post;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID', type: 'bigint', unsigned: true }),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_author', type: 'bigint', unsigned: true }),
    __metadata("design:type", Number)
], Post.prototype, "postAuthor", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'post_date', type: 'datetime' }),
    __metadata("design:type", Date)
], Post.prototype, "postDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'post_date_gmt', type: 'datetime' }),
    __metadata("design:type", Date)
], Post.prototype, "postDateGmt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_content', type: 'longtext' }),
    __metadata("design:type", String)
], Post.prototype, "postContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_title', type: 'text' }),
    __metadata("design:type", String)
], Post.prototype, "postTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_excerpt', type: 'text' }),
    __metadata("design:type", String)
], Post.prototype, "postExcerpt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_status', type: 'varchar', length: 20, default: 'draft' }),
    __metadata("design:type", String)
], Post.prototype, "postStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'comment_status', type: 'varchar', length: 20, default: 'open' }),
    __metadata("design:type", String)
], Post.prototype, "commentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ping_status', type: 'varchar', length: 20, default: 'open' }),
    __metadata("design:type", String)
], Post.prototype, "pingStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_password', type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], Post.prototype, "postPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_name', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Post.prototype, "postName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_ping', type: 'text' }),
    __metadata("design:type", String)
], Post.prototype, "toPing", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pinged', type: 'text' }),
    __metadata("design:type", String)
], Post.prototype, "pinged", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'post_modified', type: 'datetime' }),
    __metadata("design:type", Date)
], Post.prototype, "postModified", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'post_modified_gmt', type: 'datetime' }),
    __metadata("design:type", Date)
], Post.prototype, "postModifiedGmt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_content_filtered', type: 'longtext' }),
    __metadata("design:type", String)
], Post.prototype, "postContentFiltered", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_parent', type: 'bigint', unsigned: true, default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "postParent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'guid', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Post.prototype, "guid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'menu_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "menuOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_type', type: 'varchar', length: 20, default: 'post' }),
    __metadata("design:type", String)
], Post.prototype, "postType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_mime_type', type: 'varchar', length: 100, default: '' }),
    __metadata("design:type", String)
], Post.prototype, "postMimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'comment_count', type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "commentCount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.posts),
    (0, typeorm_1.JoinColumn)({ name: 'post_author' }),
    __metadata("design:type", user_entity_1.User)
], Post.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => term_entity_1.Term),
    (0, typeorm_1.JoinTable)({
        name: 'wp_term_relationships',
        joinColumn: { name: 'object_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'term_taxonomy_id' }
    }),
    __metadata("design:type", Array)
], Post.prototype, "terms", void 0);
exports.Post = Post = __decorate([
    (0, typeorm_1.Entity)('wp_posts')
], Post);
//# sourceMappingURL=post.entity.js.map