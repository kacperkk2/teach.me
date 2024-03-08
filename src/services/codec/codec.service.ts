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
    console.log('wrapped', wrapped)
    return this.compressEncode(wrapped);
  }

  unpack(data: string): MigrationDataWrapper {
    const decodedDecompressed = this.decodeDecompress(data);
    return this.unwrapMigrationData(decodedDecompressed);
  }

  private compressEncode(data: any) {
    // console.log('compressToBase64(data)', compressToBase64(data))
    // console.log('encodeURIComponent(compressToBase64(data)', encodeURIComponent(compressToBase64(data)))
    // console.log('decodeURIComponent(encodeURIComponent(compressToBase64(data))', 
    //     decodeURIComponent(encodeURIComponent(compressToBase64(data))))
    // console.log('decompressFromBase64 encodeURIComponent(compressToBase64(data)', 
    //     decompressFromBase64(decodeURIComponent(encodeURIComponent(compressToBase64(data)))))
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
