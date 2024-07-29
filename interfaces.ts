/*eslint-disable*/
export interface UserInterface {
  username: string;
  password: string;
  getUsername(): string;
  getPassword(): string;
}

export interface SchemeInterface {
  name: string | null;
  params: {
    handshaketoken: string;
    hash: string;
  };
  param(name: string): any | null;
  getName(): string | null;
}

export interface SpecificationInterface {
  hash: Function;
  bits: number;
  getHash(): Function;
  getBits(): number;
}

export interface ScramHeaderInterface {}

export interface AuthInterface {
  host: string;
  encryptor: EncryptorInterface;
  getStringToBase64UriUTF8(string: string): string;
  parse3WAuth(header: string): SchemeInterface | null;
  getHashSpecification(
    hashType: string,
    encryptor: EncryptorInterface
  ): SpecificationInterface;
}

export interface EncryptorInterface {
  convertStringToBigEndian(string: string): any;
  convertBigEndianToString(words: any): string;
  getNonce(length?: number): string;
  calculateXor(
    a: string,
    b: string,
    convertStringToBigEndian: Function,
    convertBigEndianToString: Function
  ): string;
  convertToHexadecimalString(string: string, uppercase?: boolean): string;
  getBase64String(string: string): string;
  getBase64QueryString(string: string): string;
  encodeStringToUTF8(string: string): string;
  decodeBase64Uri(string: string): string;
  getSHA1FromString(string: string): string;
  getSHA1FromBigEndian(words: any, length: number): number[];
  getSHA256FromBigEndian(words: any, length: number): number[];
  sha1(data?: string, key?: string): string;
  sha256(encryptor: EncryptorInterface, data?: string, key?: string): string;
  bitwiseRotate(num: any, cnt: any): number;
  safeAdd(x: any, y: any): number;
  getSHA1Tcf(t: any, b: any, c: any, d: any): number;
  gerSHA1AdditiveConstant(t: any): any;
  getCalculateHMACSHA1(key: any, data: any): string;
  getCalculateHMACSHA256(key: any, data: any): string;
  getCalculateSHA256(string: string): string;
  getSha256Sigma0256(x: any): number;
  getSha256Sigma1256(x: any): number;
  getSha256Gamma0256(x: any): number;
  getSha256Gamma1256(x: any): number;
  getPbkdf2HmacSha256(
    key: any,
    salt: string,
    iterations: number,
    dkLen: number | undefined
  ): string;
}

export interface ParserInterface {
  header: string;
  position: number;
  current: number;
  peek: number;
  consume(): void;
  reset(position: number): void;
  eof(): boolean;
  commaOws(): void;
  ows(): void;
  isOws(): boolean;
  parseQuotedString(): string;
  parseToken(terms: number[]): string;
  checkParseAuthParam(params: any): boolean;
  parseAuthParams(): any;
  nextScheme(): SchemeInterface | null;
}
