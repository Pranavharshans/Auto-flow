# 🌊 Real-time Responses - Google ADK

> **Build responsive, interactive AI experiences with streaming capabilities**

## 🎯 Overview

Google ADK's streaming capabilities enable real-time, interactive experiences that feel natural and responsive. Instead of waiting for complete responses, users receive live updates as the agent processes their requests, creating engaging conversational experiences.

---

## 🚀 Streaming Fundamentals

### 1. 📡 Basic Text Streaming

Stream text responses token by token for immediate user feedback.

```python
from google.adk.streaming import StreamingAgent
from google.adk.agents import Agent

# Create streaming-enabled agent
base_agent = Agent(
    name="conversational_agent",
    model="gemini-2.0-flash-exp",
    instruction="Provide helpful, detailed responses with natural conversation flow",
    tools=["search", "calculator"]
)

# Enable streaming
streaming_agent = StreamingAgent(
    base_agent=base_agent,
    stream_config={
        "chunk_size": 50,        # Characters per chunk
        "delay": 0.05,           # Delay between chunks (seconds)
        "buffer_threshold": 100   # Buffer before sending
    }
)

# Stream a response
async def stream_response():
    async for chunk in streaming_agent.stream("Tell me about quantum computing"):
        print(chunk.text, end='', flush=True)
        # Optional: Update UI in real-time
        await update_ui(chunk.text)
```

### 2. 🎭 Advanced Streaming Configuration

Configure streaming behavior for different use cases.

```python
from google.adk.streaming import StreamConfig, ChunkType

# High-responsiveness configuration
high_speed_config = StreamConfig(
    chunk_size=20,               # Smaller chunks
    delay=0.01,                  # Minimal delay
    buffer_threshold=50,         # Quick buffering
    chunk_type=ChunkType.WORD,   # Stream word by word
    enable_typing_indicator=True, # Show typing indicator
    punctuation_pauses=True      # Pause at punctuation
)

# Smooth reading configuration
smooth_config = StreamConfig(
    chunk_size=100,              # Larger chunks
    delay=0.1,                   # Natural reading pace
    buffer_threshold=200,        # Larger buffer
    chunk_type=ChunkType.SENTENCE, # Stream sentence by sentence
    natural_pauses=True,         # Natural conversation pauses
    emotion_timing=True          # Adjust timing based on content
)

# Performance-optimized configuration
performance_config = StreamConfig(
    chunk_size=500,              # Large chunks
    delay=0,                     # No artificial delay
    buffer_threshold=1000,       # Large buffer
    chunk_type=ChunkType.PARAGRAPH, # Stream paragraphs
    compression=True,            # Compress chunks
    batch_mode=True              # Batch multiple chunks
)
```

---

## 🎪 Multi-Modal Streaming

### 1. 🎵 Audio Streaming

Stream audio responses for voice-enabled applications.

```python
from google.adk.streaming import AudioStreamingAgent
from google.adk.audio import VoiceConfig

# Configure voice settings
voice_config = VoiceConfig(
    voice_id="en-US-Journey-D",     # Google Cloud TTS voice
    speaking_rate=1.0,              # Normal speaking rate
    pitch=0.0,                      # Neutral pitch
    volume_gain_db=0.0,             # Normal volume
    sample_rate=24000,              # High quality audio
    audio_encoding="LINEAR16"       # Uncompressed audio
)

# Create audio streaming agent
audio_agent = AudioStreamingAgent(
    base_agent=base_agent,
    voice_config=voice_config,
    audio_config={
        "streaming": True,
        "real_time": True,
        "low_latency": True,
        "buffer_size": 4096,
        "chunk_duration": 0.1       # 100ms chunks
    }
)

# Stream audio response
async def stream_audio_response():
    async for audio_chunk in audio_agent.stream_audio("Explain machine learning"):
        # Play audio chunk immediately
        await audio_player.play_chunk(audio_chunk.audio_data)
        
        # Optional: Show transcription
        if audio_chunk.transcript:
            print(audio_chunk.transcript, end='', flush=True)
```

### 2. 🎬 Video Streaming

Stream video content with synchronized audio and visual elements.

