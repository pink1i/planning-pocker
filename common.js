import crypto from "crypto"
const secretKey = process.env.SECRET_KEY || "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3"
const algorithm = 'aes-256-ctr'

export const encrypt = (text) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
      iv: iv.toString('hex'),
      content: encrypted.toString('hex')
  };
}

export const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

  return decrpyted.toString();

};
