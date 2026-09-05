import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// Mock API - Replace with actual AI service integration
const generateSummary = (transcript) => {
    // Simple mock: return first 3-5 sentences
    const sentences = transcript.split(/[.!?]+/).filter(s => s.trim()).slice(0, 5);
    return sentences.map(s => s.trim()).join('. ') + '.';
};

const extractActionItems = (transcript) => {
    const actionItems = {};
    
    // Simple extraction: find names and associated actions
    const nameRegex = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/g;
    const actionRegex = /(should|will|must|needs to|has to|going to|to|needs|action|task)\s+([^.!?]*)/gi;
    
    const names = [...new Set(transcript.match(nameRegex) || [])];
    const actions = [...transcript.matchAll(actionRegex)];
    
    // Distribute actions to names
    if (actions.length === 0) {
        // Fallback: extract sentences mentioning names
        names.forEach(name => {
            const regex = new RegExp(`${name}[^.!?]*`, 'g');
            const matches = transcript.match(regex) || [];
            actionItems[name] = matches.map(m => m.trim()).filter(m => m.length > 0).slice(0, 5);
        });
    } else {
        names.forEach(name => {
            actionItems[name] = [];
        });
        
        actions.forEach((action, index) => {
            const name = names[index % names.length];
            if (name) {
                actionItems[name].push(action[2].trim());
            }
        });
    }
    
    // Ensure at least one action per person
    Object.keys(actionItems).forEach(name => {
        if (actionItems[name].length === 0) {
            actionItems[name] = ['Review meeting notes', 'Follow up on decisions'];
        }
    });
    
    return actionItems;
};

app.post('/analyze', (req, res) => {
    const { transcript } = req.body;
    
    if (!transcript || transcript.length === 0) {
        return res.status(400).json({ error: 'No transcript provided' });
    }
    
    const summary = generateSummary(transcript);
    const actionItems = extractActionItems(transcript);
    
    res.json({
        summary,
        actionItems,
        timestamp: new Date().toISOString()
    });
});

app.post('/transcribe', upload.single('audio'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No audio file provided' });
    }
    
    // Mock transcription - In production, use real transcription service
    const mockTranscript = `
    John: Good morning everyone. Let's start with the Q4 roadmap.
    Sarah: We need to finalize the API design by next week.
    Mike: I'll handle the database optimization. Should be done by Friday.
    John: Great. Sarah, can you coordinate with the frontend team?
    Sarah: Yes, I'll schedule a meeting for tomorrow.
    Mike: Also, we need to update the documentation.
    John: Mike, that's your task. John will help with the API docs.
    `;
    
    // Clean up uploaded file
    try {
        fs.unlinkSync(req.file.path);
    } catch (err) {
        console.log('Could not delete temp file:', err.message);
    }
    
    res.json({
        transcript: mockTranscript,
        duration: Math.floor(Math.random() * 3600),
        language: 'en'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Meeting Summarizer server running on http://localhost:${PORT}`);
    console.log('📝 Ready to process meetings!');
});