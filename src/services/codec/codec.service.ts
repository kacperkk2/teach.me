import { Injectable } from '@angular/core';
import { compressToBase64, decompressFromBase64 } from 'lz-string';
import { DataType, MigrationDataWrapper } from '../migration/migration.service';
import { TightCompressorService } from '../tight-compressor/tight-compressor.service';

@Injectable({
  providedIn: 'root'
})
export class CodecService {

  constructor(private tightCompressor: TightCompressorService) { }
  
  pack(data: any, type: DataType): string {
    const tightCompressed: string = this.tightCompressor.compress(data, type);
    const wrapped: string = this.wrapMigrationData(tightCompressed, type);
    return this.compressEncode(wrapped);
  }

  unpack(data: string): [any, DataType] {
    const decodedDecompressed = this.decodeDecompress(data);
    const unwrapped: MigrationDataWrapper = this.unwrapMigrationData(decodedDecompressed);
    const unpacked = this.tightCompressor.decompress(unwrapped.data, unwrapped.type);
    return [unpacked, unwrapped.type];
  }

  private compressEncode(data: any) {
    return encodeURIComponent(compressToBase64(data));
  }

  private decodeDecompress(data: any) {
    return decompressFromBase64(decodeURIComponent(data));
  }

  private wrapMigrationData(data: string, type: DataType): string {
    return JSON.stringify({
      data: data,
      type: type
    })
  }

  private unwrapMigrationData(data: any): MigrationDataWrapper {
    return JSON.parse(data || '{}');
  }
}
