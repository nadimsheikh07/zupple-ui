export interface UserModel {
    id?: string;
    email: string;
    name?: string | null;
    password?: string | null;
    status?: boolean;
    accessToken?: string;
    refreshToken?: string;
}