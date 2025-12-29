/**
 * Service Request Page Component (Refactored)
 *
 * Displays service requests list with DataTable using TanStack Table
 * Uses feature/services dialog components
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import type { FilterableColumnDef } from '@/types/table';
import { Button } from '@/components/atoms/button';
import { Badge } from '@/components/atoms/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import { DataTable, DataTableColumnHeader } from '@/components/organisms';
import { Checkbox } from '@/components/atoms/checkbox';
import {
  StatusProgressBar,
  CreateServiceRequestDialog,
  EditServiceRequestDialog,
  DeleteServiceRequestDialog,
} from '@/features/services';
import { useServiceRequestForm } from '@/features/services/hooks';
import { generateRequestTitle } from '@/features/services/utils';
import { mockServiceRequests } from '@/data/mock-service-requests';
import type {
  ServiceRequest,
  RequestType,
  Priority,
  RequestStatus,
} from '@/types/service-request.types';

interface Props extends React.ComponentProps<'div'> {}

export const ServiceRequestPage = ({ ...rest }: Props) => {
  const { t } = useTranslation('pages');

  // Use the service request form hook
  const {
    formData,
    formErrors,
    validateForm,
    resetForm,
    updateFormData,
    setFormDataFromRequest,
  } = useServiceRequestForm();

  // State management
  const [requests, setRequests] = useState<ServiceRequest[]>(mockServiceRequests);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  // Define columns with useMemo for performance
  const columns: FilterableColumnDef<ServiceRequest>[] = useMemo(
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
        accessorKey: 'title',
        label: t('serviceRequests.table.title'),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('serviceRequests.table.title')} />
        ),
        cell: ({ row }) => (
          <div className="font-medium max-w-xs truncate" title={row.getValue('title')}>
            {row.getValue('title')}
          </div>
        ),
        size: 300,
        minSize: 200,
        maxSize: 500,
        filter: {
          label: t('serviceRequests.table.title'),
          type: 'text',
        },
        searchable: true,
      },
      {
        accessorKey: 'request_type',
        label: t('serviceRequests.table.requestType'),
        header: t('serviceRequests.table.requestType'),
        cell: ({ row }) => {
          const type = row.getValue('request_type') as RequestType;
          return (
            <Badge variant="outline">
              {t(`serviceRequests.requestTypes.${type}` as any)}
            </Badge>
          );
        },
        filter: {
          label: t('serviceRequests.table.requestType'),
          type: 'select',
          options: [
            { value: 'infrastructure', label: t('serviceRequests.requestTypes.infrastructure' as any) },
            { value: 'electricity_water', label: t('serviceRequests.requestTypes.electricity_water' as any) },
            { value: 'security', label: t('serviceRequests.requestTypes.security' as any) },
            { value: 'it_internet', label: t('serviceRequests.requestTypes.it_internet' as any) },
          ],
        },
      },
      {
        accessorKey: 'priority',
        label: t('serviceRequests.table.priority'),
        header: t('serviceRequests.table.priority'),
        cell: ({ row }) => {
          const priority = row.getValue('priority') as Priority;
          const variantMap: Record<Priority, 'secondary' | 'default' | 'destructive'> = {
            low: 'secondary',
            medium: 'default',
            high: 'default',
            urgent: 'destructive',
          };
          return (
            <Badge variant={variantMap[priority]}>
              {t(`serviceRequests.priorities.${priority}` as any)}
            </Badge>
          );
        },
        filter: {
          label: t('serviceRequests.table.priority'),
          type: 'select',
          options: [
            { value: 'low', label: t('serviceRequests.priorities.low' as any) },
            { value: 'medium', label: t('serviceRequests.priorities.medium' as any) },
            { value: 'high', label: t('serviceRequests.priorities.high' as any) },
            { value: 'urgent', label: t('serviceRequests.priorities.urgent' as any) },
          ],
        },
      },
      {
        accessorKey: 'location',
        label: t('serviceRequests.table.location'),
        header: t('serviceRequests.table.location'),
        cell: ({ row }) => <div className="truncate max-w-xs">{row.getValue('location')}</div>,
        filter: {
          label: t('serviceRequests.table.location'),
          type: 'text',
        },
      },
      {
        accessorKey: 'status',
        label: t('serviceRequests.table.status'),
        header: t('serviceRequests.table.status'),
        cell: ({ row }) => {
          const status = row.getValue('status') as RequestStatus;
          return <StatusProgressBar status={status} showLabel={false} className="max-w-xs" />;
        },
        filter: {
          label: t('serviceRequests.table.status'),
          type: 'select',
          options: [
            { value: 'submitted', label: t('serviceRequests.statuses.submitted' as any) },
            { value: 'in_progress', label: t('serviceRequests.statuses.in_progress' as any) },
            { value: 'resolved', label: t('serviceRequests.statuses.resolved' as any) },
            { value: 'closed', label: t('serviceRequests.statuses.closed' as any) },
          ],
        },
      },
      {
        accessorKey: 'customer_name',
        label: t('serviceRequests.table.customerName'),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('serviceRequests.table.customerName')} />
        ),
        cell: ({ row }) => <div>{row.getValue('customer_name')}</div>,
        filter: {
          label: t('serviceRequests.table.customerName'),
          type: 'text',
        },
        searchable: true,
      },
      {
        accessorKey: 'created',
        label: t('serviceRequests.table.created'),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('serviceRequests.table.created')} />
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue('created'));
          return <div className="text-sm">{date.toLocaleDateString('vi-VN')}</div>;
        },
        filter: {
          label: t('serviceRequests.table.created'),
          type: 'date',
        },
      },
      {
        accessorKey: 'modified',
        label: t('serviceRequests.table.modified'),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('serviceRequests.table.modified')} />
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue('modified'));
          return <div className="text-sm">{date.toLocaleDateString('vi-VN')}</div>;
        },
        filter: {
          label: t('serviceRequests.table.modified'),
          type: 'date',
        },
      },
      {
        id: 'actions',
        label: t('serviceRequests.table.actions'),
        enableHiding: false,
        enableResizing: false,
        size: 80,
        minSize: 60,
        maxSize: 100,
        sticky: true,
        cell: ({ row }) => {
          const request = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:opacity-0 md:group-hover/row:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEditDialog(request)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t('serviceRequests.editRequest')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openDeleteDialog(request)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('serviceRequests.deleteRequest')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t]
  );

  // CRUD handlers
  const handleCreateRequest = () => {
    if (!validateForm()) return;

    const now = new Date().toISOString();
    const newRequest: ServiceRequest = {
      id: String(requests.length + 1),
      request_type: formData.request_type,
      priority: formData.priority,
      title: generateRequestTitle(formData.request_type, t),
      description: formData.description,
      location: formData.location,
      status: 'submitted',
      images: formData.images,
      customer_id: '1',
      customer_name: 'Nguyễn Văn An',
      created: now,
      modified: now,
      submitted_at: now,
    };

    setRequests([newRequest, ...requests]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditRequest = () => {
    if (!selectedRequest || !validateForm()) return;

    const updatedRequests = requests.map((request) =>
      request.id === selectedRequest.id
        ? {
            ...request,
            request_type: formData.request_type,
            priority: formData.priority,
            title: generateRequestTitle(formData.request_type, t),
            description: formData.description,
            location: formData.location,
            images: formData.images,
            modified: new Date().toISOString(),
          }
        : request
    );

    setRequests(updatedRequests);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteRequest = () => {
    if (!selectedRequest) return;

    setRequests(requests.filter((request) => request.id !== selectedRequest.id));
    setIsDeleteDialogOpen(false);
    setSelectedRequest(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setFormDataFromRequest(request);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background" {...rest}>
      <div className="mx-auto space-y-2 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-end md:justify-between">
          <h1 className="hidden md:block text-3xl font-bold text-foreground">
            {t('serviceRequests.title')}
          </h1>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            {t('serviceRequests.addRequest')}
          </Button>
        </div>

        {/* DataTable */}
        <DataTable columns={columns} data={requests} pageSize={10} />

        {/* Dialogs - Now using feature components! */}
        <CreateServiceRequestDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          formData={formData}
          formErrors={formErrors}
          onFormDataChange={updateFormData}
          onSubmit={handleCreateRequest}
        />

        <EditServiceRequestDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          formData={formData}
          formErrors={formErrors}
          onFormDataChange={updateFormData}
          onSubmit={handleEditRequest}
        />

        <DeleteServiceRequestDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          request={selectedRequest}
          onConfirm={handleDeleteRequest}
        />
      </div>
    </div>
  );
};
