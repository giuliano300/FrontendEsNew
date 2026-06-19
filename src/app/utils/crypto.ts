import { AES, Base64, CBC, Pkcs7, Utf8, type CipherParams } from 'crypto-es';

export const CryptoJS = {
  AES,
  enc: {
    Base64,
    Utf8
  },
  mode: {
    CBC
  },
  pad: {
    Pkcs7
  }
};

export type CryptoCipherParams = CipherParams;
