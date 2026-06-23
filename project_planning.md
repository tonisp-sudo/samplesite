# Prompt 1 – Project Planning

You are a senior full-stack engineer.

I already have an existing website. I want to add an AI chatbot section directly below the hero section without changing the rest of the website.

The chatbot will answer questions using information from Meat & Livestock Australia (MLA) resources only.

Stack:

* Existing website frontend
* React component for chatbot UI
* FastAPI backend
* ChromaDB vector database
* Local embedding model
* Local LLM accessed through Ollama
* Development performed with Pi Coding Agent

Requirements:

1. Preserve the existing website structure and styling.
2. Add a responsive chatbot section below the hero section.
3. Use a modern card layout.
4. Support desktop and mobile.
5. Include:

   * Chat history
   * Loading animation
   * Source citations
   * Clear error messages
   * Scrollable conversation
6. Answers must be based only on retrieved MLA documents.
7. Never fabricate information.
8. If information is unavailable, respond with:

"I could not find information about that in the MLA knowledge base."

9. Return citations with every answer.
10. Use clean, modular code.
11. Separate frontend and backend responsibilities.
12. Create a project structure before writing code.
13. Explain architectural decisions.

Start by producing:

* Folder structure
* Technology stack overview
* Data flow diagram
* API design
* Development plan

Do not write code yet.
