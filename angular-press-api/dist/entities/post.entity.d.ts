import { User } from './user.entity';
import { Term } from './term.entity';
export declare class Post {
    id: number;
    postAuthor: number;
    postDate: Date;
    postDateGmt: Date;
    postContent: string;
    postTitle: string;
    postExcerpt: string;
    postStatus: string;
    commentStatus: string;
    pingStatus: string;
    postPassword: string;
    postName: string;
    toPing: string;
    pinged: string;
    postModified: Date;
    postModifiedGmt: Date;
    postContentFiltered: string;
    postParent: number;
    guid: string;
    menuOrder: number;
    postType: string;
    postMimeType: string;
    commentCount: number;
    author: User;
    terms: Term[];
}
