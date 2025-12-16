import { auth } from "@/lib/firebase";

/**
 * Get the current Firebase ID token for API calls
 * Returns null if user is not authenticated
 */
export async function getFirebaseToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error("Failed to get Firebase token:", error);
    return null;
  }
}

/**
 * Create headers with Firebase authentication
 * Note: Do NOT include Content-Type - supabase.functions.invoke handles it automatically
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getFirebaseToken();
  if (!token) {
    return {};
  }
  
  return {
    "Authorization": `Bearer ${token}`,
  };
}
