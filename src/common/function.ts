import SHA256 from "crypto-js/sha256";
import CryptoJS from "crypto-js";
/**
 * Mã hóa dữ liệu
 * @param value Giá trị cần mã hóa
 * @param pass Mật khẩu mã hóa
 * @returns
 */
function encrypt(value: string, pass: string): string {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);

  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: 256 / 32,
    iterations: 100,
  });

  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const encrypted = CryptoJS.AES.encrypt(value, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  const transitmessage = salt.toString() + iv.toString() + encrypted.toString();
  return transitmessage;
}

/**
 * Giải mã dữ liệu
 * @param value Giá trị mã hóa
 * @param pass Mật khẩu giải ma
 * @returns
 */
function decrypt(value: string, pass: string): string {
  const salt = CryptoJS.enc.Hex.parse(value.substr(0, 32));
  const iv = CryptoJS.enc.Hex.parse(value.substr(32, 32));
  const encrypted = value.substring(64);

  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: 256 / 32,
    iterations: 100,
  });

  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * Lưu trữ localStorage đã được mã hóa.
 */
const HRMStorage = {
  get: (key: string): string => {
    try {
      //const Util = require("../utils/util");
      //const SHA256 = require("crypto-js/sha256");
      const keySave = SHA256(key).toString();
      const value = localStorage.getItem(keySave);
      if (value !== "" && value !== null) {
        const data = decrypt(value, keySave);
        return data;
      }
      return "";
    } catch (error) {
      console.log("ERROR:", error);
      return "";
    }
  },
  set: (key: string, value?: string): boolean => {
    try {
      // const Util = require("../utils/util");
      //const SHA256 = require("crypto-js/sha256");
      const keySave = SHA256(key).toString();
      let saveData = "";
      if (value !== undefined && value !== "") {
        saveData = encrypt(value, keySave);
      }
      localStorage.setItem(keySave, saveData);
      return true;
    } catch (error) {
      console.log("ERROR:", error);
      return false;
    }
  },
  remove: (key: string): boolean => {
    try {
      //const SHA256 = require("crypto-js/sha256");
      const keySave = SHA256(key).toString();
      localStorage.removeItem(keySave);
      return true;
    } catch (error) {
      console.log("ERROR:", error);
      return false;
    }
  },
  clear: () => {
    localStorage.clear();
  },
};

export default HRMStorage;
export { HRMStorage, decrypt, encrypt };
