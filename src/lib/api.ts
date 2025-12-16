import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { supabase } from "@/integrations/supabase/client";

export async function generateContent(prompt: string, type: "document" | "presentation" | "story" | "writer" = "document") {
  try {
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: { prompt, type }
    });

    if (error) throw error;
    if (!data?.content) throw new Error("No content generated");

    return data.content;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

export async function saveGeneratedFile(
  userId: string,
  title: string,
  content: string,
  fileType: "document" | "presentation" | "story" | "writer"
) {
  try {
    const docRef = await addDoc(collection(db, "generated_files"), {
      user_id: userId,
      title,
      content,
      file_type: fileType,
      created_at: serverTimestamp(),
    });

    return { id: docRef.id };
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
}
