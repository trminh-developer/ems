import { supabase } from '../config/supabase';
import { users } from '../data/users';
import { interests } from '../data/interests';

export const seedDatabase = async () => {
  try {
    console.log('Starting seed process...');
    
    // 1. Seed Interests
    console.log('Seeding interests...');
    const interestsData = interests.map(i => ({
      id: i.id,
      name: i.name,
      icon: i.icon,
      category: i.category
    }));
    
    const { error: interestError } = await supabase.from('interests').upsert(interestsData);
    if (interestError) throw interestError;

    // 2. Map old string IDs to new valid UUIDs for Users
    const idMap = new Map<string, string>();
    const getUUID = (oldId: string) => {
      if (!idMap.has(oldId)) {
        idMap.set(oldId, crypto.randomUUID());
      }
      return idMap.get(oldId)!;
    };

    // 3. Seed Users
    console.log('Seeding users...');
    
    // Đọc từ localStorage để giữ lại các tài khoản mà user đã đăng ký
    let usersToSeed = users;
    const localUsersStr = localStorage.getItem('mockUsersList');
    if (localUsersStr) {
      try {
        const localUsers = JSON.parse(localUsersStr);
        if (Array.isArray(localUsers) && localUsers.length > 0) {
          usersToSeed = localUsers;
          console.log('Đã tìm thấy tài khoản trong máy, tiến hành đẩy tài khoản này lên Supabase!');
        }
      } catch (e) {
        console.warn('Không thể đọc dữ liệu từ máy:', e);
      }
    }

    const usersData = usersToSeed.map(u => ({
      id: getUUID(u.id),
      email: u.email,
      username: u.username,
      first_name: u.firstName || u.lastName || 'User',
      last_name: u.lastName || '',
      avatar: u.avatar || '',
      cover_photo: u.coverPhoto || null,
      gender: u.gender || 'OTHER',
      date_of_birth: u.dateOfBirth || '2000-01-01',
      city: u.location?.city || '',
      country: u.location?.country || '',
      latitude: u.location?.latitude || null,
      longitude: u.location?.longitude || null,
      bio: u.bio || '',
      profession: u.profession || null,
      education: u.education || null,
      photos: u.photos || [],
      relationship_goal: u.relationshipGoal || 'NOT_SURE',
      is_online: (u as any).is_online !== undefined ? (u as any).is_online : (u.isOnline || false),
      last_active: u.lastActive || new Date().toISOString(),
      is_verified: u.isVerified || false
    }));

    const { error: usersError } = await supabase.from('users').upsert(usersData);
    if (usersError) throw usersError;

    // 4. Seed User Interests (Many-to-Many)
    console.log('Seeding user interests...');
    const userInterestsData: any[] = [];
    usersToSeed.forEach(u => {
      if (u.interests) {
        u.interests.forEach(i => {
          userInterestsData.push({
            user_id: getUUID(u.id),
            interest_id: i.id
          });
        });
      }
    });

    if (userInterestsData.length > 0) {
      const { error: uiError } = await supabase.from('user_interests').upsert(userInterestsData);
      if (uiError) throw uiError;
    }

    console.log('Seed completed successfully!');
    return true;
  } catch (error) {
    console.error('Seed error:', error);
    return false;
  }
};
