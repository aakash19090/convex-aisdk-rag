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

export interface NotePreviewDialogProps {
    note: Doc<'notes'>;
}

export function NotePreviewDialog({ note }: NotePreviewDialogProps) {
    const searchParams = useSearchParams();
    const isOpen = searchParams.get('noteId') === note._id;

    const handleClose = () => {
        window.history.pushState({}, '', '/notes');
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className='sm:max-w-[625px]'>
                <DialogHeader>
                    <DialogTitle> {note.title} </DialogTitle>
                </DialogHeader>
                <div className='mt-4 whitespace-pre-wrap'>{note.body}</div>
                <DialogFooter className='mt-6'>
                    <Button variant='destructive' className='gap-2'>
                        <Trash2 size={16} />
                        Delete Note
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
