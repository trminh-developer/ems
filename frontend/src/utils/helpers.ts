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
    // 1. Kiểm tra dung lượng file gốc (Chặn nếu > 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Kích thước ảnh quá lớn. Tối đa 10MB!");
      return null;
    }

    // 2. Nén ảnh ngay trên trình duyệt
    const options = {
      maxSizeMB: 1, // Ép dung lượng tối đa xuống 1MB
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    console.log("Đang nén ảnh...");
    const compressedFile = await imageCompression(file, options);

    // 3. Chuyển đổi thành Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    return null;
  }
};

export const mapUser = (u: any): any => {
  if (!u) return u;
  return {
    ...u,
    firstName: u.first_name || u.firstName,
    lastName: u.last_name || u.lastName,
    coverPhoto: u.cover_photo || u.coverPhoto,
    dateOfBirth: u.date_of_birth || u.dateOfBirth,
    isVerified: u.is_verified !== undefined ? u.is_verified : u.isVerified,
    isOnline: u.is_online !== undefined ? u.is_online : u.isOnline,
    lastActive: u.last_active || u.lastActive,
    location: {
      city: u.city || u.location?.city,
      country: u.country || u.location?.country,
      latitude: u.latitude || u.location?.latitude,
      longitude: u.longitude || u.location?.longitude
    },
    datingPreference: {
      relationshipGoal: u.relationship_goal || u.datingPreference?.relationshipGoal
    }
  };
};

export const mapMessage = (m: any): any => {
  if (!m) return m;
  return {
    ...m,
    conversationId: m.conversation_id || m.conversationId,
    senderId: m.sender_id || m.senderId,
    timestamp: m.created_at || m.createdAt || m.timestamp,
    type: m.message_type || m.type,
    isDeleted: m.is_deleted || m.isDeleted
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

