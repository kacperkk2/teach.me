import { Injectable } from '@angular/core';
import { DataType, MigrationData, MigrationDataWrapper } from '../migration/migration.service';
import { compressToBase64, decompressFromBase64 } from 'lz-string';

@Injectable({
  providedIn: 'root'
})
export class CodecService {

  constructor() { }
  
  pack(data: any, type: DataType): string {
    const wrapped = this.wrapMigrationData(data, type);
    return this.compressEncode(wrapped);
  }

  unpack(data: string): MigrationDataWrapper {
    const decodedDecompressed = this.decodeDecompress(data);
    return this.unwrapMigrationData(decodedDecompressed);
  }

  private compressEncode(data: any) {
    return encodeURIComponent(compressToBase64(data));
  }

  private decodeDecompress(data: any) {
    return decompressFromBase64(decodeURIComponent(data));
  }

  private wrapMigrationData(data: any, type: DataType): string {
    return JSON.stringify({
      data: JSON.stringify(data),
      type: type
    })
  }

  private unwrapMigrationData(data: any): any {
    return JSON.parse(data || '{}');
  }
}
