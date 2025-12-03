# Gemini AI Integration Guide

## Getting Your Gemini API Key

1. **Go to Google AI Studio**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Select "Create API key in new project" or choose an existing project
   - Copy the generated API key

3. **Add to Your Project**
   - Create a `.env` file in the root directory (copy from `.env.example`)
   - Add your API key:
     ```
     VITE_GEMINI_API_KEY=your_actual_api_key_here
     ```

4. **Restart Development Server**
   - Stop the dev server (Ctrl+C)
   - Run `npm run dev` again

## Features

The AI Summary feature will:
- ✨ Analyze all your tasks (To Do, In Progress, Done)
- 📊 Provide project status overview
- 🎯 Highlight key accomplishments
- 🔍 Identify current focus areas
- 📋 Suggest upcoming priorities
- ⚠️ Detect potential bottlenecks

## Usage

1. Navigate to the Tasks page
2. Click the "Get Summary" button (purple gradient button with sparkles icon)
3. Click "Generate Summary" in the modal
4. Wait for AI to analyze your tasks
5. Review the beautiful, formatted summary

## Customization

The summary component includes:
- Smooth fade-in and slide-up animations
- Loading shimmer effects
- Dark mode support
- Gradient accent colors matching your theme
- Responsive design

## API Limits

- Free tier: 60 requests per minute
- If you exceed limits, you'll see an error message
- The component handles errors gracefully

## Security Note

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Keep your API key private
