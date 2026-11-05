import { Router } from 'express';
import { authMiddleware, USERS_RULES } from '../../middlewares/auth.middleware';
import { MIME_TYPES, uploadMiddleware } from '../../middlewares/upload.middleware';
import { validateMiddleware } from '../../middlewares/validate.middleware';
import { noteController } from './note.controller';
import {
  createNoteSchema,
  notePaginationSchema,
  noteParamsSchema,
  updateNoteSchema,
} from './note.validation';
import { UPLOAD_DIRS } from '../../config/upload';

const noteImageUpload = uploadMiddleware.upload({
  folder: UPLOAD_DIRS.notes,
  fieldName: 'image',
  allowedMimeTypes: MIME_TYPES.IMAGE,
});

export class NoteRoute {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      authMiddleware.auth(),
      noteImageUpload,
      validateMiddleware.validate(createNoteSchema),
      noteController.createNote
    );
    this.router.get(
      '/',
      authMiddleware.auth(),
      validateMiddleware.validate(notePaginationSchema),
      noteController.getMyNotes
    );
    this.router.get(
      '/all',
      authMiddleware.auth(USERS_RULES.ADMIN, USERS_RULES.SUPER_ADMIN),
      validateMiddleware.validate(notePaginationSchema),
      noteController.getAllNotes
    );
    this.router.get(
      '/:id',
      authMiddleware.auth(),
      validateMiddleware.validate(noteParamsSchema),
      noteController.getNoteById
    );
    this.router.put(
      '/:id',
      authMiddleware.auth(),
      noteImageUpload,
      validateMiddleware.validate(updateNoteSchema),
      noteController.updateNote
    );
    this.router.delete(
      '/:id',
      authMiddleware.auth(),
      validateMiddleware.validate(noteParamsSchema),
      noteController.deleteNote
    );
  }
}

const noteRoute = new NoteRoute();
export const NoteRoutes = noteRoute.router;
