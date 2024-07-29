/*eslint-disable*/
import {
  AuthInterface,
  EncryptorInterface,
  SchemeInterface,
  SpecificationInterface,
  UserInterface
} from './interfaces';
import axios from 'axios';
import Parser from './parser';
import Specification from './specification';
import { decode } from 'base-64';
import ScramHeader from './scram.header';

export default class HaystackAuth implements AuthInterface {
  host: string;
  encryptor: EncryptorInterface;

  public constructor(host: string, encryptor: EncryptorInterface) {
    this.host = host;
    this.encryptor = encryptor;
  }

  public getStringToBase64UriUTF8(string: string): string {
    return this.encryptor.getBase64QueryString(string);
  }

  public getAuthToken(header: string) {
    const data: ScramHeader = this.decodeData(header);

    // @ts-ignore
    return data.authToken;
  }

  public async processSignIn(user: UserInterface) {
    try {
      const headerHello = `HELLO username=${this.getStringToBase64UriUTF8(
        user.getUsername()
      )}`;
      await axios.get(`${this.host}/ui`, {
        headers: { Authorization: headerHello }
      });

      throw new Error(
        'Failed message with code different to 401 in Hello Message'
      );
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        const scheme = this.parse3WAuth(
          error.response.headers['www-authenticate']
        );
        const [header, headerBare] = this.getScramHeader(
          user,
          scheme,
          this.encryptor
        );

        try {
          await axios.get(`${this.host}/ui`, {
            headers: { Authorization: header }
          });

          throw new Error(
            'Failed message with code different to 401 in First Message'
          );
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            const messageScheme = this.parse3WAuth(
              error.response.headers['www-authenticate']
            );
            const lastHeader = this.getAuthHeader(
              user,
              messageScheme ?? null,
              this.decodeData,
              this.encryptor,
              headerBare
            );

            try {
              const response = await axios.get(`${this.host}/ui`, {
                headers: { Authorization: lastHeader }
              });

              if (response.status === 200) {
                const authToken = this.getAuthToken(
                  response.headers['authentication-info']
                );

                return { token: authToken };
              }
            } catch (error: any) {
              throw new Error('Failed last message: ' + error.response.text);
            }
          }
        }
      }
    }
  }

  public async processSignOut(): Promise<void> {
    try {
      await axios.get(`${this.host}/user/logout`);
    } catch (error: any) {
      throw new Error('Failed last message: ' + error.response.text);
    }
  }

  public parse3WAuth(header: string): SchemeInterface | null {
    const parser = new Parser(header);

    return parser.nextScheme();
  }

  public decodeData(string: string): object {
    const data: object = {};

    string.split(',').forEach(function (token) {
      const n = token.indexOf('=');
      if (n > 0) {
        // @ts-ignore
        data[token.substring(0, n)] = token.substring(n + 1);
      }
    });

    return data;
  }

  public getHashSpecification(
    hashType: string,
    encryptor: EncryptorInterface
  ): SpecificationInterface {
    let specification: SpecificationInterface;

    switch (hashType.toLowerCase()) {
      case 'sha-1':
        specification = new Specification(encryptor.sha1, 160);
        break;
      case 'sha-256':
        specification = new Specification(encryptor.sha256, 256);
        break;
      default:
        throw 'Unsupported hashFunc: ' + hashType;
    }

    return specification;
  }

  public getScramHeader(
    user: UserInterface,
    scheme: SchemeInterface | null,
    encryptor: EncryptorInterface,
    messageHeader: string = 'n,,'
  ) {
    const messageNonce = encryptor.getNonce(24);
    const headerBare = 'n=' + user.getUsername() + ',r=' + messageNonce;
    const headerMessage = messageHeader + headerBare;
    const headerData = encryptor.getBase64QueryString(headerMessage);
    const token = scheme?.param('handshakeToken');
    let header = scheme?.getName() + ' data=' + headerData;

    if (token != null) {
      header += ', handshakeToken=' + token;
    }

    return [header, headerBare];
  }

  public getAuthHeader(
    user: UserInterface,
    schema: SchemeInterface | null,
    decodeHandler: Function,
    encryptor: EncryptorInterface,
    headerBare: string,
    messageHeader: string = 'n,,'
  ): string {
    const hashType = schema?.params.hash;
    const hashSpecification = this.getHashSpecification(
      hashType ?? '',
      encryptor
    );
    const hash = hashSpecification.getHash();
    const keyBits = hashSpecification.getBits();
    // @ts-ignore
    const data = decode(schema.param('data'));
    const dataDecoded = decodeHandler(data);
    const channelBinding = 'c=' + encryptor.getBase64String(messageHeader);
    const nonce = 'r=' + dataDecoded.r;
    const clientNoProof = channelBinding + ',' + nonce;
    const salt = decode(dataDecoded.s);
    const iterations = parseInt(dataDecoded.i);
    const saltedPassword = encryptor.getPbkdf2HmacSha256(
      user.getPassword(),
      salt,
      iterations,
      keyBits / 8
    );
    const clientKey = hash(encryptor, 'Client Key', saltedPassword);
    const storedKey = hash(encryptor, clientKey);
    const authMsg = headerBare + ',' + data + ',' + clientNoProof;
    const clientSig = hash(encryptor, authMsg, storedKey);
    const proof = encryptor.getBase64String(
      encryptor.calculateXor(
        clientKey,
        clientSig,
        encryptor.convertStringToBigEndian,
        encryptor.convertBigEndianToString
      )
    );
    const headerFinalMessage = clientNoProof + ',p=' + proof;
    const headerFinalData = encryptor.getBase64QueryString(headerFinalMessage);
    const token = schema?.param('handshakeToken');
    let header = '' + schema?.name + ' data=' + headerFinalData;

    if (token != null) {
      header += ', handshakeToken=' + token;
    }

    return header;
  }
}
