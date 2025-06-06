import api from '@/api';
import routes from './route';
import { buildURL } from '@/lib/stringUtils';
import type { NoteForm } from '@/app/features/notes/components/NoteForm';

export const getAllNotes = async () =>
  await api.get<HTTPResponse<Note[]>>(routes.notes);

export const getNotesById = async (id: string) =>
  await api.get<HTTPResponse<NoteShow>>(buildURL(routes.note_id, { id }));

export const createNote = async (data: NoteForm) =>
  await api.post(routes.notes_create, data);

export const updateNote = async (id: string, data: NoteForm) =>
  await api.put(buildURL(routes.note_id, { id }), data);

export const deleteNote = async (id: string) =>
  await api.delete(buildURL(routes.note_id, { id }));

export const getAllCategoryNotes = async () =>
  await api.get<HTTPResponse<NoteCategory[]>>(routes.notes);

export const getAllNotesByCategoryId = async (params: string = '') =>
  await api.get(routes.notes_category + `?${params}`);

export const notePinned = async (id: string) =>
  await api.patch(buildURL(routes.note_pin, { id }));
