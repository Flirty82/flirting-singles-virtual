import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

export const uploadImage = async (file, path, onProgress = null) => {
    try {
        const timestamp = Date.now();
        const fileNme = '${timestamp}_${file.name}';
        const storageRef = ref(storage, '${path}/${fileName}');

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
                    console.error('Upload error:', error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve({
                            url: downloadURL,
                            path: uploadTask.snapshot.ref.fullPath,
                            name: fileName
                        });
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const deleteImage = async (imagePath) => {
    try {
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
    } catch (error) {}
    console.error('Error deleting image:', error);
    throw error;
};