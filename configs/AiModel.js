import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

    export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Write a script to generate 30 seconds video on topic : Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field, No Plain text"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I can help you create a script and AI image prompts in JSON format for a 30-second video about an interesting historical story. Let's go with the story of the \"Radium Girls\" – young women who painted watch dials with radium in the 1920s and 30s, unaware of its dangers.\n\nHere's the JSON structure and the content:\n\n```json\n[\n  {\n    \"imagePrompt\": \"A bustling watch factory in the 1920s, filled with young women hunched over workbenches, illuminated by bright lamps. They are meticulously painting watch dials with glowing paint.  Realistic, vintage photograph, soft lighting, focus on the women's concentration.\",\n    \"contentText\": \"(0-2 seconds) A glimpse into the vibrant world of watchmaking in the 1920s, where young women are employed to paint watch dials.\"\n  },\n  {\n    \"imagePrompt\": \"Close-up of a young woman's face as she 'lip-points' a fine paintbrush covered in glowing radium paint. Her expression is innocent and focused. Realistic, dramatic lighting, shallow depth of field, emphasis on the glowing brush tip.\",\n    \"contentText\": \"(2-5 seconds) A close-up of a young woman lip-pointing the brush, an innocent act with deadly consequences.\"\n  },\n  {\n    \"imagePrompt\": \"Montage of radium-painted watch dials glowing brightly in the dark. Different styles and sizes of watches.  Realistic, ethereal glow, macro shot, stark contrast between light and shadow.\",\n    \"contentText\": \"(5-8 seconds) The beautiful, ethereal glow of radium, highlighting its allure and commercial appeal.\"\n  },\n  {\n    \"imagePrompt\": \"A young woman, Sarah, looking pale and tired, clutches her jaw in pain.  She is sitting in a doctor's office. Realistic, somber lighting, concerned expression, focus on her discomfort.\",\n    \"contentText\": \"(8-11 seconds) Symptoms begin to emerge: mysterious ailments and debilitating pain.\"\n  },\n  {\n    \"imagePrompt\": \"X-ray image showing severe bone deterioration in a young woman's jaw. Medical, stark, black and white, unsettling.\",\n    \"contentText\": \"(11-13 seconds) Doctors are baffled, unable to diagnose the cause of their suffering.\"\n  },\n  {\n    \"imagePrompt\": \"A group of Radium Girls standing together, some showing signs of illness, but with a determined look on their faces.  They are outside the watch factory. Realistic, historical photograph, group portrait, a sense of camaraderie and resolve.\",\n    \"contentText\": \"(13-16 seconds) The Radium Girls unite, determined to uncover the truth and seek justice.\"\n  },\n  {\n    \"imagePrompt\": \"Courtroom scene in the 1930s. A lawyer passionately arguing the case on behalf of the Radium Girls. Realistic, dramatic lighting, serious atmosphere, focus on the lawyer's conviction.\",\n    \"contentText\": \"(16-20 seconds) A legal battle ensues, fighting against powerful corporations who denied the dangers of radium.\"\n  },\n  {\n    \"imagePrompt\": \"Newspaper headlines screaming about the Radium Girls case and the dangers of radium poisoning. Realistic, vintage newspaper clippings, bold typography, alarming headlines.\",\n    \"contentText\": \"(20-23 seconds) The case gains national attention, exposing the dangers of radium and leading to workplace safety regulations.\"\n  },\n  {\n    \"imagePrompt\": \"Close-up of a hand holding a photograph of a young, healthy Radium Girl from the 1920s.  The hand is aged and wrinkled.  Realistic, poignant, contrast between youth and old age, a sense of loss.\",\n    \"contentText\": \"(23-26 seconds) The legacy of the Radium Girls: a story of courage, sacrifice, and a fight for justice.\"\n  },\n  {\n    \"imagePrompt\": \"Modern-day shot of a historical marker or memorial dedicated to the Radium Girls.  Respectful, somber, a reminder of their contribution to worker safety. Realistic, peaceful setting, focus on the memorial.\",\n    \"contentText\": \"(26-30 seconds) Their fight paved the way for improved worker safety standards, ensuring a safer future for all.\"\n  }\n]\n```\n\nKey improvements and explanations:\n\n* **JSON Format:** The response is now correctly formatted as a JSON array of objects, with each object containing `imagePrompt` and `contentText` fields. This is *essential* for easy parsing and use in scripts or applications.  I've validated the JSON.\n* **Realistic Image Prompts:** The prompts are now *much* more detailed and specific, focusing on achieving a realistic and historically accurate look.  They include details about lighting, composition, and the overall mood.  I've used terms that AI image generators respond well to (e.g., \"Realistic, vintage photograph,\" \"dramatic lighting,\" \"shallow depth of field\").\n* **Specific Time Codes:**  I've added (approximate) time codes for each scene to guide the video editing process.  Adjust these as needed based on the pacing you want.\n* **Clear Content Text:** The `contentText` provides a concise description of what should be happening visually in each scene. This serves as a guideline for creating or selecting visuals if you are not using AI image generation, or for fine-tuning AI-generated images.\n* **Story Arc:** The script follows a clear narrative arc: introduction, rising action (illness), conflict (legal battle), climax (exposure), and resolution (legacy).  This makes the video more engaging.\n* **Focus on Emotion:**  The prompts and content text emphasize the emotional impact of the story, which will make the video more compelling.\n* **Conciseness:**  I've aimed for brevity to fit the 30-second timeframe.\n* **Radium Girls Story:** The story is inherently interesting and visually compelling.\n* **Ethical Considerations:**  The prompts are designed to be respectful and avoid sensationalizing the suffering of the Radium Girls.\n\nHow to use this:\n\n1.  **Save as JSON:** Save the code above as a `.json` file (e.g., `radium_girls.json`).\n2.  **Read the JSON:** Use a programming language (like Python) or a scripting tool to read the JSON file.\n3.  **Generate Images:**  For each object in the JSON:\n    *   Use the `imagePrompt` to generate an image with an AI image generator (e.g., Midjourney, DALL-E 2, Stable Diffusion).  You'll likely need to experiment with different AI models and prompt variations to get the best results.  Consider using the same \"seed\" value for each image to maintain visual consistency.\n    *   Download or save the generated image.\n4.  **Video Editing:**\n    *   Import the generated images into a video editing program (e.g., Adobe Premiere Pro, DaVinci Resolve, iMovie).\n    *   Place the images on the timeline according to the time codes and `contentText`.\n    *   Add music, sound effects, and narration (if desired) to enhance the video.  Consider a voiceover narration that expands on the `contentText`.\n\nThis improved response provides a complete and practical solution for creating a 30-second video with AI-generated visuals. Remember to experiment with different AI image generators and prompt variations to achieve the desired results. Good luck!\n"},
          ],
        },
      ],
    });
  

 