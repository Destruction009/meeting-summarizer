# 📋 Meeting Summarizer

A modern web application to transcribe meetings, summarize discussions, extract action items, and organize them by attendee.

## ✨ Features

- **Transcript Input**: Paste meeting transcripts directly
- **Audio Upload**: Upload audio files for automatic transcription
- **Smart Summarization**: Generate 3-5 sentence summaries of discussions
- **Action Item Extraction**: Automatically identify and categorize action items
- **Attendee Dashboard**: View action items organized by person responsible
- **Export Options**:
  - Copy to clipboard
  - Export as PDF
  - Share via email (coming soon)
- **Task Tracking**: Check off completed items
- **Clean UI**: Minimal, focused design

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Destruction009/meeting-summarizer.git
cd meeting-summarizer

# Install dependencies
npm install
```

### Running the App

```bash
# Start the backend server
node server.js

# In another terminal, start the frontend (just open index.html in a browser)
# The app will work directly from the file system
```

The app will be available at `http://localhost:3000` for the API and you can open `index.html` directly in your browser for the frontend.

## 📦 Dependencies

- **Express.js**: Backend API server
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing
- **Axios**: HTTP client (optional, included for future use)
- **jsPDF**: PDF export (included for future use)
- **html2canvas**: PDF rendering (included for future use)

## 🏗️ Project Structure

```
meeting-summarizer/
├── index.html          # Main HTML file (frontend)
├── app.js              # Frontend application logic
├── server.js           # Backend API server
├── vite.config.js      # Vite configuration
├── package.json        # Project dependencies
├── README.md           # This file
├── .gitignore          # Git ignore file
├── .env.example        # Environment variables template
└── uploads/            # Temporary audio file storage
```

## 🔧 API Endpoints

### POST `/analyze`
Analyze a meeting transcript and extract action items.

**Request:**
```json
{
  "transcript": "Meeting transcript text..."
}
```

**Response:**
```json
{
  "summary": "Meeting summary...",
  "actionItems": {
    "John": ["Task 1", "Task 2"],
    "Sarah": ["Task 3"]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### POST `/transcribe`
Transcribe an audio file to text.

**Request:** Form data with audio file
**Response:**
```json
{
  "transcript": "Transcribed text...",
  "duration": 1234,
  "language": "en"
}
```

## 🎨 UI Components

### Input Section
- Transcript textarea for pasting meeting notes
- Audio file upload
- Process and Clear buttons
- Status messages for user feedback

### Summary Card
- Displays AI-generated summary (3-5 sentences)
- Clean typography for readability

### Attendee Cards
- One card per meeting participant
- Lists action items with checkboxes
- Item count badge
- Export buttons (Copy, PDF)

## 💡 Usage Example

1. **Input a transcript** by pasting meeting notes or uploading an audio file
2. **Click "Process Meeting"**
3. **Review the summary** to verify key discussion points
4. **Check action items** - each person has their own to-do list
5. **Export lists** - share individual items via copy/PDF
6. **Track completion** - check off items as they're done

## 🔄 Future Enhancements

- [ ] Real audio transcription (Whisper API, Google Speech-to-Text)
- [ ] Advanced NLP for better action item extraction
- [ ] Email sharing integration
- [ ] Recurring action items
- [ ] Meeting history and analytics
- [ ] Calendar integration
- [ ] Slack/Teams notifications
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Database for storing meetings
- [ ] User authentication

## 📝 License

MIT License - feel free to use this project

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📧 Support

For issues or questions, please open a GitHub issue.
