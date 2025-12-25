import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { authenticateRequest, unauthorizedResponse } from "../_shared/auth.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const FIREBASE_API_KEY = Deno.env.get('FIREBASE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-firebase-token, apikey, content-type',
};

interface BookPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageBase64?: string;
}

interface BookDetails {
  title: string;
  targetAge: string;
  theme: string;
  mainCharacter: string;
  setting: string;
  moral: string;
  pageCount: number;
}

// Firebase Firestore REST API helper
async function saveToFirestore(userId: string, bookData: any) {
  const projectId = 'document-gen-ai';
  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}/books`;
  
  // Convert book data to Firestore document format
  const firestoreDoc = {
    fields: {
      title: { stringValue: bookData.title },
      targetAge: { stringValue: bookData.targetAge },
      theme: { stringValue: bookData.theme },
      mainCharacter: { stringValue: bookData.mainCharacter },
      createdAt: { timestampValue: new Date().toISOString() },
      pageCount: { integerValue: bookData.pages.length.toString() },
      pages: {
        arrayValue: {
          values: bookData.pages.map((page: BookPage) => ({
            mapValue: {
              fields: {
                pageNumber: { integerValue: page.pageNumber.toString() },
                text: { stringValue: page.text },
                imagePrompt: { stringValue: page.imagePrompt },
                imageBase64: { stringValue: page.imageBase64 || '' },
              }
            }
          }))
        }
      }
    }
  };

  try {
    const response = await fetch(`${firestoreUrl}?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(firestoreDoc),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Firestore save error:', errorText);
      return null;
    }

    const result = await response.json();
    console.log('Book saved to Firestore successfully');
    return result;
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const auth = await authenticateRequest(req);

    if (auth.error) {
      return unauthorizedResponse(corsHeaders, auth.error);
    }

    const userId = auth.userId;
    console.log('Generating book for user:', userId);

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const { bookDetails }: { bookDetails: BookDetails } = await req.json();

    if (!bookDetails || !bookDetails.title) {
      throw new Error('Book details are required');
    }

    console.log('Book details:', bookDetails);

    // Step 1: Generate the story structure with text for each page using Gemini API
    const storyPrompt = `You are a children's book author. Create a ${bookDetails.pageCount}-page picture book story.

Book Details:
- Title: ${bookDetails.title}
- Target Age: ${bookDetails.targetAge}
- Theme: ${bookDetails.theme}
- Main Character: ${bookDetails.mainCharacter}
- Setting: ${bookDetails.setting}
- Moral/Lesson: ${bookDetails.moral}

Generate the complete story with exactly ${bookDetails.pageCount} pages. For each page, provide:
1. The story text (2-4 sentences, age-appropriate language)
2. A detailed image description for illustration (describe the scene, characters, colors, style)

Return as JSON array with this structure:
{
  "pages": [
    {
      "pageNumber": 1,
      "text": "Story text for this page...",
      "imagePrompt": "Detailed illustration prompt: A colorful scene showing..."
    }
  ]
}

Make the story engaging, educational, and suitable for children. Use vivid descriptions for the image prompts that would work well for AI image generation.`;

    // Generate story structure using Gemini API
    const storyResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: storyPrompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!storyResponse.ok) {
      const errorText = await storyResponse.text();
      console.error('Story generation error:', errorText);
      throw new Error('Failed to generate story');
    }

    const storyData = await storyResponse.json();
    const storyContent = storyData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    let parsedStory;
    try {
      parsedStory = JSON.parse(storyContent);
    } catch (e) {
      console.error('Failed to parse story JSON:', storyContent);
      throw new Error('Failed to parse generated story');
    }

    const pages: BookPage[] = parsedStory.pages || [];
    console.log(`Generated ${pages.length} pages of story`);

    // Step 2: Generate images for each page using Gemini Imagen
    const pagesWithImages: BookPage[] = [];
    const batchSize = 3;
    
    for (let i = 0; i < pages.length; i += batchSize) {
      const batch = pages.slice(i, i + batchSize);
      console.log(`Generating images for pages ${i + 1} to ${Math.min(i + batchSize, pages.length)}...`);
      
      const imagePromises = batch.map(async (page) => {
        const imagePrompt = `Children's book illustration, colorful and whimsical style, ${page.imagePrompt}. Style: Pixar-like, vibrant colors, child-friendly, warm lighting, no text in image.`;

        try {
          // Using Gemini's image generation (Imagen 3)
          const imageResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: imagePrompt }]
                }
              ],
              generationConfig: {
                responseModalities: ['TEXT', 'IMAGE'],
              },
            }),
          });

          if (!imageResponse.ok) {
            const errorText = await imageResponse.text();
            console.error(`Image generation failed for page ${page.pageNumber}:`, errorText);
            return { ...page, imageBase64: undefined };
          }

          const imageData = await imageResponse.json();
          
          // Extract base64 image from response
          const parts = imageData.candidates?.[0]?.content?.parts || [];
          let imageBase64 = undefined;
          
          for (const part of parts) {
            if (part.inlineData) {
              imageBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
              break;
            }
          }
          
          console.log(`Image generated for page ${page.pageNumber}`);
          return {
            ...page,
            imageBase64,
          };
        } catch (imgError) {
          console.error(`Error generating image for page ${page.pageNumber}:`, imgError);
          return { ...page, imageBase64: undefined };
        }
      });

      const batchResults = await Promise.all(imagePromises);
      pagesWithImages.push(...batchResults);
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < pages.length) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    // Calculate credits based on page count
    const creditCost = pages.length <= 5 ? 3 : pages.length <= 10 ? 5 : 7;

    const bookResult = {
      title: bookDetails.title,
      targetAge: bookDetails.targetAge,
      theme: bookDetails.theme,
      mainCharacter: bookDetails.mainCharacter,
      pages: pagesWithImages,
      creditCost,
    };

    // Save to Firebase Firestore
    const firestoreResult = await saveToFirestore(userId, bookResult);
    if (firestoreResult) {
      console.log('Book saved to Firebase Firestore');
    }

    console.log(`Book generated successfully with ${pagesWithImages.length} pages`);

    return new Response(
      JSON.stringify({
        success: true,
        book: bookResult,
        savedToFirebase: !!firestoreResult,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error generating book:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
