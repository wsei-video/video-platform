import { AuthRequestContext } from './auth/auth-request.context';

declare module 'express' {
  export interface Request {
    user?: AuthRequestContext;
  }
}
