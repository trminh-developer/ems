import { User, Gender, RelationshipGoal } from '../models';
import { supabase } from '../config/supabase';
import { emailService } from './index';

export const login = async (email: string, password: string): Promise<User> => {
  // Query from real database
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    throw new Error('Tài khoản chưa được đăng ký! Vui lòng đăng ký tài khoản.');
  }
  
  if (data.password && data.password !== password) {
    throw new Error('Mật khẩu không chính xác!');
  }

  // Auto-verify admin account logic
  if (data.email === 'trminhlaptrinhvien@gmail.com' && !data.is_verified) {
    await supabase.from('users').update({ is_verified: true }).eq('id', data.id);
    data.is_verified = true;
  }

  return mapDatabaseUserToModel(data);
};

export const register = async (data: any): Promise<User> => {
  // Check if exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', data.email)
    .single();

  if (existingUser) {
    throw new Error('Email này đã được sử dụng! Vui lòng đăng nhập.');
  }

  // Create new user in DB
  const newUser = {
    email: data.email,
    username: data.email.split('@')[0],
    first_name: data.firstName || 'Người dùng',
    last_name: data.lastName || 'Mới',
    avatar: `https://randomuser.me/api/portraits/${data.gender === 'female' ? 'women' : 'men'}/${Math.floor(Math.random() * 90)}.jpg`,
    gender: data.gender || 'OTHER',
    date_of_birth: data.dateOfBirth || '2000-01-01',
    city: 'Hà Nội',
    country: 'Việt Nam',
    bio: 'Thành viên mới',
    relationship_goal: 'NOT_SURE',
    is_online: true,
    is_verified: data.email === 'trminhlaptrinhvien@gmail.com',
    password: data.password || 'password123'
  };

  const { data: createdUser, error } = await supabase
    .from('users')
    .insert([newUser])
    .select()
    .single();

  if (error) {
    throw new Error('Lỗi khi đăng ký tài khoản: ' + error.message);
  }

  return mapDatabaseUserToModel(createdUser);
};

export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
};

export const forgotPassword = async (email: string): Promise<string> => {
  // 1. Kiểm tra email có tồn tại không
  const { data: user } = await supabase.from('users').select('id').eq('email', email).single();
  if (!user) throw new Error('Email không tồn tại trong hệ thống!');

  // 2. Tạo mã OTP 6 số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 phút

  // 3. Lưu vào DB (Upsert)
  const { error } = await supabase.from('password_resets').upsert({
    email,
    otp,
    expires_at: expiresAt
  });

  if (error) throw new Error('Không thể tạo mã OTP. Vui lòng thử lại sau.');
  
  // 4. Gửi email
  await emailService.sendOTPEmail(email, otp);
  
  return otp;
};

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('password_resets')
    .select('*')
    .eq('email', email)
    .eq('otp', otp)
    .single();

  if (error || !data) throw new Error('Mã OTP không chính xác!');
  
  if (new Date(data.expires_at) < new Date()) {
    throw new Error('Mã OTP đã hết hạn!');
  }

  return true;
};

export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update({ password: newPassword })
    .eq('email', email);

  if (error) throw new Error('Lỗi khi đặt lại mật khẩu!');
  
  // Xóa OTP sau khi dùng
  await supabase.from('password_resets').delete().eq('email', email);
};

// Vẫn giữ lại local/session storage cho session hiện tại trên thiết bị
export const getCurrentUser = (): User | null => {
  const sessionUser = sessionStorage.getItem('currentUser');
  const localUser = localStorage.getItem('currentUser');
  const userStr = sessionUser || localUser;
  
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const updateUserInList = async (updatedUser: User): Promise<void> => {
  // Update in real database
  const { error } = await supabase
    .from('users')
    .update({
      first_name: updatedUser.firstName,
      last_name: updatedUser.lastName,
      avatar: updatedUser.avatar,
      cover_photo: updatedUser.coverPhoto,
      gender: updatedUser.gender,
      date_of_birth: updatedUser.dateOfBirth,
      city: updatedUser.location.city,
      country: updatedUser.location.country,
      latitude: updatedUser.location.latitude,
      longitude: updatedUser.location.longitude,
      bio: updatedUser.bio,
      profession: updatedUser.profession,
      education: updatedUser.education,
      photos: updatedUser.photos,
      relationship_goal: updatedUser.relationshipGoal,
      is_online: updatedUser.isOnline,
      is_verified: updatedUser.isVerified
    })
    .eq('id', updatedUser.id);
    
  if (error) {
    console.error('Failed to update user in DB', error);
  }
};

// Helper function to map snake_case DB fields to camelCase TS models
const mapDatabaseUserToModel = (dbUser: any): User => {
  return {
    id: dbUser.id,
    username: dbUser.username,
    email: dbUser.email,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    avatar: dbUser.avatar,
    coverPhoto: dbUser.cover_photo,
    gender: dbUser.gender as Gender,
    dateOfBirth: dbUser.date_of_birth,
    location: {
      city: dbUser.city,
      country: dbUser.country,
      latitude: dbUser.latitude,
      longitude: dbUser.longitude
    },
    bio: dbUser.bio,
    profession: dbUser.profession,
    education: dbUser.education,
    photos: dbUser.photos || [],
    interests: [], // We'd need to fetch these from user_interests table if needed
    relationshipGoal: dbUser.relationship_goal as RelationshipGoal,
    isOnline: dbUser.is_online,
    lastActive: dbUser.last_active,
    isVerified: dbUser.is_verified
  };
};
