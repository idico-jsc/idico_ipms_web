/**
 * PDF Viewer Dialog Component
 *
 * Modal dialog with PDF viewer
 * - Opens PDF in a full-screen dialog
 * - Uses PdfViewer component
 * - Trigger element as children
 * - Responsive design
 */

'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@atoms/dialog';
import { PdfViewer } from '@atoms/pdf-viewer';

interface PdfViewerDialogProps {
  /**
   * Trigger element (button, link, etc.)
   */
  children: React.ReactNode;
  /**
   * URL or path to the PDF file
   */
  fileUrl: string;
  /**
   * Title to display in dialog header
   */
  title?: string;
  /**
   * Initial page to display (1-indexed for react-pdf)
   * @default 1
   */
  initialPage?: number;
  /**
   * Initial scale for PDF zoom
   * - "fit-width": auto-fit to container width (default)
   * - "fit-height": auto-fit to container height
   * - number: fixed scale (e.g., 1.0 = 100%, 1.5 = 150%)
   * @default "fit-width"
   */
  initialScale?: "fit-width" | "fit-height" | number;
}

export function PdfViewerDialog({
  children,
  fileUrl,
  title = 'Xem PDF',
  initialPage = 1,
  initialScale = "fit-width",
}: PdfViewerDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] h-[95vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {open && (
            <PdfViewer
              fileUrl={fileUrl}
              initialPage={initialPage}
              initialScale={initialScale}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
