import { Response } from 'express';
import { UPLOAD_DIRS } from '../../config/upload';
import { NoteService } from './note.service';
import { sendResponse } from '../../utils/apiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { deleteUploadedFile, getPublicUploadUrl } from '../../utils/file';
import { AuthRequest } from '../../types';
import { CreateNoteInput, UpdateNoteInput } from './note.interface';

export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  createNote = catchAsync(async (req: AuthRequest, res: Response) => {
    const image = req.file
      ? getPublicUploadUrl(UPLOAD_DIRS.notes, req.file.filename)
      : undefined;

    const note = await this.noteService.createNote(
      req.user!.userId,
      req.body as CreateNoteInput,
      image
    );
    sendResponse({
      res,
      data: note,
      message: 'Note created successfully.',
      statusCode: 201,
    });
  });

  getMyNotes = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await this.noteService.getMyNotes(req.user!.userId, req.query);
    sendResponse({ res, data: result.data, pagination: result.pagination });
  });

  getAllNotes = catchAsync(async (req: AuthRequest, res: Response) => {
    const result = await this.noteService.getAllNotes(req.query);
    sendResponse({ res, data: result.data, pagination: result.pagination });
  });

  getNoteById = catchAsync(async (req: AuthRequest, res: Response) => {
    const note = await this.noteService.getNoteById(
      req.params.id,
      req.user!.userId,
      req.user!.role
    );
    sendResponse({ res, data: note });
  });

  updateNote = catchAsync(async (req: AuthRequest, res: Response) => {
    const image = req.file
      ? getPublicUploadUrl(UPLOAD_DIRS.notes, req.file.filename)
      : undefined;

    const { note, previousImage } = await this.noteService.updateNote(
      req.params.id,
      req.user!.userId,
      req.body as UpdateNoteInput,
      image
    );

    if (previousImage) {
      deleteUploadedFile(previousImage);
    }

    sendResponse({ res, data: note, message: 'Note updated successfully.' });
  });

  deleteNote = catchAsync(async (req: AuthRequest, res: Response) => {
    const image = await this.noteService.deleteNote(req.params.id, req.user!.userId);

    deleteUploadedFile(image);

    sendResponse({ res, data: null, message: 'Note deleted successfully.' });
  });
}

export const noteController = new NoteController(new NoteService());
