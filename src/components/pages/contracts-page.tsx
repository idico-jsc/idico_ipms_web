/**
 * Contracts Page Component
 *
 * Displays contract list with DataTable using TanStack Table
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, MoreHorizontal, FileText, Download } from 'lucide-react';
import type { FilterableColumnDef } from '@/types/table';
import { Button } from '@/components/atoms/button';
import { Badge } from '@/components/atoms/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/atoms/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import { DataTable, DataTableColumnHeader } from '@/components/organisms';
import { Checkbox } from '@/components/atoms/checkbox';
import { PdfViewerDialog } from '@/components/molecules';
import { mockContracts } from '@/data/mock-contracts';
import type { Contract, ContractStatus } from '@/types/contract.types';

interface Props extends React.ComponentProps<'div'> {}

export const ContractsPage = ({ ...rest }: Props) => {
  const { t } = useTranslation('pages');

  // State management
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Define columns with useMemo for performance
  const columns: FilterableColumnDef<Contract>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 50,
        minSize: 50,
        maxSize: 50,
      },
      {
        accessorKey: 'contract_code',
        label: t('contracts.table.contractCode'),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('contracts.table.contractCode')} />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue('contract_code')}</div>,
        size: 200,
        minSize: 150,
        maxSize: 300,
        filter: {
          label: t('contracts.table.contractCode'),
          type: 'text',
        },
        searchable: true,
      },
      {
        accessorKey: 'customer_name',
        label: t('contracts.table.customerName'),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('contracts.table.customerName')} />
        ),
        cell: ({ row }) => <div>{row.getValue('customer_name')}</div>,
        size: 300,
        minSize: 200,
        maxSize: 500,
        filter: {
          label: t('contracts.table.customerName'),
          type: 'text',
        },
        searchable: true,
      },
      {
        accessorKey: 'rental_duration',
        label: t('contracts.table.rentalDuration'),
        header: t('contracts.table.rentalDuration'),
        cell: ({ row }) => <div className="text-sm">{row.getValue('rental_duration')}</div>,
        enableResizing: true,
        filter: {
          label: t('contracts.table.rentalDuration'),
          type: 'text',
        },
      },
      {
        accessorKey: 'status',
        label: t('contracts.table.status'),
        header: t('contracts.table.status'),
        enableResizing: true,
        cell: ({ row }) => {
          const status = row.getValue('status') as ContractStatus;
          return (
            <div>
              {status === 'active' && (
                <Badge variant="default">{t('contracts.statusActive')}</Badge>
              )}
              {status === 'expired' && (
                <Badge variant="destructive">{t('contracts.statusExpired')}</Badge>
              )}
              {status === 'pending' && (
                <Badge variant="secondary">{t('contracts.statusPending')}</Badge>
              )}
              {status === 'terminated' && (
                <Badge variant="outline">{t('contracts.statusTerminated')}</Badge>
              )}
            </div>
          );
        },
        filter: {
          label: t('contracts.table.status'),
          type: 'select',
          options: [
            { value: 'active', label: t('contracts.statusActive') },
            { value: 'expired', label: t('contracts.statusExpired') },
            { value: 'pending', label: t('contracts.statusPending') },
            { value: 'terminated', label: t('contracts.statusTerminated') },
          ],
        },
      },
      {
        accessorKey: 'created',
        label: t('contracts.table.created'),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('contracts.table.created')} />
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue('created'));
          return <div className="text-sm">{date.toLocaleDateString('vi-VN')}</div>;
        },
        enableResizing: true,
        filter: {
          label: t('contracts.table.created'),
          type: 'date',
        },
      },
      {
        accessorKey: 'modified',
        label: t('contracts.table.modified'),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('contracts.table.modified')} />
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue('modified'));
          return <div className="text-sm">{date.toLocaleDateString('vi-VN')}</div>;
        },
        enableResizing: false,
        filter: {
          label: t('contracts.table.modified'),
          type: 'date',
        },
      },
      {
        id: 'actions',
        label: t('contracts.table.actions'),
        enableHiding: false,
        enableResizing: false,
        size: 80,
        minSize: 60,
        maxSize: 100,
        sticky: true,
        cell: ({ row }) => {
          const contract = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:opacity-0 md:transition-opacity md:group-hover/row:opacity-100 md:focus-visible:opacity-100 md:data-[state=open]:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">{t('contracts.table.actions')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <PdfViewerDialog
                    fileUrl={contract.pdf_file}
                    title={`${t('contracts.viewPDF')} - ${contract.contract_code}`}
                  >
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <FileText className="mr-2 h-4 w-4" />
                      {t('contracts.viewPDF')}
                    </DropdownMenuItem>
                  </PdfViewerDialog>
                  <DropdownMenuItem
                    onClick={() => handleDownloadPdf(contract.pdf_file, `${contract.contract_code}.pdf`)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Tải xuống PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Edit', contract)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t('contracts.editContract')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDeleteDialog(contract)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('contracts.deleteContract')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [t]
  );

  // Handlers
  const handleDeleteContract = () => {
    if (!selectedContract) return;

    setContracts(contracts.filter((contract) => contract.id !== selectedContract.id));
    setIsDeleteDialogOpen(false);
    setSelectedContract(null);
  };

  const openDeleteDialog = (contract: Contract) => {
    setSelectedContract(contract);
    setIsDeleteDialogOpen(true);
  };

  const handleDownloadPdf = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || 'contract.pdf';
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background" {...rest}>
      <div className="mx-auto space-y-2 md:space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-end md:justify-between">
          <h1 className="hidden md:block text-3xl font-bold">{t('contracts.title')}</h1>
          <Button className="w-full md:w-auto mb-2" onClick={() => console.log('Add contract')}>
            <Plus className="mr-2 h-4 w-4" />
            {t('contracts.addContract')}
          </Button>
        </div>

        {/* DataTable */}
        <DataTable columns={columns} data={contracts} pageSize={10} />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('contracts.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('contracts.confirmDeleteMessage')}
              {selectedContract && (
                <span className="mt-2 block font-medium text-foreground">
                  {selectedContract.contract_code} - {selectedContract.customer_name}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('contracts.form.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContract}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('contracts.deleteContract')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
