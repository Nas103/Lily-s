declare module 'bcryptjs' {
  interface BcryptJS {
    hash(data: string, saltOrRounds: number): Promise<string>;
    compare(data: string, encrypted: string): Promise<boolean>;
    hashSync(data: string, saltOrRounds: number): string;
    compareSync(data: string, encrypted: string): boolean;
  }
  const bcrypt: BcryptJS;
  export default bcrypt;
  export function hash(data: string, saltOrRounds: number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function hashSync(data: string, saltOrRounds: number): string;
  export function compareSync(data: string, encrypted: string): boolean;
}

