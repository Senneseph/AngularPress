import { Post } from './post.entity';
export declare class User {
    id: number;
    userLogin: string;
    userPass: string;
    userNicename: string;
    userEmail: string;
    userUrl: string;
    userRegistered: Date;
    userActivationKey: string;
    userStatus: number;
    displayName: string;
    posts: Post[];
}
