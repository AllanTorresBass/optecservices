import { SchemeInterface } from './interfaces';

export default class Scheme implements SchemeInterface {
  name: string | null;
  params: any;

  public constructor() {
    this.name = null;
    this.params = {};
  }

  public param(name: string) {
    let value = null;
    const params = this.params;

    Object.keys(params).forEach(function (key) {
      if (key.toLowerCase() === name.toLowerCase()) {
        value = params[key];
      }
    });

    return value;
  }

  public getName(): string | null {
    return this.name;
  }
}