```python
from google.adk.streaming import VideoStreamingAgent
from google.adk.video import VideoConfig

# Configure video settings
video_config = VideoConfig(
    resolution="1920x1080",         # Full HD
    frame_rate=30,                  # Smooth video
    codec="h264",                   # Efficient compression
    background="gradient_blue",      # Professional background
    avatar="professional_female",    # AI avatar
    avatar_position="bottom_right"   # Avatar placement
)

# Create video streaming agent
video_agent = VideoStreamingAgent(
    base_agent=base_agent,
    video_config=video_config,
    streaming_config={
        "real_time_rendering": True,
        "adaptive_quality": True,
        "sync_audio_video": True,
        "gesture_animation": True
    }
)

# Stream video response
async def stream_video_response():
    async for video_frame in video_agent.stream_video("Present the quarterly results"):
        # Display video frame
        await video_display.show_frame(video_frame.frame_data)
        
        # Update subtitle/transcript
        if video_frame.transcript:
            await subtitle_display.update(video_frame.transcript)
```

---

## 🔄 Interactive Streaming

### 1. 🎯 Bi-directional Streaming

Enable real-time interaction during streaming responses.

```python
from google.adk.streaming import InteractiveStreamingAgent
from google.adk.interaction import InteractionHandler

class CustomInteractionHandler(InteractionHandler):
    async def on_user_interruption(self, context):
        """Handle user interruptions during streaming."""
        # Pause current stream
        await context.pause_stream()
        
        # Process interruption
        user_input = await context.get_user_input()
        
        if user_input.startswith("stop"):
            return await context.stop_stream()
        elif user_input.startswith("clarify"):
            # Add clarification to stream
            return await context.inject_clarification(user_input)
        else:
            # Resume with modification
            return await context.resume_with_modification(user_input)
    
    async def on_user_feedback(self, feedback, context):
        """Handle real-time feedback."""
        if feedback.type == "thumbs_down":
            # Adjust response in real-time
            await context.adjust_response(feedback.suggestion)
        elif feedback.type == "speed_adjustment":
            # Adjust streaming speed
            await context.adjust_speed(feedback.speed_multiplier)

# Create interactive streaming agent
interactive_agent = InteractiveStreamingAgent(
    base_agent=base_agent,
    interaction_handler=CustomInteractionHandler(),
    interaction_config={
        "allow_interruptions": True,
        "feedback_enabled": True,
        "real_time_adjustment": True,
        "context_preservation": True
    }
)

# Interactive streaming session
async def interactive_session():
    session = await interactive_agent.start_session()
    
    # Start streaming response
    stream_task = asyncio.create_task(
        session.stream_response("Explain blockchain technology")
    )
    
    # Listen for user interactions
    interaction_task = asyncio.create_task(
        session.listen_for_interactions()
    )
    
    # Handle both simultaneously
    await asyncio.gather(stream_task, interaction_task)
```

### 2. 🎨 Dynamic Content Adaptation

Adapt streaming content based on real-time user engagement.

```python
from google.adk.streaming import AdaptiveStreamingAgent
from google.adk.analytics import EngagementTracker

class EngagementBasedAdapter:
    def __init__(self):
        self.engagement_tracker = EngagementTracker()
    
    async def adapt_content(self, content, engagement_data):
        """Adapt content based on real-time engagement."""
        if engagement_data.attention_level < 0.5:
            # Low attention - make content more engaging
            return await self.make_more_engaging(content)
        
        if engagement_data.comprehension_level < 0.6:
            # Low comprehension - simplify content
            return await self.simplify_content(content)
        
        if engagement_data.interest_level > 0.8:
            # High interest - add more detail
            return await self.add_more_detail(content)
        
        return content
    
    async def make_more_engaging(self, content):
        """Make content more engaging."""
        return {
            "text": content["text"],
            "visual_elements": ["charts", "animations"],
            "interactive_elements": ["polls", "quizzes"],
            "tone": "enthusiastic"
        }

# Create adaptive streaming agent
adaptive_agent = AdaptiveStreamingAgent(
    base_agent=base_agent,
    adapter=EngagementBasedAdapter(),
    adaptation_config={
        "real_time_analysis": True,
        "engagement_tracking": True,
        "content_modification": True,
        "learning_enabled": True
    }
)

# Adaptive streaming with engagement tracking
async def adaptive_streaming():
    async for chunk in adaptive_agent.stream("Explain artificial intelligence"):
        # Track user engagement
        engagement = await adaptive_agent.get_current_engagement()
        
        # Display adapted content
        await display_content(chunk.adapted_content)
        
        # Show engagement indicators
        await update_engagement_ui(engagement)
```

