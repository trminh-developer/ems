import imageCompression from "browser-image-compression";
import { supabase } from "../config/supabase";

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

    // 2. Nén ảnh ngay trên trình duyệt (Tối ưu hóa cốt lõi)
    const options = {
      maxSizeMB: 1, // Ép dung lượng tối đa xuống 1MB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    console.log("Đang nén ảnh...");
    const compressedFile = await imageCompression(file, options);

    // 3. Đổi tên file để tránh trùng lặp
    const fileExt = compressedFile.name.split(".").pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // 4. Upload thẳng lên Supabase Storage (Bỏ qua Backend)
    const { error: uploadError, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, compressedFile);

    if (uploadError) throw uploadError;

    // 5. Lấy URL Public trả về
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    return null;
  }
};
