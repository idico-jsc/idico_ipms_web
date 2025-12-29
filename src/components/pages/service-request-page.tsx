/**
 * Service Request Page Component
 *
 * Displays service requests list with DataTable using TanStack Table
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, MoreHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import type { FilterableColumnDef } from '@/types/table';
import type { Row, ExpandedState } from '@tanstack/react-table';
import { Button } from '@atoms/button';
import { Textarea } from '@atoms/textarea';
import { Badge } from '@atoms/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@atoms/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@atoms/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@atoms/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@atoms/dropdown-menu';
import { DataTable, DataTableColumnHeader } from '@/components/organisms';
import { Checkbox } from '@atoms/checkbox';
import { RequestTypeSelector, StatusProgressBar } from '@/features/services';
import { ImageUpload } from '@/components/molecules';
import { mockServiceRequests } from '@/data/mock-service-requests';
import type {
  ServiceRequest,
  ServiceRequestFormData,
  RequestType,
  Priority,
} from '@/types/service-request.types';

interface Props extends React.ComponentProps<'div'> {}

export const ServiceRequestPage = ({ ...rest }: Props) => {
  const { t } = useTranslation('pages');

  // State management
  const [requests, setRequests] = useState<ServiceRequest[]>(mockServiceRequests);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [formData, setFormData] = useState<ServiceRequestFormData>({
    request_type: 'infrastructure',
    priority: 'medium',
    description: '',
    location: '',
    images: [],
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ServiceRequestFormData, string>>>({});

  // Define columns with useMemo for performance
  const columns: FilterableColumnDef<ServiceRequest>[] = useMemo(
    () => [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => {
          return (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => row.toggleExpanded()}
              className="h-8 w-8"
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          );
        },
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 50,
        minSize: 50,
        maxSize: 50,
      },
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
              {t(`serviceRequests.requestTypes.${type}`)}
            </Badge>
          );
        },
        filter: {
          label: t('serviceRequests.table.requestType'),
          type: 'select',
          options: [
            { value: 'infrastructure', label: t('serviceRequests.requestTypes.infrastructure') },
            { value: 'electricity_water', label: t('serviceRequests.requestTypes.electricity_water') },
            { value: 'security', label: t('serviceRequests.requestTypes.security') },
            { value: 'it_internet', label: t('serviceRequests.requestTypes.it_internet') },
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
              {t(`serviceRequests.priorities.${priority}`)}
            </Badge>
          );
        },
        filter: {
          label: t('serviceRequests.table.priority'),
          type: 'select',
          options: [
            { value: 'low', label: t('serviceRequests.priorities.low') },
            { value: 'medium', label: t('serviceRequests.priorities.medium') },
            { value: 'high', label: t('serviceRequests.priorities.high') },
            { value: 'urgent', label: t('serviceRequests.priorities.urgent') },
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
          const status = row.getValue('status') as 'submitted' | 'in_progress' | 'resolved' | 'closed';
          const statusLabels = {
            submitted: t('serviceRequests.statuses.submitted'),
            in_progress: t('serviceRequests.statuses.in_progress'),
            resolved: t('serviceRequests.statuses.resolved'),
            closed: t('serviceRequests.statuses.closed'),
          };
          const statusColors = {
            submitted: 'default',
            in_progress: 'default',
            resolved: 'secondary',
            closed: 'secondary',
          } as const;
          return (
            <Badge variant={statusColors[status]}>
              {statusLabels[status]}
            </Badge>
          );
        },
        filter: {
          label: t('serviceRequests.table.status'),
          type: 'select',
          options: [
            { value: 'submitted', label: t('serviceRequests.statuses.submitted') },
            { value: 'in_progress', label: t('serviceRequests.statuses.in_progress') },
            { value: 'resolved', label: t('serviceRequests.statuses.resolved') },
            { value: 'closed', label: t('serviceRequests.statuses.closed') },
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

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ServiceRequestFormData, string>> = {};

    if (!formData.request_type) {
      errors.request_type = t('serviceRequests.form.errors.requestTypeRequired');
    }

    if (!formData.priority) {
      errors.priority = t('serviceRequests.form.errors.priorityRequired');
    }

    if (!formData.description.trim()) {
      errors.description = t('serviceRequests.form.errors.descriptionRequired');
    } else if (formData.description.trim().length < 10) {
      errors.description = t('serviceRequests.form.errors.descriptionTooShort');
    } else if (formData.description.trim().length > 1000) {
      errors.description = t('serviceRequests.form.errors.descriptionTooLong');
    }

    if (!formData.location.trim()) {
      errors.location = t('serviceRequests.form.errors.locationRequired');
    } else if (formData.location.trim().length < 3) {
      errors.location = t('serviceRequests.form.errors.locationTooShort');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate title from request type and timestamp
  const generateTitle = (type: RequestType): string => {
    const typeLabel = t(`serviceRequests.requestTypes.${type}`);
    const timestamp = new Date().getTime().toString().slice(-9);
    return `${typeLabel} - #${timestamp}`;
  };

  // CRUD handlers
  const handleCreateRequest = () => {
    if (!validateForm()) return;

    const now = new Date().toISOString();
    const newRequest: ServiceRequest = {
      id: String(requests.length + 1),
      request_type: formData.request_type,
      priority: formData.priority,
      title: generateTitle(formData.request_type),
      description: formData.description,
      location: formData.location,
      status: 'submitted',
      images: formData.images,
      customer_id: '1', // Mock customer ID
      customer_name: 'Nguyễn Văn An', // Mock customer name
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
            title: generateTitle(formData.request_type),
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
    setFormData({
      request_type: request.request_type,
      priority: request.priority,
      description: request.description,
      location: request.location,
      images: request.images,
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      request_type: 'infrastructure',
      priority: 'medium',
      description: '',
      location: '',
      images: [],
    });
    setFormErrors({});
    setSelectedRequest(null);
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
        <DataTable
          columns={columns}
          data={requests}
          pageSize={10}
          expanded={expanded}
          onExpandedChange={setExpanded}
          getRowCanExpand={() => true}
          renderSubComponent={(row: Row<ServiceRequest>) => (
            <div className="py-2">
              <StatusProgressBar status={row.original.status} showLabel={true} />
            </div>
          )}
        />

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('serviceRequests.addRequest')}</DialogTitle>
              <DialogDescription>
                Fill in the information below to create a new service request.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Request Type */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  {t('serviceRequests.form.requestType')}
                </label>
                <RequestTypeSelector
                  value={formData.request_type}
                  onChange={(value) =>
                    setFormData({ ...formData, request_type: value })
                  }
                  error={formErrors.request_type}
                />
              </div>

              {/* Priority */}
              <div className="grid gap-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  {t('serviceRequests.form.priority')}
                </label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Priority) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('serviceRequests.priorities.low')}</SelectItem>
                    <SelectItem value="medium">{t('serviceRequests.priorities.medium')}</SelectItem>
                    <SelectItem value="high">{t('serviceRequests.priorities.high')}</SelectItem>
                    <SelectItem value="urgent">{t('serviceRequests.priorities.urgent')}</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.priority && (
                  <p className="text-sm text-destructive">{formErrors.priority}</p>
                )}
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  {t('serviceRequests.form.description')}
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t('serviceRequests.form.descriptionPlaceholder')}
                  rows={5}
                />
                {formErrors.description && (
                  <p className="text-sm text-destructive">{formErrors.description}</p>
                )}
              </div>

              {/* Location */}
              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm font-medium">
                  {t('serviceRequests.form.location')}
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder={t('serviceRequests.form.locationPlaceholder')}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                {formErrors.location && (
                  <p className="text-sm text-destructive">{formErrors.location}</p>
                )}
              </div>

              {/* Images */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  {t('serviceRequests.form.images')}
                </label>
                <ImageUpload
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('serviceRequests.form.cancel')}
              </Button>
              <Button onClick={handleCreateRequest}>
                {t('serviceRequests.form.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('serviceRequests.editRequest')}</DialogTitle>
              <DialogDescription>
                Update the service request information below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Request Type */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  {t('serviceRequests.form.requestType')}
                </label>
                <RequestTypeSelector
                  value={formData.request_type}
                  onChange={(value) =>
                    setFormData({ ...formData, request_type: value })
                  }
                  error={formErrors.request_type}
                />
              </div>

              {/* Priority */}
              <div className="grid gap-2">
                <label htmlFor="edit-priority" className="text-sm font-medium">
                  {t('serviceRequests.form.priority')}
                </label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Priority) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger id="edit-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('serviceRequests.priorities.low')}</SelectItem>
                    <SelectItem value="medium">{t('serviceRequests.priorities.medium')}</SelectItem>
                    <SelectItem value="high">{t('serviceRequests.priorities.high')}</SelectItem>
                    <SelectItem value="urgent">{t('serviceRequests.priorities.urgent')}</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.priority && (
                  <p className="text-sm text-destructive">{formErrors.priority}</p>
                )}
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  {t('serviceRequests.form.description')}
                </label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t('serviceRequests.form.descriptionPlaceholder')}
                  rows={5}
                />
                {formErrors.description && (
                  <p className="text-sm text-destructive">{formErrors.description}</p>
                )}
              </div>

              {/* Location */}
              <div className="grid gap-2">
                <label htmlFor="edit-location" className="text-sm font-medium">
                  {t('serviceRequests.form.location')}
                </label>
                <input
                  id="edit-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder={t('serviceRequests.form.locationPlaceholder')}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                {formErrors.location && (
                  <p className="text-sm text-destructive">{formErrors.location}</p>
                )}
              </div>

              {/* Images */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  {t('serviceRequests.form.images')}
                </label>
                <ImageUpload
                  images={formData.images}
                  onChange={(images) => setFormData({ ...formData, images })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t('serviceRequests.form.cancel')}
              </Button>
              <Button onClick={handleEditRequest}>
                {t('serviceRequests.form.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('serviceRequests.confirmDelete')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('serviceRequests.confirmDeleteMessage')}
                {selectedRequest && (
                  <span className="mt-2 block font-medium text-foreground">
                    {selectedRequest.title}
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('serviceRequests.form.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteRequest}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t('serviceRequests.deleteRequest')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
