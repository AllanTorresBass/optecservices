import { SpecificationInterface } from './interfaces';

export default class Specification implements SpecificationInterface {
  hash: Function;
  bits: number;

  public constructor(hash: Function, bits: number) {
    this.hash = hash;
    this.bits = bits;
  }

  public getHash(): Function {
    return this.hash;
  }

  public getBits(): number {
    return this.bits;
  }
}
