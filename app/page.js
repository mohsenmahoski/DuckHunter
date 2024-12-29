import SetCode from "../components/setCode";
import crypto from  "crypto";
const secretKey = 'bDC`8C71&2{c';

export default function Home() {
  // Generate encrypted code using AES-256-CBC
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey.padEnd(32)), iv);
  let uniqueCode = cipher.update('ITram', 'utf8', 'hex');
  uniqueCode += cipher.final('hex');
  // Combine IV and encrypted data
  uniqueCode = iv.toString('hex') + ':' + uniqueCode;

  return (
    <SetCode uniqueCode={uniqueCode} />
  );
}
