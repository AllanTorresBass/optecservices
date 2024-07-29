/*eslint-disable*/
import { EncryptorInterface } from './interfaces';
import { decode } from 'base-64';

export default class Encryptor implements EncryptorInterface {
  private Base64Table =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

  private sha256K = new Array(
    1116352408,
    1899447441,
    -1245643825,
    -373957723,
    961987163,
    1508970993,
    -1841331548,
    -1424204075,
    -670586216,
    310598401,
    607225278,
    1426881987,
    1925078388,
    -2132889090,
    -1680079193,
    -1046744716,
    -459576895,
    -272742522,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    -1740746414,
    -1473132947,
    -1341970488,
    -1084653625,
    -958395405,
    -710438585,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    -2117940946,
    -1838011259,
    -1564481375,
    -1474664885,
    -1035236496,
    -949202525,
    -778901479,
    -694614492,
    -200395387,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    -2067236844,
    -1933114872,
    -1866530822,
    -1538233109,
    -1090935817,
    -965641998
  );

  public convertStringToBigEndian(string: string) {
    const output = Array(string.length >> 2);

    for (var i = 0; i < output.length; i++) {
      output[i] = 0;
    }

    for (var i = 0; i < string.length * 8; i += 8) {
      output[i >> 5] |= (string.charCodeAt(i / 8) & 0xff) << (24 - (i % 32));
    }

    return output;
  }

  public convertBigEndianToString(words: any): string {
    let output = '';

    for (let i = 0; i < words.length * 32; i += 8) {
      output += String.fromCharCode((words[i >> 5] >>> (24 - (i % 32))) & 0xff);
    }

    return output;
  }

  public getNonce(length?: number): string {
    if (length == null) {
      length = 24;
    }

    let text = '';
    const possible = this.Base64Table;

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  public calculateXor(
    a: string,
    b: string,
    convertStringToBigEndian: Function,
    convertBigEndianToString: Function
  ): string {
    const aw = convertStringToBigEndian(a);
    const bw = convertStringToBigEndian(b);

    if (aw.length != bw.length) {
      throw "Lengths don't match";
    }

    for (let i = 0; i < aw.length; ++i) {
      aw[i] ^= bw[i];
    }

    return convertBigEndianToString(aw);
  }

  public convertToHexadecimalString(
    string: string,
    uppercase: boolean = false
  ): string {
    const hexadecimalTable = uppercase
      ? '0123456789ABCDEF'
      : '0123456789abcdef';
    let output = '';
    let x;

    for (let i = 0; i < string.length; i++) {
      x = string.charCodeAt(i);
      output +=
        hexadecimalTable.charAt((x >>> 4) & 0x0f) +
        hexadecimalTable.charAt(x & 0x0f);
    }

    return output;
  }

  public getBase64String(string: string): string {
    const base64Padding = '=';
    const length = string.length;
    let output = '';
    let triplet;

    for (let i = 0; i < length; i += 3) {
      triplet =
        (string.charCodeAt(i) << 16) |
        (i + 1 < length ? string.charCodeAt(i + 1) << 8 : 0) |
        (i + 2 < length ? string.charCodeAt(i + 2) : 0);

      for (let j = 0; j < 4; j++) {
        if (i * 8 + j * 6 > string.length * 8) {
          output += base64Padding;
        } else {
          output += this.Base64Table.charAt((triplet >>> (6 * (3 - j))) & 0x3f);
        }
      }
    }

    return output;
  }

  public getBase64QueryString(string: string): string {
    return this.getBase64String(string)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  public decodeBase64Uri(string: string): string {
    return decode(string.replace(/\-/g, '+').replace(/_/g, '/'));
  }

  public encodeStringToUTF8(string: string): string {
    return unescape(encodeURIComponent(string));
  }

  public bitwiseRotate(num: any, cnt: any): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  public safeAdd(x: any, y: any): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);

    return (msw << 16) | (lsw & 0xffff);
  }

  public getSHA1Tcf(t: any, b: any, c: any, d: any): number {
    if (t < 20) return (b & c) | (~b & d);

    if (t < 40) return b ^ c ^ d;

    if (t < 60) return (b & c) | (b & d) | (c & d);

    return b ^ c ^ d;
  }

