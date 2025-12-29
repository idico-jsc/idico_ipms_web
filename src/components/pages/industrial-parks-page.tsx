/**
 * Industrial Parks Page Component
 *
 * Displays industrial parks as contact directory cards
 */

import { useState } from 'react';
import { MapPin, Users, Shield, Building2, Plus, LayoutGrid, List, Headset } from 'lucide-react';
import { Badge, Button, Input, Separator, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@atoms';
import { mockIndustrialParks } from '@/data/mock-industrial-parks';
import type { IndustrialPark } from '@/types/industrial-park.types';

interface Props extends React.ComponentProps<'div'> { }

type ViewMode = 'grid' | 'list';

export const IndustrialParksPage = ({ ...rest }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter parks based on search query
  const filteredParks = mockIndustrialParks.filter((park) =>
    park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    park.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background" {...rest}>
      <div className="mx-auto space-y-4 md:space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold">Danh sách Khu Công nghiệp</h1>
            <p className="text-muted-foreground">Danh bạ liên lạc và thông tin các khu công nghiệp</p>
          </div>
          <Button onClick={() => console.log('Add industrial park')}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm KCN
          </Button>
        </div>

        {/* Search Bar and View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
          <div className="w-full md:max-w-md">
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Industrial Parks Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredParks.map((park) => (
              <IndustrialParkCard key={park.id} park={park} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredParks.map((park) => (
              <IndustrialParkListItem key={park.id} park={park} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredParks.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Không tìm thấy khu công nghiệp</h3>
            <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Industrial Park Card Component
interface IndustrialParkCardProps {
  park: IndustrialPark;
}

function IndustrialParkCard({ park }: IndustrialParkCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Industrial Park Image */}
      {park.image && (
        <div className="p-4 pb-0 relative">
          <div className="w-full aspect-video overflow-hidden rounded-lg">
            <img
              src={park.image}
              alt={park.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
          <Badge variant="secondary" className="absolute top-6 right-6 bg-brand-secondary text-brand-secondary-foreground border-primary/20">
            {park.area}
          </Badge>
        </div>
      )}

      <CardHeader className="bg-linear-to-br from-primary/5 to-transparent pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-xl text-primary">{park.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-4 w-4 mr-1 text-brand-primary" />
              <span className="text-sm">{park.address}</span>
            </CardDescription>
            <CardDescription className="flex items-center gap-1">
              <Headset className="h-4 w-4 mr-1 text-brand-primary" />
              <a href={`tel:${park.contacts.hotline}`} className="text-sm hover:underline hover:text-primary">
                Hotline: {park.contacts.hotline}
              </a>
            </CardDescription>
          </div>

        </div>
        <Separator className="mt-2" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Management Contacts */}
        <div className="space-y-2 ">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users className="h-4 w-4 text-brand-secondary" />
            <span>Ban quản lý</span>
          </div>
          <div className="space-y-1 pl-6">
            {park.contacts.management.map((contact, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium">{contact.name}</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs">{contact.role}</span>
                  <span>•</span>
                  <a href={`tel:${contact.phone}`} className="hover:text-primary flex items-center gap-1">

                    {contact.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Contacts */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Shield className="h-4 w-4 text-brand-secondary" />
            <span>Bảo vệ</span>
          </div>
          <div className="space-y-1 pl-6">
            {park.contacts.security.map((contact, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium">{contact.name}</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs">{contact.role}</span>
                  <span>•</span>
                  <a href={`tel:${contact.phone}`} className="hover:text-primary flex items-center gap-1">

                    {contact.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Industrial Park List Item Component (for list view)
interface IndustrialParkListItemProps {
  park: IndustrialPark;
}

function IndustrialParkListItem({ park }: IndustrialParkListItemProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4 bg-linear-to-r from-primary/5 to-transparent">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left: Industrial Park Image */}
          {park.image && (
            <div className="w-full md:w-64 aspect-[11/8] overflow-hidden rounded-lg shrink-0 relative">
              <img
                src={park.image}
                alt={park.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <Badge variant="secondary" className="absolute top-2 right-2 bg-brand-secondary text-brand-secondary-foreground border-primary/20">
                {park.area}
              </Badge>
            </div>
          )}

          {/* Right: Content */}
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 text-primary">{park.name}</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left: Park Info */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-1">

                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 mr-1 text-brand-primary" />
                        <span className="text-sm">{park.address}</span>
                      </CardDescription>
                      <CardDescription className="flex items-center gap-1">
                        <Headset className="h-4 w-4 mr-1 text-brand-primary" />
                        <a href={`tel:${park.contacts.hotline}`} className="text-sm hover:underline hover:text-primary">
                          Hotline: {park.contacts.hotline}
                        </a>
                      </CardDescription>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {park.description && (
                  <p className="text-sm text-muted-foreground">{park.description}</p>
                )}
              </div>

              {/* Middle: Management Contacts */}
              <div className="space-y-2">
              
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4 text-brand-secondary" />
                  <span>Ban quản lý</span>
                </div>
                <div className="space-y-1 pl-6">
                  {park.contacts.management.map((contact, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{contact.name}</div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-xs">{contact.role}</span>
                        <span>•</span>
                        <a href={`tel:${contact.phone}`} className="hover:text-primary flex items-center gap-1">

                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Security Contacts */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Shield className="h-4 w-4 text-brand-secondary" />
                  <span>Bảo vệ</span>
                </div>
                <div className="space-y-1 pl-6">
                  {park.contacts.security.map((contact, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium">{contact.name}</div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-xs">{contact.role}</span>
                        <span>•</span>
                        <a href={`tel:${contact.phone}`} className="hover:text-primary flex items-center gap-1">

                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
