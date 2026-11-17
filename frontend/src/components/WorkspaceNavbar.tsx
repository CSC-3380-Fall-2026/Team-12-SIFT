
import {
    Upload, Type, Pencil, Hand, MousePointer2
} from 'lucide-react';

export function WorkspaceNavbar() {
    return (
        <section className="editing-toolbar" aria-label="Editing tools">
            <button type="button" aria-label="Upload media" title="Upload media">
                <Upload size={24} />
            </button>
            <button type="button" aria-label="Edit text" title="Edit text">
                <Type size={24} />
            </button>
            <button type="button" aria-label="Draw" title="Draw">
                <Pencil size={24} />
            </button>
            <button type="button" aria-label="Move" title="Move">
                <Hand size={24} />
            </button>
            <button type="button" aria-label="Select" title="Select">
                <MousePointer2 size={24} />
            </button>
        </section>
    );
}
