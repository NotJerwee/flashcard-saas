import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the users specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Only generate 9 flashcards 

Remember, the goal is to facilitate extremely effective learning & rentetion with the user of information through these flashcards. You can also quiz the user on the
given flashcards if they ask you to.

Return in the following JSON format:
{
    "flashcards": [
        {
            "front": "string",
            "back": "string"
        }
    ]
}
`;

export async function POST(req){
    const openai = new OpenAI();

    try {
        const data = await req.text();

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: data },
            ],
        });

        const content = completion.choices[0].message.content.trim();

        let flashcards;
        try {
            flashcards = JSON.parse(content);
        } catch (e) {
            console.error("Failed to parse JSON from OpenAI response:", content);
            return NextResponse.json({ error: "Failed to parse JSON from OpenAI response" }, { status: 500 });
        }

        return NextResponse.json(flashcards.flashcards);
    } catch (error) {
        console.error("Error in processing the request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}