---

## 🛠️ Technical Implementation

### 1. 🔧 WebSocket Integration

Implement real-time streaming over WebSocket connections.

```python
from google.adk.streaming import WebSocketStreaming
import websockets
import json

class StreamingWebSocketHandler:
    def __init__(self, streaming_agent):
        self.streaming_agent = streaming_agent
        self.active_connections = set()
    
    async def handle_connection(self, websocket, path):
        """Handle new WebSocket connection."""
        self.active_connections.add(websocket)
        
        try:
            async for message in websocket:
                data = json.loads(message)
                
                if data["type"] == "stream_request":
                    await self.handle_stream_request(websocket, data)
                elif data["type"] == "interrupt":
                    await self.handle_interruption(websocket, data)
                elif data["type"] == "feedback":
                    await self.handle_feedback(websocket, data)
        
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            self.active_connections.remove(websocket)
    
    async def handle_stream_request(self, websocket, data):
        """Handle streaming request."""
        user_message = data["message"]
        session_id = data.get("session_id")
        
        # Start streaming response
        async for chunk in self.streaming_agent.stream(user_message, session_id=session_id):
            # Send chunk to client
            response = {
                "type": "stream_chunk",
                "chunk_id": chunk.id,
                "text": chunk.text,
                "is_final": chunk.is_final,
                "metadata": chunk.metadata
            }
            
            try:
                await websocket.send(json.dumps(response))
            except websockets.exceptions.ConnectionClosed:
                break
    
    async def handle_interruption(self, websocket, data):
        """Handle user interruption."""
        session_id = data["session_id"]
        interruption_type = data["interruption_type"]
        
        # Process interruption
        result = await self.streaming_agent.handle_interruption(
            session_id, interruption_type
        )
        
        # Send result to client
        response = {
            "type": "interruption_result",
            "result": result
        }
        
        await websocket.send(json.dumps(response))

# Start WebSocket server
async def start_streaming_server():
    handler = StreamingWebSocketHandler(streaming_agent)
    
    start_server = websockets.serve(
        handler.handle_connection,
        "localhost",
        8765
    )
    
    await start_server
```

### 2. 🌐 HTTP Streaming (Server-Sent Events)

Implement streaming over HTTP using Server-Sent Events.

```python
from google.adk.streaming import SSEStreaming
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import json

app = FastAPI()

class SSEStreamingHandler:
    def __init__(self, streaming_agent):
        self.streaming_agent = streaming_agent
    
    async def stream_response(self, message: str, session_id: str = None):
        """Generate SSE stream."""
        async for chunk in self.streaming_agent.stream(message, session_id=session_id):
            # Format as SSE
            sse_data = {
                "chunk_id": chunk.id,
                "text": chunk.text,
                "is_final": chunk.is_final,
                "timestamp": chunk.timestamp
            }
            
            yield f"data: {json.dumps(sse_data)}\n\n"
        
        # Send end marker
        yield "data: {\"type\": \"stream_end\"}\n\n"

sse_handler = SSEStreamingHandler(streaming_agent)

@app.post("/stream")
async def stream_endpoint(request: dict):
    """Stream response endpoint."""
    message = request["message"]
    session_id = request.get("session_id")
    
    return StreamingResponse(
        sse_handler.stream_response(message, session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*"
        }
    )
```

---

## 📱 Client-Side Integration

### 1. 🌐 JavaScript WebSocket Client

Integrate streaming with web applications.

