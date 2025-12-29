'use client';

import { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Info,
  Mail,
  Settings,
  User,
} from 'lucide-react';

// shadcn components
import { Button } from '@/components/atoms/button';
import { ButtonGroup } from '@/components/atoms/button-group';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Checkbox } from '@/components/atoms/checkbox';
import { Badge } from '@/components/atoms/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from '@/components/atoms/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar';
import { Separator } from '@/components/atoms/separator';
import { Skeleton } from '@/components/atoms/skeleton';
import { Calendar } from '@/components/atoms/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/atoms/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/atoms/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/atoms/collapsible';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/atoms/breadcrumb';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/atoms/carousel';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import { toast } from 'sonner';

interface Props extends React.ComponentProps<'div'> {}

export const ComponentsPage = ({ ...rest }: Props) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  const handleToast = (type: 'success' | 'error' | 'info' | 'warning') => {
    switch (type) {
      case 'success':
        toast.success('Success!', {
          description: 'This is a success message.',
        });
        break;
      case 'error':
        toast.error('Error!', {
          description: 'This is an error message.',
        });
        break;
      case 'info':
        toast.info('Info', {
          description: 'This is an info message.',
        });
        break;
      case 'warning':
        toast.warning('Warning!', {
          description: 'This is a warning message.',
        });
        break;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8" {...rest}>
      <div>
        <h1 className="text-4xl font-bold mb-2">shadcn/ui Components Showcase</h1>
        <p className="text-muted-foreground">
          A comprehensive showcase of all shadcn/ui components used in this project.
        </p>
      </div>

      <Separator />

      {/* Buttons Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Buttons</h2>
          <p className="text-sm text-muted-foreground">Various button variants and sizes</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>Different button styles and states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button disabled>Disabled</Button>
              <Button>
                <Mail className="mr-2 h-4 w-4" /> With Icon
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Button Group</CardTitle>
            <CardDescription>Grouped buttons</CardDescription>
          </CardHeader>
          <CardContent>
            <ButtonGroup>
              <Button variant="outline">First</Button>
              <Button variant="outline">Second</Button>
              <Button variant="outline">Third</Button>
            </ButtonGroup>
          </CardContent>
        </Card>
      </section>

      {/* Forms Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Form Elements</h2>
          <p className="text-sm text-muted-foreground">Input fields, selects, and checkboxes</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Input Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled">Disabled Input</Label>
              <Input id="disabled" disabled placeholder="Disabled input" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select & Checkbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Option</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Badges Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Badges</h2>
          <p className="text-sm text-muted-foreground">Status indicators and labels</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="default">
              <Check className="mr-1 h-3 w-3" /> With Icon
            </Badge>
          </CardContent>
        </Card>
      </section>

      {/* Dialogs Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Dialogs & Modals</h2>
          <p className="text-sm text-muted-foreground">Dialog and alert dialog components</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Dialog Examples</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    This is a dialog description. You can put any content here.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>Dialog content goes here.</p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Open Alert Dialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet Title</SheetTitle>
                  <SheetDescription>
                    This is a sheet component that slides from the side.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <p>Sheet content goes here.</p>
                </div>
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      </section>

      {/* Dropdown & Popovers Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Dropdowns & Popovers</h2>
          <p className="text-sm text-muted-foreground">Dropdown menus and popover components</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Dropdown & Popover Examples</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Open Menu <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Popover Title</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a popover component. You can put any content here.
                  </p>
                </div>
              </PopoverContent>
            </Popover>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover for Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a tooltip</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      </section>

      {/* Avatar & User Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Avatar</h2>
          <p className="text-sm text-muted-foreground">User avatars with fallback</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Avatar Examples</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>
      </section>

      {/* Calendar & Date Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Calendar</h2>
          <p className="text-sm text-muted-foreground">Date picker and calendar component</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Calendar Example</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date.toLocaleDateString() : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </section>

      {/* Loading States Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Loading States</h2>
          <p className="text-sm text-muted-foreground">Skeleton loaders and spinners</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Loading Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
            <div className="flex gap-4">
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" />
              <LoadingSpinner size="lg" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Collapsible Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Collapsible</h2>
          <p className="text-sm text-muted-foreground">Expandable content sections</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Collapsible Example</CardTitle>
          </CardHeader>
          <CardContent>
            <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between p-4">
                  <span>Click to expand</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isCollapsibleOpen ? 'rotate-180' : ''}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  This is the collapsible content. It can contain any content you want to show or
                  hide.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </section>

      {/* Breadcrumb Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Breadcrumb</h2>
          <p className="text-sm text-muted-foreground">Navigation breadcrumbs</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Breadcrumb Example</CardTitle>
          </CardHeader>
          <CardContent>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Showcase</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </CardContent>
        </Card>
      </section>

      {/* Carousel Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Carousel</h2>
          <p className="text-sm text-muted-foreground">Image and content carousel</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Carousel Example</CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {[1, 2, 3, 4, 5].map((index) => (
                  <CarouselItem key={index}>
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">{index}</span>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </section>

      {/* Toast/Sonner Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Toast Notifications</h2>
          <p className="text-sm text-muted-foreground">Toast notifications using Sonner</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Toast Examples</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => handleToast('success')}>
              <Check className="mr-2 h-4 w-4" />
              Success Toast
            </Button>
            <Button variant="outline" onClick={() => handleToast('error')}>
              <AlertCircle className="mr-2 h-4 w-4" />
              Error Toast
            </Button>
            <Button variant="outline" onClick={() => handleToast('info')}>
              <Info className="mr-2 h-4 w-4" />
              Info Toast
            </Button>
            <Button variant="outline" onClick={() => handleToast('warning')}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Warning Toast
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Card Examples Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Cards</h2>
          <p className="text-sm text-muted-foreground">Card component variations</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>A simple card with header and content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This is the card content.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card with Footer</CardTitle>
              <CardDescription>This card includes a footer section</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Card content goes here.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>A card with various interactive elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm">
                Click Me
              </Button>
              <Badge>Status: Active</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Separator Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Separator</h2>
          <p className="text-sm text-muted-foreground">Visual dividers</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Separator Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p>Content above separator</p>
              <Separator className="my-4" />
              <p>Content below separator</p>
            </div>
            <div className="flex items-center gap-4">
              <p>Left content</p>
              <Separator orientation="vertical" className="h-8" />
              <p>Right content</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
