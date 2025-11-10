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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const post_entity_1 = require("./post.entity");
let User = class User {
    id;
    userLogin;
    userPass;
    userNicename;
    userEmail;
    userUrl;
    userRegistered;
    userActivationKey;
    userStatus;
    displayName;
    posts;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ID', type: 'bigint', unsigned: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_login', type: 'varchar', length: 60, unique: true }),
    __metadata("design:type", String)
], User.prototype, "userLogin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_pass', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], User.prototype, "userPass", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_nicename', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], User.prototype, "userNicename", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_email', type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], User.prototype, "userEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_url', type: 'varchar', length: 100, default: '' }),
    __metadata("design:type", String)
], User.prototype, "userUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'user_registered', type: 'datetime' }),
    __metadata("design:type", Date)
], User.prototype, "userRegistered", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_activation_key', type: 'varchar', length: 255, default: '' }),
    __metadata("design:type", String)
], User.prototype, "userActivationKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_status', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "userStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_name', type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], User.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => post_entity_1.Post, post => post.author),
    __metadata("design:type", Array)
], User.prototype, "posts", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('wp_users')
], User);
//# sourceMappingURL=user.entity.js.map