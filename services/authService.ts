import { User, Role } from '@/types';

export const emptyBrandUser: User = {
  id: '',
  name: 'Brand Sponsor',
  email: '',
  role: 'brand',
  avatar: '',
};

export const emptyCreatorUser: User = {
  id: '',
  name: 'Content Creator',
  email: '',
  role: 'creator',
  avatar: '',
};

export class AuthService {
  static getDemoUser(role: Role): User {
    return role === 'brand' ? { ...emptyBrandUser } : { ...emptyCreatorUser };
  }
}
