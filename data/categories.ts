export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
  color: string;
  count: number;
}

export const mockCategories: CategoryItem[] = [
  { id: 'cat-beauty', name: 'Beauty', iconName: 'Sparkles', color: 'from-pink-500 to-rose-500', count: 142 },
  { id: 'cat-fashion', name: 'Fashion', iconName: 'Shirt', color: 'from-purple-500 to-indigo-500', count: 218 },
  { id: 'cat-tech', name: 'Technology', iconName: 'Cpu', color: 'from-blue-500 to-cyan-500', count: 174 },
  { id: 'cat-lifestyle', name: 'Lifestyle', iconName: 'Compass', color: 'from-amber-500 to-orange-500', count: 320 },
  { id: 'cat-food', name: 'Food', iconName: 'Utensils', color: 'from-emerald-500 to-teal-500', count: 110 },
  { id: 'cat-comedy', name: 'Comedy', iconName: 'Laugh', color: 'from-yellow-500 to-amber-500', count: 95 },
  { id: 'cat-gaming', name: 'Gaming', iconName: 'Gamepad2', color: 'from-violet-500 to-purple-600', count: 88 },
  { id: 'cat-travel', name: 'Travel', iconName: 'Plane', color: 'from-sky-500 to-blue-600', count: 76 },
  { id: 'cat-education', name: 'Education', iconName: 'GraduationCap', color: 'from-rose-500 to-red-600', count: 64 },
];
