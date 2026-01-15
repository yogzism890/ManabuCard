import { Alert } from "react-native";

/**
 * Upload image to server
 * @param apiRequest - The API request function from AuthContext
 * @param imageUri - The local URI of the image to upload
 * @returns The URL of the uploaded image, or null if failed
 */
export async function uploadImage(
  apiRequest: (endpoint: string, options?: any) => Promise<any>,
  imageUri: string
): Promise<string | null> {
  try {
    // Create form data with the image
    const filename = imageUri.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1] : "jpg";

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: `image.${ext}`,
      type: `image/${ext}`,
    } as any);

    // Upload to server
    const response = await apiRequest("/upload", {
      method: "POST",
      body: formData,
      // Don't set Content-Type for FormData, let the browser set it with boundary
    });

    if (response?.url) {
      return response.url;
    }

    throw new Error("Upload failed");
  } catch (error: any) {
    console.error("Upload error:", error);
    Alert.alert("Error", error?.message ?? "Gagal mengupload gambar");
    return null;
  }
}

/**
 * Check and request media library permissions
 * @returns Whether permission is granted
 */
export async function checkMediaPermission(): Promise<boolean> {
  // Note: In Expo, this is handled by expo-image-picker automatically
  // This function can be used for additional permission checks if needed
  return true;
}

/**
 * Validate that at least one image is selected for IMAGE type cards
 */
export function validateImageCard(
  frontImageUri: string | null,
  backImageUri: string | null
): { valid: boolean; error?: string } {
  if (!frontImageUri && !backImageUri) {
    return {
      valid: false,
      error: "Minimal satu gambar (Depan atau Belakang) wajib dipilih",
    };
  }
  return { valid: true };
}

/**
 * Validate that front text is filled for TEXT type cards
 */
export function validateTextCard(
  frontText: string,
  backText: string
): { valid: boolean; error?: string } {
  if (!frontText.trim()) {
    return {
      valid: false,
      error: "Pertanyaan (Front) tidak boleh kosong",
    };
  }
  if (!backText.trim()) {
    return {
      valid: false,
      error: "Jawaban (Back) tidak boleh kosong",
    };
  }
  return { valid: true };
}

