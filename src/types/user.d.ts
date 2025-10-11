export interface UserModel {
    id?: string;
    name?: string | null;
    email: string | null;
    password?: string | null;
    status?: boolean;
    accessToken?: string;
    refreshToken?: string;
}