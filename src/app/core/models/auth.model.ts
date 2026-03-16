/**
 * Login credentials request sent to the API.
 */
export interface LoginRequest {

    /** User email used for authentication. */
    email: string;

    /** User password. */
    password: string;

}



/**
 * Response returned from the API after successful login.
 */
export interface LoginResponse {

    /** JWT token issued by the API. */
    token: string;

}



/**
 * Represents the decoded JWT payload.
 *
 * This allows Angular to read roles and permissions embedded inside the JWT token.
 */
export interface JwtPayload {

    sub: string;

    email: string;

    exp: number;

    /** User roles. */
    role?: string | string[];

    /** Application permissions. */
    permission?: string[];
}
