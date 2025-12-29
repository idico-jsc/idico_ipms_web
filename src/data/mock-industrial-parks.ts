/**
 * Mock Industrial Park Data
 *
 * Sample industrial park data for development and testing
 */

import type { IndustrialPark } from '@/types/industrial-park.types';

export const mockIndustrialParks: IndustrialPark[] = [
  {
    id: '1',
    name: 'Khu Công nghiệp Tân Bình',
    address: 'Đường số 10, Tân Bình, TP.HCM',
    area: '150 ha',
    occupancyRate: 85,
    description: 'Khu công nghiệp hiện đại với đầy đủ tiện ích và hạ tầng',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    contacts: {
      management: [
        { name: 'Nguyễn Văn A', phone: '0901 234 567', role: 'Giám đốc' },
        { name: 'Trần Thị B', phone: '0902 345 678', role: 'Phó giám đốc' },
      ],
      security: [
        { name: 'Lê Văn C', phone: '0903 456 789', role: 'Trưởng phòng bảo vệ' },
        { name: 'Phạm Văn D', phone: '0904 567 890', role: 'Bảo vệ ca ngày' },
      ],
      hotline: '1900 1234',
    },
  },
  {
    id: '2',
    name: 'Khu Công nghiệp Bình Dương',
    address: 'Quốc lộ 13, Thuận An, Bình Dương',
    area: '200 ha',
    occupancyRate: 92,
    description: 'Khu công nghiệp lớn nhất khu vực với nhiều doanh nghiệp FDI',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    contacts: {
      management: [
        { name: 'Hoàng Văn E', phone: '0905 678 901', role: 'Giám đốc' },
        { name: 'Vũ Thị F', phone: '0906 789 012', role: 'Phó giám đốc' },
      ],
      security: [
        { name: 'Đặng Văn G', phone: '0907 890 123', role: 'Trưởng phòng bảo vệ' },
        { name: 'Mai Văn H', phone: '0908 901 234', role: 'Bảo vệ ca đêm' },
      ],
      hotline: '1900 5678',
    },
  },
  {
    id: '3',
    name: 'Khu Công nghiệp Đồng Nai',
    address: 'Xa lộ Hà Nội, Biên Hòa, Đồng Nai',
    area: '180 ha',
    occupancyRate: 78,
    description: 'Khu công nghiệp tập trung sản xuất chế tạo và logistics',
    image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80',
    contacts: {
      management: [
        { name: 'Bùi Văn I', phone: '0909 012 345', role: 'Giám đốc' },
        { name: 'Lý Thị J', phone: '0910 123 456', role: 'Phó giám đốc' },
      ],
      security: [
        { name: 'Hồ Văn K', phone: '0911 234 567', role: 'Trưởng phòng bảo vệ' },
        { name: 'Tô Văn L', phone: '0912 345 678', role: 'Bảo vệ trưởng ca' },
      ],
      hotline: '1900 9012',
    },
  },
  {
    id: '4',
    name: 'Khu Công nghiệp Long An',
    address: 'Quốc lộ 1A, Bến Lức, Long An',
    area: '120 ha',
    occupancyRate: 65,
    description: 'Khu công nghiệp mới với nhiều ưu đãi đầu tư',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&q=80',
    contacts: {
      management: [
        { name: 'Đỗ Văn M', phone: '0913 456 789', role: 'Giám đốc' },
        { name: 'Võ Thị N', phone: '0914 567 890', role: 'Phó giám đốc' },
      ],
      security: [
        { name: 'Dương Văn O', phone: '0915 678 901', role: 'Trưởng phòng bảo vệ' },
        { name: 'Chu Văn P', phone: '0916 789 012', role: 'Bảo vệ ca sáng' },
      ],
      hotline: '1900 3456',
    },
  },
  {
    id: '5',
    name: 'Khu Công nghiệp Vũng Tàu',
    address: 'Phường Phước Hưng, Vũng Tàu, Bà Rịa - Vũng Tàu',
    area: '95 ha',
    occupancyRate: 88,
    description: 'Khu công nghiệp ven biển chuyên về dầu khí và năng lượng',
    image: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=800&q=80',
    contacts: {
      management: [
        { name: 'Cao Văn Q', phone: '0917 890 123', role: 'Giám đốc' },
        { name: 'Từ Thị R', phone: '0918 901 234', role: 'Phó giám đốc' },
      ],
      security: [
        { name: 'Ông Văn S', phone: '0919 012 345', role: 'Trưởng phòng bảo vệ' },
        { name: 'An Văn T', phone: '0920 123 456', role: 'Bảo vệ ca chiều' },
      ],
      hotline: '1900 7890',
    },
  },
  {
    id: '6',
    name: 'Khu Công nghiệp Hải Phòng',
    address: 'Đường Lê Hồng Phong, Ngô Quyền, Hải Phòng',
    area: '160 ha',
    occupancyRate: 90,
    description: 'Khu công nghiệp cảng biển với logistics phát triển',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    contacts: {
      management: [
        { name: 'Kim Văn U', phone: '0921 234 567', role: 'Giám đốc' },
        { name: 'Lâm Thị V', phone: '0922 345 678', role: 'Phó giám đốc' },
      ],
      security: [
        { name: 'Quách Văn W', phone: '0923 456 789', role: 'Trưởng phòng bảo vệ' },
        { name: 'Nghiêm Văn X', phone: '0924 567 890', role: 'Bảo vệ cổng chính' },
      ],
      hotline: '1900 2468',
    },
  },
];
