import { Router } from "express";
import upload from "../middleware/upload";
import { DocumentService } from "../services/documentService";
import { DocumentController } from "../controllers/documentController";
import { DocumentRepository } from "../repositories/documentRepository";
import prisma from "../lib/prisma";

const DocumentRouter = (): Router => {
  const router = Router();

  const documentRepository = new DocumentRepository(prisma);
  const documentService = new DocumentService(documentRepository);
  const documentController = new DocumentController(documentService);

  router.get("/download/:id", documentController.getDocument);
  router.post(
    "/upload",
    upload.single("file"),
    documentController.createDocument
  );
  router.delete("/:id", documentController.deleteDocument);

  return router;
};

export default DocumentRouter;