  public gerSHA1AdditiveConstant(t: any) {
    return t < 20
      ? 1518500249
      : t < 40
      ? 1859775393
      : t < 60
      ? -1894007588
      : -899497514;
  }

  public getSHA1FromBigEndian(words: any, length: number): number[] {
    words[length >> 5] |= 0x80 << (24 - (length % 32));
    words[(((length + 64) >> 9) << 4) + 15] = length;

    const w = Array(80);
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;

    for (let i = 0; i < words.length; i += 16) {
      const olda = a;
      const oldb = b;
      const oldc = c;
      const oldd = d;
      const olde = e;

      for (let j = 0; j < 80; j++) {
        if (j < 16) w[j] = words[i + j];
        else {
          w[j] = this.bitwiseRotate(
            w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16],
            1
          );
        }
        const t = this.safeAdd(
          this.safeAdd(this.bitwiseRotate(a, 5), this.getSHA1Tcf(j, b, c, d)),
          this.safeAdd(this.safeAdd(e, w[j]), this.gerSHA1AdditiveConstant(j))
        );
        e = d;
        d = c;
        c = this.bitwiseRotate(b, 30);
        b = a;
        a = t;
      }

      a = this.safeAdd(a, olda);
      b = this.safeAdd(b, oldb);
      c = this.safeAdd(c, oldc);
      d = this.safeAdd(d, oldd);
      e = this.safeAdd(e, olde);
    }

