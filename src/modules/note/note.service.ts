import { INote, Note } from './note.model';
import { hasPrivilegedAccess } from '../../constants/users.rules';
import { ApiError } from '../../utils/apiResponse';
import { buildPaginatedResult, getPaginationParams } from '../../utils/pagination';
import { PaginatedResult, UserRole } from '../../types';
import { CreateNoteInput, UpdateNoteInput } from './note.interface';

export class NoteService {
  async createNote(authorId: string, data: CreateNoteInput, image?: string) {
    return Note.create({
      title: data.title,
      content: data.content,
      author: authorId,
      image,
    });
  }

  async getMyNotes(
    authorId: string,
    query: unknown
  ): Promise<PaginatedResult<INote>> {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = { author: authorId };

    const [notes, total] = await Promise.all([
      Note.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Note.countDocuments(filter),
    ]);

    return buildPaginatedResult(notes, total, page, limit);
  }

  async getAllNotes(query: unknown) {
    const { page, limit, skip } = getPaginationParams(query);

    const [notes, total] = await Promise.all([
      Note.find()
        .populate('author', 'name email profileImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Note.countDocuments(),
    ]);

    return buildPaginatedResult(notes, total, page, limit);
  }

  async getNoteById(noteId: string, userId: string, role: UserRole) {
    const note = await Note.findById(noteId).populate('author', 'name email profileImage');

    if (!note) {
      throw new ApiError(404, 'Note not found.');
    }

    const isOwner = note.author._id.toString() === userId;
    const isPrivileged = hasPrivilegedAccess(role);

    if (!isOwner && !isPrivileged) {
      throw new ApiError(403, 'You can only view your own notes.');
    }

    return note;
  }

  async updateNote(
    noteId: string,
    userId: string,
    data: UpdateNoteInput,
    image?: string
  ) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new ApiError(404, 'Note not found.');
    }

    if (note.author.toString() !== userId) {
      throw new ApiError(403, 'You can only update your own notes.');
    }

    if (!image && !data.title && !data.content) {
      throw new ApiError(400, 'At least one field or image is required to update.');
    }

    if (data.title) note.title = data.title;
    if (data.content) note.content = data.content;

    let previousImage: string | undefined;

    if (image) {
      previousImage = note.image;
      note.image = image;
    }

    await note.save();

    return { note, previousImage };
  }

  async deleteNote(noteId: string, userId: string) {
    const note = await Note.findById(noteId);

    if (!note) {
      throw new ApiError(404, 'Note not found.');
    }

    if (note.author.toString() !== userId) {
      throw new ApiError(403, 'You can only delete your own notes.');
    }

    const image = note.image;
    await note.deleteOne();

    return image;
  }
}

export const noteService = new NoteService();
