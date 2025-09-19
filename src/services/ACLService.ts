import { Source, UserRole } from '../types/Message';

export class ACLService {
  static filterSources(sources: Source[], userRole: UserRole): Source[] {
    if (userRole === 'admin') {
      return sources; // Админ видит все источники
    }

    // Обычный пользователь видит только публичные источники
    return sources.filter(source => source.accessLevel === 'public');
  }

  static hasAccess(accessLevel: 'public' | 'restricted', userRole: UserRole): boolean {
    if (accessLevel === 'public') {
      return true;
    }
    
    return userRole === 'admin';
  }
}