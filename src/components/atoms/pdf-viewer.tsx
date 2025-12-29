/**
 * PDF Viewer Component
 *
 * Full-featured PDF viewer with zoom, navigation, and more
 * - Uses react-pdf library
 * - Supports zoom in/out, page navigation
 * - Toolbar with common actions
 * - Responsive design
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@atoms/button';
import { Input } from '@atoms/input';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Search, X, Download } from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  /**
   * URL or path to the PDF file
   */
  fileUrl: string;
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
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function PdfViewer({
  fileUrl,
  initialPage = 1,
  initialScale = "fit-width",
  className = '',
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageWidth, setPageWidth] = useState<number | null>(null);
  const [pageHeight, setPageHeight] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(
    typeof initialScale === 'number' ? initialScale : 1.0
  );
  const [searchText, setSearchText] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine fit mode
  const isFitWidth = initialScale === "fit-width";
  const isFitHeight = initialScale === "fit-height";

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // Calculate dimensions based on container (for fit-width or fit-height mode)
  useEffect(() => {
    if (!isFitWidth && !isFitHeight) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        if (isFitWidth) {
          // Subtract padding (4 * 4 = 16px on each side = 32px total)
          const width = containerRef.current.clientWidth - 32;
          setPageWidth(width);
          setPageHeight(null);
        } else if (isFitHeight) {
          // For fit-height: each page should take full viewport height
          // Subtract only the gap between pages (16px) to account for spacing
          const height = containerRef.current.clientHeight - 16;
          setPageHeight(height);
          setPageWidth(null);
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFitWidth, isFitHeight]);

  // Track which page is currently in view
  useEffect(() => {
    if (!containerRef.current || numPages === 0) return;

    let observer: IntersectionObserver | null = null;

    // Small delay to ensure pages are rendered
    const timeoutId = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          // Don't update if currently scrolling via navigation buttons
          if (isScrollingRef.current) return;

          // Find the most visible page
          let mostVisibleEntry = entries[0];
          let maxIntersectionRatio = 0;

          entries.forEach((entry) => {
            if (entry.intersectionRatio > maxIntersectionRatio) {
              maxIntersectionRatio = entry.intersectionRatio;
              mostVisibleEntry = entry;
            }
          });

          if (mostVisibleEntry && mostVisibleEntry.intersectionRatio > 0) {
            const pageNum = Number(mostVisibleEntry.target.getAttribute('data-page-number'));
            if (pageNum) {
              setCurrentPage(pageNum);
            }
          }
        },
        {
          root: containerRef.current,
          threshold: [0, 0.25, 0.5, 0.75, 1.0],
        }
      );

      pageRefs.current.forEach((element) => {
        observer?.observe(element);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, [numPages]);

  const scrollToPage = (pageNum: number) => {
    const element = pageRefs.current.get(pageNum);
    if (element) {
      // Set scrolling flag and update current page immediately
      isScrollingRef.current = true;
      setCurrentPage(pageNum);

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Scroll to the page
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Re-enable observer after scroll completes (smooth scroll takes ~500-800ms)
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  const goToPrevPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
    scrollToPage(prevPage);
  };

  const goToNextPage = () => {
    const nextPage = Math.min(currentPage + 1, numPages);
    scrollToPage(nextPage);
  };

  const zoomIn = () => {
    if (isFitWidth) {
      setPageWidth((prev) => (prev ? Math.min(prev * 1.2, prev * 5) : null));
    } else if (isFitHeight) {
      setPageHeight((prev) => (prev ? Math.min(prev * 1.2, prev * 5) : null));
    } else {
      setScale((prev) => Math.min(prev + 0.2, 5));
    }
  };

  const zoomOut = () => {
    if (isFitWidth) {
      setPageWidth((prev) => (prev ? Math.max(prev * 0.8, prev * 0.3) : null));
    } else if (isFitHeight) {
      setPageHeight((prev) => (prev ? Math.max(prev * 0.8, prev * 0.3) : null));
    } else {
      setScale((prev) => Math.max(prev - 0.2, 0.5));
    }
  };

  const handleSearch = () => {
    if (!searchText.trim()) return;

    // Use browser's built-in find functionality (guarded for TypeScript)
    const w = window as any;
    if (typeof w.find === 'function') {
      w.find(searchText, false, false, true, false, true, false);
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    setShowSearch(false);
    // Clear highlights
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleDownload = async () => {
    try {
      // Fetch the PDF file
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileUrl.split('/').pop() || 'document.pdf';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Fallback: open in new tab if download fails
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-col gap-2 p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Trang {currentPage} / {numPages || '--'}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              title="Tải xuống PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className={showSearch ? 'bg-accent' : ''}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm w-16 text-center">
              {isFitWidth
                ? pageWidth
                  ? Math.round((pageWidth / (containerRef.current?.clientWidth || 1)) * 100)
                  : '--'
                : isFitHeight
                ? pageHeight
                  ? Math.round((pageHeight / (containerRef.current?.clientHeight || 1)) * 100)
                  : '--'
                : Math.round(scale * 100)}%
            </span>
            <Button variant="outline" size="icon" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm trong PDF..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="pr-8"
              />
              {searchText && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={handleSearch}>
              Tìm
            </Button>
          </div>
        )}
      </div>

      {/* PDF Document */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex flex-col items-center gap-4 p-4 bg-muted/10"
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-96">
              <div className="text-muted-foreground">Đang tải PDF...</div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-96">
              <div className="text-destructive">Không thể tải PDF</div>
            </div>
          }
        >
          {Array.from(new Array(numPages), (_, index) => {
            const pageNum = index + 1;
            return (
              <div
                key={`page_${pageNum}`}
                ref={(el) => {
                  if (el) {
                    pageRefs.current.set(pageNum, el);
                  } else {
                    pageRefs.current.delete(pageNum);
                  }
                }}
                data-page-number={pageNum}
                className="relative"
              >
                <Page
                  pageNumber={pageNum}
                  width={isFitWidth ? pageWidth || undefined : undefined}
                  height={isFitHeight ? pageHeight || undefined : undefined}
                  scale={!isFitWidth && !isFitHeight ? scale : undefined}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="shadow-lg"
                />
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
                  {pageNum}
                </div>
              </div>
            );
          })}
        </Document>
      </div>
    </div>
  );
}
