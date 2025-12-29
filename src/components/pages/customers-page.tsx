/**
 * Customers Page Component
 *
 * Displays customer list with DataTable using TanStack Table
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import type { FilterableColumnDef } from '@/types/table';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Badge } from '@/components/atoms/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
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
import { mockCustomers } from '@/data/mock-customers';
import type { Customer, CustomerFormData, CustomerStatus } from '@/types/customer.types';

interface Props extends React.ComponentProps<'div'> { }

export const CustomersPage = ({ ...rest }: Props) => {
  const { t } = useTranslation('pages');

  // State management
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    company_name: '',
    tax_code: '',
    address: '',
    status: 'active',
    tags: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});

  // Define columns with useMemo for performance
  const columns: FilterableColumnDef<Customer>[] = useMemo(
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
        accessorKey: 'company_name',
        label: t('customers.table.companyName'),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('customers.table.companyName')} />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue('company_name')}</div>,
        size: 300,
        minSize: 150,
        maxSize: 500,
        filter: {
          label: t('customers.table.companyName'),
          type: 'text',
        },
        searchable: true
      },
      {
        accessorKey: 'name',
        label: t('customers.table.representative'),
        header: t('customers.table.representative'),
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
        enableResizing: true,
        filter: {
          label: t('customers.table.representative'),
          type: 'text',
        },
      },
      {
        accessorKey: 'tax_code',
        label: t('customers.table.taxCode'),
        header: t('customers.table.taxCode'),
        cell: ({ row }) => <div className="text-sm">{row.getValue('tax_code')}</div>,
        enableResizing: true,
        filter: {
          label: t('customers.table.taxCode'),
          type: 'text',
        },
      },
      {
        accessorKey: 'address',
        label: t('customers.table.address'),
        header: t('customers.table.address'),
        cell: ({ row }) => (
          <div className="truncate" title={row.getValue('address')}>
            {row.getValue('address')}
          </div>
        ),
        enableResizing: true,
        filter: {
          label: t('customers.table.address'),
          type: 'text',
        },
      },
      {
        accessorKey: 'status',
        label: t('customers.table.status'),
        header: t('customers.table.status'),
        enableResizing: true,
        cell: ({ row }) => {
          const status = row.getValue('status') as CustomerStatus;
          return (
            <div className="">
              {
                status === 'active' && <Badge variant={"default"}>
                  {t('customers.activeStatus')}
                </Badge>
              }
              {
                status === 'inactive' && <Badge variant={"destructive"}>
                  {t('customers.inactiveStatus')}
                </Badge>
              }
            </div>
          );
        },
        filter: {
          label: t('customers.table.status'),
          type: 'select',
          options: [
            { value: 'active', label: t('customers.activeStatus') },
            { value: 'inactive', label: t('customers.inactiveStatus') },
          ],
        },
      },
      {
        accessorKey: 'created',
        label: t('customers.table.created'),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('customers.table.created')} />
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue('created'));
          return <div className="text-sm">{date.toLocaleDateString('vi-VN')}</div>;
        },
        enableResizing: true,
        filter: {
          label: t('customers.table.created'),
          type: 'date',
        },
      },
      {
        accessorKey: 'modified',
        label: t('customers.table.modified'),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('customers.table.modified')} />
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue('modified'));
          return <div className="text-sm">{date.toLocaleDateString('vi-VN')}</div>;
        },
        enableResizing: false,
        filter: {
          label: t('customers.table.modified'),
          type: 'date',
        },
      },
      {
        id: 'actions',
        label: t('customers.table.actions'),
        enableHiding: false,
        enableResizing: false,
        size: 80,
        minSize: 60,
        maxSize: 100,
        sticky: true,
        cell: ({ row }) => {
          const customer = row.original;
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
                    <span className="sr-only">{t('customers.table.actions')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditDialog(customer)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t('customers.editCustomer')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDeleteDialog(customer)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('customers.deleteCustomer')}
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


  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CustomerFormData, string>> = {};

    if (!formData.name.trim()) {
      errors.name = t('customers.form.errors.nameRequired');
    }
    if (!formData.company_name.trim()) {
      errors.company_name = t('customers.form.errors.companyRequired');
    }
    if (!formData.tax_code.trim()) {
      errors.tax_code = t('customers.form.errors.taxCodeRequired');
    } else if (!/^\d{10,13}$/.test(formData.tax_code)) {
      errors.tax_code = t('customers.form.errors.taxCodeInvalid');
    }
    if (!formData.address.trim()) {
      errors.address = t('customers.form.errors.addressRequired');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleCreateCustomer = () => {
    if (!validateForm()) return;

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      company_name: formData.company_name.trim(),
      tax_code: formData.tax_code.trim(),
      address: formData.address.trim(),
      status: formData.status,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ''),
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };

    setCustomers([newCustomer, ...customers]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditCustomer = () => {
    if (!validateForm() || !selectedCustomer) return;

    const updatedCustomers = customers.map((customer) =>
      customer.id === selectedCustomer.id
        ? {
          ...customer,
          name: formData.name.trim(),
          company_name: formData.company_name.trim(),
          tax_code: formData.tax_code.trim(),
          address: formData.address.trim(),
          status: formData.status,
          tags: formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ''),
          modified: new Date().toISOString(),
        }
        : customer
    );

    setCustomers(updatedCustomers);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;

    setCustomers(customers.filter((customer) => customer.id !== selectedCustomer.id));
    setIsDeleteDialogOpen(false);
    setSelectedCustomer(null);
  };

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      company_name: customer.company_name,
      tax_code: customer.tax_code,
      address: customer.address,
      status: customer.status,
      tags: customer.tags.join(', '),
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company_name: '',
      tax_code: '',
      address: '',
      status: 'active',
      tags: '',
    });
    setFormErrors({});
    setSelectedCustomer(null);
  };

  return (
    <div className="min-h-screen bg-background" {...rest}>
      <div className="mx-auto  space-y-2 md:space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-end md:justify-between">
          <h1 className="hidden md:block text-3xl font-bold">{t('customers.title')}</h1>
          <Button className="w-full md:w-auto mb-2" onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            {t('customers.addCustomer')}
          </Button>
        </div>

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={customers}
          pageSize={10}
        />
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('customers.addCustomer')}</DialogTitle>
            <DialogDescription>
              Fill in the information below to add a new customer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                {t('customers.form.customerName')}
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('customers.form.customerNamePlaceholder')}
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="company_name" className="text-sm font-medium">
                {t('customers.form.companyName')}
              </label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder={t('customers.form.companyNamePlaceholder')}
              />
              {formErrors.company_name && (
                <p className="text-sm text-destructive">{formErrors.company_name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="tax_code" className="text-sm font-medium">
                {t('customers.form.taxCode')}
              </label>
              <Input
                id="tax_code"
                value={formData.tax_code}
                onChange={(e) => setFormData({ ...formData, tax_code: e.target.value })}
                placeholder={t('customers.form.taxCodePlaceholder')}
              />
              {formErrors.tax_code && (
                <p className="text-sm text-destructive">{formErrors.tax_code}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="address" className="text-sm font-medium">
                {t('customers.form.address')}
              </label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t('customers.form.addressPlaceholder')}
              />
              {formErrors.address && (
                <p className="text-sm text-destructive">{formErrors.address}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                {t('customers.form.status')}
              </label>
              <Select
                value={formData.status}
                onValueChange={(value: CustomerStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('customers.form.statusPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('customers.activeStatus')}</SelectItem>
                  <SelectItem value="inactive">{t('customers.inactiveStatus')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="tags" className="text-sm font-medium">
                {t('customers.form.tags')}
              </label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder={t('customers.form.tagsPlaceholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t('customers.form.cancel')}
            </Button>
            <Button onClick={handleCreateCustomer}>{t('customers.form.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('customers.editCustomer')}</DialogTitle>
            <DialogDescription>Update the customer information below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                {t('customers.form.customerName')}
              </label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('customers.form.customerNamePlaceholder')}
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-company_name" className="text-sm font-medium">
                {t('customers.form.companyName')}
              </label>
              <Input
                id="edit-company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder={t('customers.form.companyNamePlaceholder')}
              />
              {formErrors.company_name && (
                <p className="text-sm text-destructive">{formErrors.company_name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-tax_code" className="text-sm font-medium">
                {t('customers.form.taxCode')}
              </label>
              <Input
                id="edit-tax_code"
                value={formData.tax_code}
                onChange={(e) => setFormData({ ...formData, tax_code: e.target.value })}
                placeholder={t('customers.form.taxCodePlaceholder')}
              />
              {formErrors.tax_code && (
                <p className="text-sm text-destructive">{formErrors.tax_code}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-address" className="text-sm font-medium">
                {t('customers.form.address')}
              </label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={t('customers.form.addressPlaceholder')}
              />
              {formErrors.address && (
                <p className="text-sm text-destructive">{formErrors.address}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-status" className="text-sm font-medium">
                {t('customers.form.status')}
              </label>
              <Select
                value={formData.status}
                onValueChange={(value: CustomerStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('customers.form.statusPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t('customers.activeStatus')}</SelectItem>
                  <SelectItem value="inactive">{t('customers.inactiveStatus')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-tags" className="text-sm font-medium">
                {t('customers.form.tags')}
              </label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder={t('customers.form.tagsPlaceholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t('customers.form.cancel')}
            </Button>
            <Button onClick={handleEditCustomer}>{t('customers.form.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('customers.confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('customers.confirmDeleteMessage')}
              {selectedCustomer && (
                <span className="mt-2 block font-medium text-foreground">
                  {selectedCustomer.name} ({selectedCustomer.company_name})
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('customers.form.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('customers.deleteCustomer')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
