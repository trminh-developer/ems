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

    // 2. Fetch existing users from DB to map by email
    const { data: existingDbUsers, error: fetchError } = await supabase.from('users').select('id, email');
    if (fetchError) throw fetchError;

    const emailToDbId = new Map<string, string>();
    existingDbUsers?.forEach(u => emailToDbId.set(u.email, u.id));

    // 3. Map old string IDs to valid UUIDs
    const idMap = new Map<string, string>();
    const getUUID = (oldId: string, email: string) => {
      // If email exists in DB, use that exact UUID to prevent UNIQUE constraint violation!
      if (emailToDbId.has(email)) {
        return emailToDbId.get(email)!;
      }
      // Otherwise, generate a new one
      if (!idMap.has(oldId)) {
        idMap.set(oldId, crypto.randomUUID());
      }
      return idMap.get(oldId)!;
    };

    // 4. Seed Users
    console.log('Seeding users...');
    
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
      id: getUUID(u.id, u.email),
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

    // 5. Seed User Interests (Many-to-Many)
    console.log('Seeding user interests...');
    const userInterestsData: any[] = [];
    usersToSeed.forEach(u => {
      if (u.interests) {
        u.interests.forEach(i => {
          userInterestsData.push({
            user_id: getUUID(u.id, u.email),
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
