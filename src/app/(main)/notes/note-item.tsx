'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doc } from '../../../../convex/_generated/dataModel';
import { NotePreviewDialog } from './note-preview-dialog';

export interface NoteItemProps {
    note: Doc<'notes'>;
}

export function NoteItem({ note }: NoteItemProps) {
    const handleOpenNote = () => {
        // using window.history.pushState without useRouter as its faster and to change the URL without reloading
        window.history.pushState({}, '', `?noteId=${note._id}`);
    };

    return (
        <>
            <Card
                className='cursor-pointer hover:shadow-md transition-shadow'
                onClick={handleOpenNote}
            >
                <CardHeader>
                    <CardTitle> {note.title} </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='line-clamp-3 text-sm text-muted-foreground whitespace-pre-line'>
                        {note.body}
                    </div>
                </CardContent>
            </Card>
            <NotePreviewDialog note={note} />
        </>
    );
}
