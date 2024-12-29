import { NextResponse } from "next/server";

export async function GET(_request, { params }) {

  try {
    const { code } = params;
    // Split IV and encrypted data
    const [ivHex, encryptedData] = code.split(':');

    // Convert hex to buffers
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey.padEnd(32)), iv);

    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return NextResponse.json({
      valid: true,
      message: decrypted
    });
  } catch (error) {
    return NextResponse.json({
      valid: false,
      message: 'Invalid code format'
    });
  }
}