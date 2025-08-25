import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebase';

// ==============================================
// VIDEO UPLOAD SERVICE
// ==============================================

export const uploadVideo = async (file, path, onProgress = null) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Video upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url: downloadURL,
              path: uploadTask.snapshot.ref.fullPath,
              name: fileName,
              originalName: file.name,
              size: file.size
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

export const deleteVideo = async (videoPath) => {
  try {
    const videoRef = ref(storage, videoPath);
    await deleteObject(videoRef);
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

// ==============================================
// VIDEO COMPRESSION SERVICE
// ==============================================

export const compressVideo = async (videoFile, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    maxDuration = 60
  } = options;
  
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.onloadedmetadata = () => {
      // Check duration
      if (video.duration > maxDuration) {
        reject(new Error(`Video too long. Maximum duration is ${maxDuration} seconds.`));
        return;
      }
      
      // Calculate new dimensions
      let { videoWidth, videoHeight } = video;
      
      if (videoWidth > maxWidth || videoHeight > maxHeight) {
        const ratio = Math.min(maxWidth / videoWidth, maxHeight / videoHeight);
        videoWidth *= ratio;
        videoHeight *= ratio;
      }
      
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      // For now, just return original file
      // In production, you'd use ffmpeg.wasm or similar for compression
      resolve(videoFile);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to process video file'));
    };
    
    video.src = URL.createObjectURL(videoFile);
  });
};

// ==============================================
// THUMBNAIL GENERATION
// ==============================================

export const generateVideoThumbnail = (videoFile, timeOffset = 1) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(timeOffset, video.duration * 0.1);
    };
    
    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.8);
    };
    
    video.src = URL.createObjectURL(videoFile);
  });
};

// ==============================================
// USER VIDEO PROFILE MANAGEMENT
// ==============================================

export const addVideoToProfile = async (userId, videoData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      videos: arrayUnion(videoData),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error adding video to profile:', error);
    throw error;
  }
};

export const removeVideoFromProfile = async (userId, videoData) => {
  try {
    // Delete video files from storage
    if (videoData.videoPath) {
      await deleteVideo(videoData.videoPath);
    }
    if (videoData.thumbnailPath) {
      await deleteVideo(videoData.thumbnailPath);
    }
    
    // Remove from user profile
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      videos: arrayRemove(videoData),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error removing video from profile:', error);
    throw error;
  }
};

// ==============================================
// MEDIA SHARING IN CHAT
// ==============================================

export const sendMediaMessage = async (roomId, mediaFile, messageData) => {
  try {
    // Upload media file
    const uploadResult = await uploadVideo(mediaFile, 'chat/media');
    
    // Send message with media
    const message = {
      ...messageData,
      roomId,
      type: mediaFile.type.startsWith('image/') ? 'image' : 'video',
      mediaUrl: uploadResult.url,
      mediaPath: uploadResult.path,
      mediaSize: uploadResult.size,
      createdAt: serverTimestamp()
    };
    
    return await sendMessage(message);
  } catch (error) {
    console.error('Error sending media message:', error);
    throw error;
  }
};

// ==============================================
// VIDEO ANALYTICS (Optional)
// ==============================================

export const trackVideoView = async (videoId, userId) => {
  try {
    await addDoc(collection(db, 'videoViews'), {
      videoId,
      userId,
      viewedAt: serverTimestamp(),
      ip: '', // You might want to track IP for analytics
      userAgent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error tracking video view:', error);
  }
};

export const getVideoStats = async (videoId) => {
  try {
    const q = query(
      collection(db, 'videoViews'),
      where('videoId', '==', videoId)
    );
    
    const querySnapshot = await getDocs(q);
    const totalViews = querySnapshot.size;
    
    // Get unique viewers
    const uniqueViewers = new Set();
    querySnapshot.forEach((doc) => {
      uniqueViewers.add(doc.data().userId);
    });
    
    return {
      totalViews,
      uniqueViewers: uniqueViewers.size,
      views: querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };
  } catch (error) {
    console.error('Error getting video stats:', error);
    throw error;
  }
};