import { Interest, InterestCategory } from '../models/Interest';

export const interests: Interest[] = [
  { id: 'i1', name: 'Nghe nhạc', icon: 'bi-music-note-beamed', category: InterestCategory.MUSIC },
  { id: 'i2', name: 'Đánh đàn', icon: 'bi-music-note-list', category: InterestCategory.MUSIC },
  { id: 'i3', name: 'Hát', icon: 'bi-mic', category: InterestCategory.MUSIC },
  { id: 'i4', name: 'Bóng đá', icon: 'bi-dribbble', category: InterestCategory.SPORTS },
  { id: 'i5', name: 'Chạy bộ', icon: 'bi-person-walking', category: InterestCategory.SPORTS },
  { id: 'i6', name: 'Bơi lội', icon: 'bi-water', category: InterestCategory.SPORTS },
  { id: 'i7', name: 'Đọc sách', icon: 'bi-book', category: InterestCategory.LIFESTYLE },
  { id: 'i8', name: 'Thiền', icon: 'bi-yin-yang', category: InterestCategory.LIFESTYLE },
  { id: 'i9', name: 'Yoga', icon: 'bi-person-arms-up', category: InterestCategory.LIFESTYLE },
  { id: 'i10', name: 'Nấu ăn', icon: 'bi-egg-fried', category: InterestCategory.FOOD },
  { id: 'i11', name: 'Ăn vặt', icon: 'bi-cup-straw', category: InterestCategory.FOOD },
  { id: 'i12', name: 'Uống cafe', icon: 'bi-cup-hot', category: InterestCategory.FOOD },
  { id: 'i13', name: 'Du lịch', icon: 'bi-airplane', category: InterestCategory.TRAVEL },
  { id: 'i14', name: 'Khám phá', icon: 'bi-compass', category: InterestCategory.TRAVEL },
  { id: 'i15', name: 'Cắm trại', icon: 'bi-tree', category: InterestCategory.TRAVEL },
  { id: 'i16', name: 'Vẽ tranh', icon: 'bi-palette', category: InterestCategory.ARTS },
  { id: 'i17', name: 'Chụp ảnh', icon: 'bi-camera', category: InterestCategory.ARTS },
  { id: 'i18', name: 'Làm mộc', icon: 'bi-hammer', category: InterestCategory.ARTS },
  { id: 'i19', name: 'Chơi game', icon: 'bi-controller', category: InterestCategory.TECHNOLOGY },
  { id: 'i20', name: 'Lập trình', icon: 'bi-code-slash', category: InterestCategory.TECHNOLOGY },
  { id: 'i21', name: 'Gadget', icon: 'bi-laptop', category: InterestCategory.TECHNOLOGY },
  { id: 'i22', name: 'Leo núi', icon: 'bi-triangle', category: InterestCategory.OUTDOOR },
  { id: 'i23', name: 'Đạp xe', icon: 'bi-bicycle', category: InterestCategory.OUTDOOR },
  { id: 'i24', name: 'Câu cá', icon: 'bi-water', category: InterestCategory.OUTDOOR }
];
