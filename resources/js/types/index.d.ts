import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        permissions: string[];
        roles: string[];
    };
    ziggy: Config & { location: string };
};

export interface Devotee {
    id: number;
    name: string;
    name_ml: string | null;
    phone: string;
    star: string | null;
}
