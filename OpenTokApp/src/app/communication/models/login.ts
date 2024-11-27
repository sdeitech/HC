export interface ILoginDto {
    portalType?: string;
    orgnizationKey?: string;
    email: string;
    password: string;
    remember_me?: boolean;
}