```javascript
class StreamingClient {
    constructor(serverUrl) {
        this.serverUrl = serverUrl;
        this.socket = null;
        this.sessionId = this.generateSessionId();
    }
    
    connect() {
        this.socket = new WebSocket(this.serverUrl);
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };
        
        this.socket.onopen = () => {
            console.log('Connected to streaming server');
        };
        
        this.socket.onclose = () => {
            console.log('Disconnected from streaming server');
        };
    }
    
    sendMessage(message) {
        const request = {
            type: 'stream_request',
            message: message,
            session_id: this.sessionId
        };
        
        this.socket.send(JSON.stringify(request));
    }
    
    handleMessage(data) {
        switch (data.type) {
            case 'stream_chunk':
                this.onStreamChunk(data);
                break;
            case 'stream_end':
                this.onStreamEnd();
                break;
            case 'error':
                this.onError(data);
                break;
        }
    }
    
    onStreamChunk(chunk) {
        // Update UI with new chunk
        const messageContainer = document.getElementById('response');
        
        if (chunk.chunk_id === 1) {
            // First chunk - clear previous content
            messageContainer.innerHTML = '';
        }
        
        // Append new text with typing animation
        this.typeText(messageContainer, chunk.text);
        
        // Auto-scroll to bottom
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
    
    typeText(container, text) {
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                container.innerHTML += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 30); // 30ms between characters
    }
    
    interrupt(type = 'stop') {
        const request = {
            type: 'interrupt',
            session_id: this.sessionId,
            interruption_type: type
        };
        
        this.socket.send(JSON.stringify(request));
    }
    
    sendFeedback(feedbackType, data) {
        const request = {
            type: 'feedback',
            session_id: this.sessionId,
            feedback_type: feedbackType,
            data: data
        };
        
        this.socket.send(JSON.stringify(request));
    }
    
    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }
}

// Usage
const client = new StreamingClient('ws://localhost:8765');
client.connect();

// Send message
document.getElementById('sendBtn').onclick = () => {
    const message = document.getElementById('messageInput').value;
    client.sendMessage(message);
};

// Interrupt button
document.getElementById('stopBtn').onclick = () => {
    client.interrupt('stop');
};
```

### 2. 📱 React Streaming Component

Create reusable React components for streaming interfaces.

```jsx
import React, { useState, useEffect, useRef } from 'react';

const StreamingResponse = ({ message, onComplete }) => {
    const [streamedText, setStreamedText] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [canInterrupt, setCanInterrupt] = useState(false);
    const socketRef = useRef(null);
    const sessionIdRef = useRef(null);
    
    useEffect(() => {
        if (message) {
            startStreaming(message);
        }
        
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [message]);
    
    const startStreaming = (userMessage) => {
        setStreamedText('');
        setIsStreaming(true);
        setCanInterrupt(true);
        
        // Connect to WebSocket
        socketRef.current = new WebSocket('ws://localhost:8765');
        sessionIdRef.current = generateSessionId();
        
        socketRef.current.onopen = () => {
            // Send streaming request
            socketRef.current.send(JSON.stringify({
                type: 'stream_request',
                message: userMessage,
                session_id: sessionIdRef.current
            }));
        };
        
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'stream_chunk') {
                setStreamedText(prev => prev + data.text);
                
                if (data.is_final) {
                    setIsStreaming(false);
                    setCanInterrupt(false);
                    onComplete && onComplete(streamedText + data.text);
                }
            }
        };
    };
    
    const handleInterrupt = () => {
        if (socketRef.current && canInterrupt) {
            socketRef.current.send(JSON.stringify({
                type: 'interrupt',
                session_id: sessionIdRef.current,
                interruption_type: 'stop'
            }));
            
            setIsStreaming(false);
            setCanInterrupt(false);
        }
    };
    
    const generateSessionId = () => {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    };
    
    return (
        <div className="streaming-response">
            <div className="response-text">
                {streamedText}
                {isStreaming && <span className="cursor">|</span>}
            </div>
            
            {canInterrupt && (
                <button 
                    className="interrupt-btn"
                    onClick={handleInterrupt}
                >
                    Stop
                </button>
            )}
            
            {isStreaming && (
                <div className="streaming-indicator">
                    <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )}
        </div>
    );
};

// Usage in a chat component
const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    
    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            const newMessage = {
                id: Date.now(),
                text: currentMessage,
                type: 'user'
            };
            
            setMessages(prev => [...prev, newMessage]);
            setCurrentMessage('');
        }
    };
    
    const handleStreamComplete = (responseText) => {
        const responseMessage = {
            id: Date.now(),
            text: responseText,
            type: 'assistant'
        };
        
        setMessages(prev => [...prev, responseMessage]);
    };
    
    return (
        <div className="chat-interface">
            <div className="messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.type}`}>
                        {msg.text}
                    </div>
                ))}
                
                {currentMessage && (
                    <StreamingResponse 
                        message={messages[messages.length - 1]?.text}
                        onComplete={handleStreamComplete}
                    />
                )}
            </div>
            
            <div className="input-area">
                <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatInterface;
