// Meeting Summarizer App

const API_URL = 'http://localhost:3000';

class MeetingSummarizer {
    constructor() {
        this.transcript = '';
        this.summary = '';
        this.actionItems = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('process-btn').addEventListener('click', () => this.processMeeting());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearAll());
        document.getElementById('audio-input').addEventListener('change', (e) => this.handleAudioUpload(e));
    }

    showStatus(message, type = 'success') {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status show ${type}`;
        if (type === 'success') {
            setTimeout(() => status.classList.remove('show'), 3000);
        }
    }

    async processMeeting() {
        const transcript = document.getElementById('transcript-input').value.trim();
        
        if (!transcript) {
            this.showStatus('Please enter a transcript or upload an audio file', 'error');
            return;
        }

        document.getElementById('process-btn').disabled = true;
        document.getElementById('process-btn').innerHTML = '<span class="spinner"></span> Processing...';

        try {
            const response = await fetch(`${API_URL}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript })
            });

            if (!response.ok) throw new Error('Failed to process meeting');

            const data = await response.json();
            this.summary = data.summary;
            this.actionItems = data.actionItems;
            this.renderResults();
            this.showStatus('✅ Meeting processed successfully!');
        } catch (error) {
            this.showStatus(`❌ Error: ${error.message}`, 'error');
        } finally {
            document.getElementById('process-btn').disabled = false;
            document.getElementById('process-btn').innerHTML = 'Process Meeting';
        }
    }

    async handleAudioUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        document.getElementById('process-btn').disabled = true;
        document.getElementById('process-btn').innerHTML = '<span class="spinner"></span> Transcribing...';

        try {
            const formData = new FormData();
            formData.append('audio', file);

            const response = await fetch(`${API_URL}/transcribe`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Failed to transcribe audio');

            const data = await response.json();
            document.getElementById('transcript-input').value = data.transcript;
            this.showStatus('✅ Audio transcribed successfully!');
        } catch (error) {
            this.showStatus(`❌ Transcription error: ${error.message}`, 'error');
        } finally {
            document.getElementById('process-btn').disabled = false;
            document.getElementById('process-btn').innerHTML = 'Process Meeting';
        }
    }

    renderResults() {
        // Hide empty state, show results
        document.getElementById('empty-state').style.display = 'none';
        document.getElementById('summary-card').style.display = 'block';
        document.getElementById('attendees-card').style.display = 'block';

        // Render summary
        document.getElementById('summary-text').textContent = this.summary;

        // Render action items by attendee
        const attendeesGrid = document.getElementById('attendees-grid');
        attendeesGrid.innerHTML = '';

        Object.entries(this.actionItems).forEach(([name, items]) => {
            const card = this.createAttendeeCard(name, items);
            attendeesGrid.appendChild(card);
        });
    }

    createAttendeeCard(name, items) {
        const card = document.createElement('div');
        card.className = 'attendee-card';

        const header = document.createElement('div');
        header.className = 'attendee-name';
        header.innerHTML = `👤 ${this.escapeHtml(name)} <span class="attendee-badge">${items.length} items</span>`;

        const todoList = document.createElement('ul');
        todoList.className = 'todo-list';

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.addEventListener('change', (e) => {
                li.classList.toggle('completed');
            });
            
            const textDiv = document.createElement('div');
            textDiv.className = 'todo-text';
            textDiv.textContent = item;
            
            li.appendChild(checkbox);
            li.appendChild(textDiv);
            todoList.appendChild(li);
        });

        const exportButtons = document.createElement('div');
        exportButtons.className = 'export-buttons';
        const copyBtn = document.createElement('button');
        copyBtn.className = 'export-btn copy';
        copyBtn.textContent = '📋 Copy';
        copyBtn.addEventListener('click', () => this.copyToClipboard(name));
        
        const pdfBtn = document.createElement('button');
        pdfBtn.className = 'export-btn pdf';
        pdfBtn.textContent = '📄 PDF';
        pdfBtn.addEventListener('click', () => this.exportPDF(name));
        
        exportButtons.appendChild(copyBtn);
        exportButtons.appendChild(pdfBtn);

        card.appendChild(header);
        card.appendChild(todoList);
        card.appendChild(exportButtons);

        return card;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    copyToClipboard(name) {
        const items = this.actionItems[name];
        const text = `Action Items for ${name}:\n\n${items.map((item, i) => `${i + 1}. ${item}`).join('\n')}`;
        navigator.clipboard.writeText(text).then(() => {
            alert(`✅ Copied ${name}'s action items to clipboard!`);
        }).catch(() => {
            alert('Failed to copy to clipboard');
        });
    }

    exportPDF(name) {
        alert('📄 PDF export feature - integrate with jsPDF library for full implementation');
        // This would be implemented with jsPDF in production
    }

    clearAll() {
        document.getElementById('transcript-input').value = '';
        document.getElementById('audio-input').value = '';
        document.getElementById('summary-card').style.display = 'none';
        document.getElementById('attendees-card').style.display = 'none';
        document.getElementById('empty-state').style.display = 'block';
        document.getElementById('status').classList.remove('show');
        this.actionItems = {};
        this.summary = '';
    }
}

// Initialize app
const app = new MeetingSummarizer();