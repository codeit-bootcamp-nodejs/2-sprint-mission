import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

const {
  AWS_REGION = 'ap-northeast-2',
  AWS_S3_BUCKET = '',
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_PUBLIC_BASE, // ex) https://<bucket>.s3.<region>.amazonaws.com
} = process.env;

export const s3Bucket = AWS_S3_BUCKET;
export const s3Region = AWS_REGION;

export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials:
    AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
      ? { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY }
      : undefined, // EC2/IAM Role일 때는 undefined로 두세요.
});

// 단순 업로드 helper
export async function putObject(params: PutObjectCommandInput) {
  return s3Client.send(new PutObjectCommand(params));
}

export function getPublicUrl(key: string) {
  if (AWS_S3_PUBLIC_BASE) return `${AWS_S3_PUBLIC_BASE}/${key}`;
  return `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${key}`;
}

export const s3 = s3Client;