```

---

## 🎯 Performance Optimization

### 1. 📈 Streaming Performance

Optimize streaming performance for better user experience.

```python
from google.adk.streaming import PerformanceOptimizer
from google.adk.caching import StreamCache

class OptimizedStreamingAgent:
    def __init__(self, base_agent):
        self.base_agent = base_agent
        self.optimizer = PerformanceOptimizer()
        self.cache = StreamCache()
        self.predictor = ResponsePredictor()
    
    async def stream_optimized(self, message, context=None):
        """Stream with performance optimizations."""
        
        # Check cache for similar requests
        cached_response = await self.cache.get_similar(message)
        if cached_response:
            # Stream cached response with modifications
            async for chunk in self.stream_cached(cached_response, message):
                yield chunk
            return
        
        # Predict response length for better buffering
        predicted_length = await self.predictor.predict_length(message)
        optimal_chunk_size = self.optimizer.calculate_chunk_size(predicted_length)
        
        # Stream with optimized settings
        stream_config = {
            "chunk_size": optimal_chunk_size,
            "buffer_size": min(predicted_length // 4, 1000),
            "predictive_loading": True
        }
        
        async for chunk in self.base_agent.stream(message, config=stream_config):
            # Apply real-time optimizations
            optimized_chunk = await self.optimizer.optimize_chunk(chunk)
            yield optimized_chunk
            
            # Cache chunks for future use
            await self.cache.store_chunk(message, optimized_chunk)
    
    async def stream_cached(self, cached_response, current_message):
        """Stream cached response with adaptations."""
        adaptation = await self.calculate_adaptation(cached_response, current_message)
        
        for chunk in cached_response.chunks:
            adapted_chunk = await self.adapt_chunk(chunk, adaptation)
            yield adapted_chunk
            
            # Simulate natural streaming delay
            await asyncio.sleep(0.03)
```

### 2. 🚀 Bandwidth Optimization

Optimize for different bandwidth conditions.

```python
from google.adk.streaming import BandwidthOptimizer

class AdaptiveBandwidthStreaming:
    def __init__(self, streaming_agent):
        self.streaming_agent = streaming_agent
        self.bandwidth_optimizer = BandwidthOptimizer()
        self.connection_monitor = ConnectionMonitor()
    
    async def adaptive_stream(self, message):
        """Stream with bandwidth adaptation."""
        
        # Monitor connection quality
        connection_quality = await self.connection_monitor.get_quality()
        
        # Adapt streaming parameters
        if connection_quality == "high":
            config = {
                "chunk_size": 200,
                "compression": False,
                "quality": "high",
                "include_metadata": True
            }
        elif connection_quality == "medium":
            config = {
                "chunk_size": 100,
                "compression": True,
                "quality": "medium", 
                "include_metadata": False
            }
        else:  # low quality
            config = {
                "chunk_size": 50,
                "compression": True,
                "quality": "low",
                "include_metadata": False,
                "text_only": True
            }
        
        # Stream with adaptive configuration
        async for chunk in self.streaming_agent.stream(message, config=config):
            # Monitor bandwidth during streaming
            current_bandwidth = await self.connection_monitor.get_bandwidth()
            
            if current_bandwidth < config["min_bandwidth"]:
                # Reduce quality mid-stream
                chunk = await self.bandwidth_optimizer.reduce_quality(chunk)
            
            yield chunk
```

---

## ✅ Best Practices

### 1. **User Experience**
- Provide immediate feedback with streaming
- Allow users to interrupt or modify responses
- Show typing indicators and progress
- Handle network issues gracefully
- Optimize for different devices and connections

### 2. **Performance**
- Use appropriate chunk sizes for your use case
- Implement caching for common responses
- Monitor and adapt to network conditions
- Optimize buffer sizes and delays
- Consider predictive loading

### 3. **Technical Implementation**
- Handle connection drops and reconnections
- Implement proper error handling
- Use efficient serialization formats
- Consider compression for large responses
- Monitor streaming metrics

### 4. **Security**
- Validate streaming inputs
- Implement rate limiting
- Secure WebSocket connections
- Handle sensitive data appropriately
- Monitor for abuse patterns

---

> **🎯 Next Steps**: Explore [Voice Interactions](voice-interactions.md) to add speech capabilities to your streaming agents!