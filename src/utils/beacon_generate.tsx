export type Endianness = "little" | "big";

export class BinaryEncoder {
  private buffer: Uint8Array;
  private offset: number;
  private littleEndian: boolean;

  constructor(initialSize = 128, endianness: Endianness = "little") {
    this.buffer = new Uint8Array(initialSize);
    this.offset = 0;
    this.littleEndian = endianness === "little";
  }

  private ensureCapacity(extra: number) {
    const required = this.offset + extra;
    if (required <= this.buffer.length) return;

    let newSize = this.buffer.length;
    while (newSize < required) newSize *= 2;

    const newBuf = new Uint8Array(newSize);
    newBuf.set(this.buffer);
    this.buffer = newBuf;
  }

  writeUint32(value: number) {
    this.ensureCapacity(4);
    const view = new DataView(this.buffer.buffer);
    view.setUint32(this.offset, value, this.littleEndian);
    this.offset += 4;
  }

  writeInt32(value: number) {
    this.ensureCapacity(4);
    const view = new DataView(this.buffer.buffer);
    view.setInt32(this.offset, value, this.littleEndian);
    this.offset += 4;
  }

  writeInt16(value: number) {
    this.ensureCapacity(2);
    const view = new DataView(this.buffer.buffer);
    view.setInt16(this.offset, value, this.littleEndian);
    this.offset += 2;
  }

  writeBytes(bytes: ArrayBuffer | ArrayBufferView) {
    let byteView: Uint8Array;
    if (bytes instanceof ArrayBuffer) {
      // Raw buffer → wrap directly
      byteView = new Uint8Array(bytes);
    } else {
      // Typed array → reinterpret its underlying bytes
      byteView = new Uint8Array(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength,
      );
    }

    this.writeUint32(bytes.byteLength);

    this.ensureCapacity(byteView.length);
    this.buffer.set(byteView, this.offset);
    this.offset += byteView.length;
  }

  // UTF‑8 string: uint32 length prefix + bytes + null terminator
  writeStringWithLength(str: string) {
    const encoded = new TextEncoder().encode(str);
    const totalLength = encoded.length + 1; // +1 for null terminator

    this.writeUint32(totalLength);

    this.ensureCapacity(encoded.length + 1);
    this.buffer.set(encoded, this.offset);
    this.offset += encoded.length;

    this.buffer[this.offset] = 0x00;
    this.offset += 1;
  }

  // UTF‑16LE string: uint32 byte length prefix + UTF‑16LE bytes + 0x0000 terminator
  writeStringUtf16LEWithLength(str: string) {
    const codeUnits = new Uint16Array(str.length + 1);

    for (let i = 0; i < str.length; i++) {
      codeUnits[i] = str.charCodeAt(i);
    }

    codeUnits[str.length] = 0x0000; // null terminator

    const byteLength = codeUnits.byteLength;

    this.writeUint32(byteLength);

    this.ensureCapacity(byteLength);
    const byteView = new Uint8Array(codeUnits.buffer);
    this.buffer.set(byteView, this.offset);
    this.offset += byteLength;
  }

  finalize(): ArrayBuffer {
    const length = this.offset;

    const finalBuf = new Uint8Array(4 + length);
    const view = new DataView(finalBuf.buffer);

    view.setUint32(0, length, this.littleEndian);
    finalBuf.set(this.buffer.slice(0, length), 4);

    return finalBuf.buffer;
  }
}

export function bufferToHex(input: ArrayBuffer | ArrayBufferView): string {
  let bytes: Uint8Array;

  if (input instanceof ArrayBuffer) {
    bytes = new Uint8Array(input);
  } else {
    bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  }

  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}
