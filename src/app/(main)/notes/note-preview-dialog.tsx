'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { Doc } from '../../../../convex/_generated/dataModel';
import { useSearchParams } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';
import { toast } from 'sonner';

export interface NotePreviewDialogProps {
    note: Doc<'notes'>;
}

export function NotePreviewDialog({ note }: NotePreviewDialogProps) {
    const searchParams = useSearchParams();
    const isOpen = searchParams.get('noteId') === note._id;

    const deleteNote = useMutation(api.notes.deleteNote);
    const [deletePending, setDeletePending] = useState(false);

    const handleClose = () => {
        if (deletePending) return;
        window.history.pushState({}, '', '/notes');
    };

    const handleDelete = async () => {
        setDeletePending(true);
        try {
            await deleteNote({ noteId: note._id });
            toast.success('Note deleted successfully');
            handleClose();
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error('Failed to delete note');
        } finally {
            setDeletePending(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className='sm:max-w-[625px]'>
                <DialogHeader>
                    <DialogTitle> {note.title} </DialogTitle>
                </DialogHeader>
                <div className='mt-4 whitespace-pre-wrap'>{note.body}</div>
                <DialogFooter className='mt-6'>
                    <Button
                        variant='destructive'
                        className='gap-2'
                        onClick={handleDelete}
                        disabled={deletePending}
                    >
                        <Trash2 size={16} />
                        {deletePending ? 'Deleting...' : 'Delete Note'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
