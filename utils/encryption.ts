// utils/encryption.ts
import { Buffer } from 'buffer';

/**
 * Simple encryption utility for medical records
 * Note: This is a basic implementation for demonstration purposes
 * In production, use a more robust encryption library like crypto.subtle
 */

// Simple XOR encryption (for demonstration only - not secure for production)
export class SimpleEncryption {
  static async encrypt(data: ArrayBuffer, key: string): Promise<ArrayBuffer> {
    const keyBuffer = new TextEncoder().encode(key);
    const dataView = new Uint8Array(data);
    const encrypted = new Uint8Array(dataView.length);
    
    for (let i = 0; i < dataView.length; i++) {
      encrypted[i] = dataView[i] ^ keyBuffer[i % keyBuffer.length];
    }
    
    return encrypted.buffer;
  }
  
  static async decrypt(data: ArrayBuffer, key: string): Promise<ArrayBuffer> {
    // XOR decryption is the same as encryption
    return this.encrypt(data, key);
  }
}

// More secure encryption using Web Crypto API
export class WebCryptoEncryption {
  static async generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }
  
  static async encrypt(data: ArrayBuffer, key: CryptoKey): Promise<{ encryptedData: ArrayBuffer; iv: ArrayBuffer }> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      data
    );
    
    return {
      encryptedData,
      iv: iv.buffer
    };
  }
  
  static async decrypt(encryptedData: ArrayBuffer, key: CryptoKey, iv: ArrayBuffer): Promise<ArrayBuffer> {
    return crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      key,
      encryptedData
    );
  }
  
  static async exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey("jwk", key);
    return JSON.stringify(exported);
  }
  
  static async importKey(keyData: string): Promise<CryptoKey> {
    const jwk = JSON.parse(keyData);
    return crypto.subtle.importKey(
      "jwk",
      jwk,
      {
        name: "AES-GCM",
      },
      true,
      ["encrypt", "decrypt"]
    );
  }
}

// Utility functions for handling medical record encryption
export class MedicalRecordEncryption {
  /**
   * Encrypt a medical record with a password
   * @param fileData The file data as ArrayBuffer
   * @param password The encryption password
   * @returns Encrypted data with IV
   */
  static async encryptRecord(fileData: ArrayBuffer, password: string): Promise<{ encryptedData: ArrayBuffer; iv: ArrayBuffer }> {
    // Generate a key from the password
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new Uint8Array(16), // In production, use a random salt
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    
    // Encrypt the data
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      fileData
    );
    
    return {
      encryptedData,
      iv: iv.buffer
    };
  }
  
  /**
   * Decrypt a medical record with a password
   * @param encryptedData The encrypted data
   * @param iv The initialization vector
   * @param password The decryption password
   * @returns Decrypted data
   */
  static async decryptRecord(encryptedData: ArrayBuffer, iv: ArrayBuffer, password: string): Promise<ArrayBuffer> {
    // Generate a key from the password
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new Uint8Array(16), // Must match the salt used for encryption
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    
    // Decrypt the data
    return crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      key,
      encryptedData
    );
  }
}