import imageCompression from "browser-image-compression";

export const calculateAge = (dateOfBirth?: string): number | string => {
  if (!dateOfBirth) return '?';
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  if (isNaN(birthDate.getTime())) return '?';
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Hôm qua";
  if (diffInDays < 7) return `${diffInDays} ngày trước`;

  return date.toLocaleDateString();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const uploadOptimizedImage = async (
  file: File,
  bucketName: string,
  userId: string,
): Promise<string | null> => {
  try {
    // 1. Kiểm tra dung lượng file gốc (Chặn nếu > 15MB)
    if (file.size > 15 * 1024 * 1024) {
      alert("Kích thước file quá lớn. Tối đa 15MB!");
      return null;
    }

    // Nếu là GIF hoặc SVG -> Đọc trực tiếp Base64 không nén
    if (file.type === 'image/gif' || file.type === 'image/svg+xml') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    }

    // 2. Nén ảnh ngay trên trình duyệt
    const options = {
      maxSizeMB: 1, // Ép dung lượng tối đa xuống 1MB
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    } catch (compressionErr) {
      console.warn("Nén ảnh thất bại, sử dụng file gốc:", compressionErr);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    }
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    return null;
  }
};

export const mapUser = (u: any): any => {
  if (!u) return u;
  return {
    ...u,
    firstName: u.first_name || u.firstName || u.username || 'Người dùng',
    lastName: u.last_name || u.lastName || '',
    avatar: u.avatar || u.photos?.[0] || '',
    coverPhoto: u.cover_photo || u.coverPhoto || '',
    dateOfBirth: u.date_of_birth || u.dateOfBirth || '',
    isVerified: u.is_verified !== undefined ? u.is_verified : u.isVerified,
    isOnline: u.is_online !== undefined ? u.is_online : u.isOnline,
    lastActive: u.last_active || u.lastActive,
    location: {
      city: u.city || u.location?.city || 'Hồ Chí Minh',
      country: u.country || u.location?.country || 'Việt Nam',
      latitude: u.latitude || u.location?.latitude,
      longitude: u.longitude || u.location?.longitude
    },
    datingPreference: {
      relationshipGoal: u.relationship_goal || u.datingPreference?.relationshipGoal
    }
  };
};

export const mapMatch = (m: any): any => {
  if (!m) return m;
  const rawUser = m.matchedUser || m.matched_user || m.User2 || m.User1 || {};
  const mappedUser = mapUser(rawUser);

  return {
    ...m,
    id: String(m.id || ''),
    userId: String(m.userId || m.user_id || ''),
    matchedUserId: String(m.matchedUserId || m.matched_user_id || mappedUser?.id || ''),
    matchedUser: mappedUser,
    matchPercentage: Number(m.matchPercentage || m.match_percentage || 80),
    matchedAt: m.matchedAt || m.matched_at || new Date().toISOString(),
    isNew: m.isNew !== undefined ? Boolean(m.isNew) : (m.is_new !== undefined ? Boolean(m.is_new) : false),
    lastMessage: m.lastMessage || m.last_message || ''
  };
};

export const mapMessage = (m: any): any => {
  if (!m) return m;
  return {
    ...m,
    id: String(m.id || ''),
    conversationId: m.conversation_id || m.conversationId,
    senderId: m.sender_id || m.senderId,
    timestamp: m.created_at || m.createdAt || m.timestamp,
    type: m.message_type || m.type,
    isDeleted: m.is_deleted !== undefined ? Boolean(m.is_deleted) : Boolean(m.isDeleted),
    isRecalled: m.is_recalled !== undefined ? Boolean(m.is_recalled) : Boolean(m.isRecalled),
    deletedFor: m.deleted_for || m.deletedFor || []
  };
};

export const mapConversation = (c: any): any => {
  if (!c) return c;
  return {
    ...c,
    lastMessage: c.lastMessage ? mapMessage(c.lastMessage) : null,
    participants: c.participants?.map(mapUser) || []
  };
};

export const mapNotification = (n: any): any => {
  if (!n) return n;
  return {
    ...n,
    userId: n.user_id || n.userId,
    fromUserId: n.from_user_id || n.fromUserId,
    timestamp: n.created_at || n.createdAt || n.timestamp,
    isRead: n.is_read !== undefined ? n.is_read : n.isRead,
    fromUser: n.fromUser ? mapUser(n.fromUser) : null
  };
};

export const mapStatus = (s: any): any => {
  if (!s) return s;
  const rawUser = s.user || s.User || {};
  return {
    ...s,
    id: String(s.id || ''),
    userId: String(s.userId || s.user_id || ''),
    user: mapUser(rawUser),
    content: s.content || '',
    mediaUrls: Array.isArray(s.mediaUrls) ? s.mediaUrls : (Array.isArray(s.media_urls) ? s.media_urls : []),
    likesCount: Number(s.likesCount || s.likes_count || 0),
    commentsCount: Number(s.commentsCount || s.comments_count || 0),
    hasLiked: Boolean(s.hasLiked),
    createdAt: s.createdAt || s.created_at || new Date().toISOString()
  };
};

