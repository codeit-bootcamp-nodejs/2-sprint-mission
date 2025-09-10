import { DocumentRepository } from "../repositories/documentRepository";
import path from "path";
import fs from "fs";
import { Prisma } from "@prisma/client";

export class DocumentService {
  private documentRepository: DocumentRepository;

  constructor(documentRepository: DocumentRepository) {
    this.documentRepository = documentRepository;
  }

  async getDocument(id: number) {
    const document = await this.documentRepository.findById(id);

    if (!document) {
      throw new Error("Document not found");
    }

    const filePath = path.join(
      __dirname,
      "../",
      "../",
      "uploads",
      document.filename
    );
    if (!fs.existsSync(filePath)) {
      console.error(`File not found on disk: ${filePath}`);
      throw new Error("File data mismatch: File not found on server.");
    }

    return {
      filePath: filePath,
      filename: document.filename,
      mimetype: document.mimetype,
    };
  }

  async createDocument(data: Prisma.DocumentCreateInput) {
    const createData: Prisma.DocumentCreateInput = {
      filename: data.filename,
      mimetype: data.mimetype,
      size: data.size,
      url: data.url,
    };

    const newDocument = await this.documentRepository.create(createData);
    return newDocument;
  }

  async deleteDocument(id: number) {
    //삭제할 document 존재 여부 확인
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new Error("Document not found");
    }
    //파일 경로 구성
    const filePath = path.join(
      __dirname,
      "../",
      "../",
      "uploads",
      document.filename
    );

    // 파일이 디스크에 존재하는지 확인 후 삭제
    if (fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
        console.log(`File successfully deleted from filesystem: ${filePath}`);
      } catch (fileDeleteError) {
        //삭제 실패 시 에러
        console.error(
          `Error deleting file from disk: ${filePath}`,
          fileDeleteError
        );
        throw new Error("Failed to delete file from server storage.");
      }
    } else {
      //db에는 정보가 있으나 실제 파일이 디스크에 없을 경우
      console.warn(
        `Attempted to delete document record, but file not found on disk: ${filePath}. Proceeding with DB record deletion.`
      );
    }
    //db에 있는 문서 정보 삭제
    const deletedDocument = await this.documentRepository.delete(id);
    return {
      message: "Document deleted successfully",
      deletedId: deletedDocument,
    };
  }
}