    return Array(a, b, c, d, e);
  }

  public getCalculateHMACSHA1(key: any, data: any): string {
    let bkey = this.convertStringToBigEndian(key);

    if (bkey.length > 16) {
      bkey = this.getSHA1FromBigEndian(bkey, key.length * 8);
    }

    const ipad = Array(16);
    const opad = Array(16);
    for (let i = 0; i < 16; i++) {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5c5c5c5c;
    }

    const hash = this.getSHA1FromBigEndian(
      ipad.concat(this.convertStringToBigEndian(data)),
      512 + data.length * 8
    );

    return this.convertBigEndianToString(
      this.getSHA1FromBigEndian(opad.concat(hash), 512 + 160)
    );
  }

  public getSHA1FromString(string: string): string {
    return this.convertBigEndianToString(
      this.getSHA1FromBigEndian(
        this.convertStringToBigEndian(string),
        string.length * 8
      )
    );
  }

  public sha1(data?: string, key?: string): string {
    let hash;

    data = this.encodeStringToUTF8(data ?? '');

    if (key === undefined) {
      hash = this.getSHA1FromString(data);
    } else {
      key = this.encodeStringToUTF8(key);
      hash = this.getCalculateHMACSHA1(key, data);
    }

    return hash;
  }

  public sha256S(X: any, n: any): number {
    return (X >>> n) | (X << (32 - n));
  }

  public sha256R(X: any, n: any): number {
    return X >>> n;
  }

  public getSha256Sigma0256(x: any): number {
    return this.sha256S(x, 2) ^ this.sha256S(x, 13) ^ this.sha256S(x, 22);
  }

  public getSha256Sigma1256(x: any): number {
    return this.sha256S(x, 6) ^ this.sha256S(x, 11) ^ this.sha256S(x, 25);
  }

  public getSha256Gamma0256(x: any): number {
    return this.sha256S(x, 7) ^ this.sha256S(x, 18) ^ this.sha256R(x, 3);
  }

  public getSha256Gamma1256(x: any): number {
    return this.sha256S(x, 17) ^ this.sha256S(x, 19) ^ this.sha256R(x, 10);
  }

  public sha256Ch(x: any, y: any, z: any): number {
    return (x & y) ^ (~x & z);
  }

  public sha256Maj(x: any, y: any, z: any): number {
    return (x & y) ^ (x & z) ^ (y & z);
  }

  public getSHA256FromBigEndian(words: any, length: number): number[] {
    const HASH = new Array(
      1779033703,
      -1150833019,
      1013904242,
      -1521486534,
      1359893119,
      -1694144372,
      528734635,
      1541459225
    );
    const W = new Array(64);
    let a, b, c, d, e, f, g, h;
    let i, j, T1, T2;

    /* append padding */
    words[length >> 5] |= 0x80 << (24 - (length % 32));
    words[(((length + 64) >> 9) << 4) + 15] = length;

    for (i = 0; i < words.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];

      for (j = 0; j < 64; j++) {
        if (j < 16) W[j] = words[j + i];
        else {
          W[j] = this.safeAdd(
            this.safeAdd(
              this.safeAdd(this.getSha256Gamma1256(W[j - 2]), W[j - 7]),
              this.getSha256Gamma0256(W[j - 15])
            ),
            W[j - 16]
          );
        }

        T1 = this.safeAdd(
          this.safeAdd(
            this.safeAdd(
              this.safeAdd(h, this.getSha256Sigma1256(e)),
              this.sha256Ch(e, f, g)
            ),
            this.sha256K[j]
          ),
          W[j]
        );
        T2 = this.safeAdd(this.getSha256Sigma0256(a), this.sha256Maj(a, b, c));
        h = g;
        g = f;
        f = e;
        e = this.safeAdd(d, T1);
        d = c;
        c = b;
        b = a;
        a = this.safeAdd(T1, T2);
      }

      HASH[0] = this.safeAdd(a, HASH[0]);
      HASH[1] = this.safeAdd(b, HASH[1]);
      HASH[2] = this.safeAdd(c, HASH[2]);
      HASH[3] = this.safeAdd(d, HASH[3]);
      HASH[4] = this.safeAdd(e, HASH[4]);
      HASH[5] = this.safeAdd(f, HASH[5]);
      HASH[6] = this.safeAdd(g, HASH[6]);
      HASH[7] = this.safeAdd(h, HASH[7]);
    }

    return HASH;
  }

  public getCalculateSHA256(string: string): string {
    return this.convertBigEndianToString(
      this.getSHA256FromBigEndian(
        this.convertStringToBigEndian(string),
        string.length * 8
      )
    );
  }

  public getCalculateHMACSHA256(key: any, data: any): string {
    let bkey = this.convertStringToBigEndian(key);

    if (bkey.length > 16) {
      bkey = this.getSHA256FromBigEndian(bkey, key.length * 8);
    }

    const ipad = Array(16);
    const opad = Array(16);

    for (let i = 0; i < 16; i++) {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5c5c5c5c;
    }

    const hash = this.getSHA256FromBigEndian(
      ipad.concat(this.convertStringToBigEndian(data)),
      512 + data.length * 8
    );

    return this.convertBigEndianToString(
      this.getSHA256FromBigEndian(opad.concat(hash), 512 + 256)
    );
  }

  public sha256(
    encryptor: EncryptorInterface,
    data?: string,
    key?: string
  ): string {
    let hash;

    if (key === undefined) {
      hash = encryptor.getCalculateSHA256(data ?? '');
    } else {
      hash = encryptor.getCalculateHMACSHA256(key, data);
    }

    return hash;
  }

  public calculateF(P: any, S: string, c: number, i: any) {
    let U_r;
    let U_c;

    S = S + this.convertBigEndianToString([i]);
    U_r = U_c = this.getCalculateHMACSHA256(P, S);
    for (let iter = 1; iter < c; ++iter) {
      U_c = this.getCalculateHMACSHA256(P, U_c);
      U_r = this.calculateXor(
        U_r,
        U_c,
        this.convertStringToBigEndian,
        this.convertBigEndianToString
      );
    }
    return U_r;
  }

  public getPbkdf2HmacSha256(
    key: any,
    salt: string,
    iterations: number,
    dkLen: number | undefined
  ): string {
    const hLen = 32; // sha256 output hash size in bytes
    // @ts-ignore
    const l = Math.ceil(dkLen / hLen);
    // @ts-ignore
    const r = dkLen - (l - 1) * hLen;
    let T = '';
    let block;

    for (let i = 1; i <= l; ++i) {
      block = this.calculateF(key, salt, iterations, i);
      T += block;
    }

    return T.substr(0, dkLen);
  }
}
