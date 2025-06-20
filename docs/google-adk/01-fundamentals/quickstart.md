# ⚡ Quick Start Guide - Build Your First Agent

> **From zero to working agent in 10 minutes**

## 🎯 What You'll Build

In this quickstart, you'll create three progressively sophisticated agents:

1. **Simple Echo Agent** - Basic agent that repeats user input
2. **Weather Assistant** - Agent with tool integration 
3. **Multi-Agent System** - Coordinated agents with specialized roles

---

## 🏁 Step 1: Environment Setup

### Prerequisites Check

```bash
# Verify Python installation
python --version  # Should be 3.8+

# Check if ADK is installed
python -c "import google.adk; print('ADK Ready!')"
```

### API Key Configuration

```bash
# Set your Google API key
export GOOGLE_API_KEY='your-gemini-api-key-here'

# Verify it works
python -c "from google.adk import Client; print('Auth OK!', Client().models.list())"
```

---

## 🤖 Step 2: Your First Agent (Echo Agent)

### Create the Agent

Create a file called `echo_agent.py`:

```python
# echo_agent.py
from google.adk.agents import Agent

# Define a simple echo agent
echo_agent = Agent(
    name="echo_assistant",
    model="gemini-2.0-flash-exp",
    instruction="""You are a friendly echo assistant. 
    Your job is to:
    1. Repeat what the user says in a creative way
    2. Add some enthusiasm to your responses
    3. Be helpful and encouraging""",
    description="A simple agent that echoes user input with enthusiasm"
)

# Test the agent
def test_agent():
    """Quick test function."""
    print("🤖 Echo Agent created successfully!")
    print(f"Agent name: {echo_agent.name}")
    print(f"Model: {echo_agent.model}")
    
if __name__ == "__main__":
    test_agent()
```

### Run the Agent

```bash
# Test the agent creation
python echo_agent.py

# Start the interactive web interface
adk web echo_agent.py
```

### Interact with Your Agent

1. Open your browser to `http://localhost:8080`
2. Type: "Hello there!"
3. Watch your agent respond with enthusiasm!

**Expected Output:**
```
Agent: Hello there! 🎉 What a wonderful greeting! 
You said "Hello there!" and I'm absolutely delighted 
to meet you! How can I help make your day amazing?
```

---

## 🌤️ Step 3: Weather Assistant (With Tools)

### Create a Weather Tool

Create `weather_agent.py`:

```python
# weather_agent.py
from google.adk.agents import Agent
from typing import Dict

def get_weather(location: str) -> Dict:
    """
    Get current weather for a location.
    
    Args:
        location: City name, e.g., "New York" or "London"
        
    Returns:
        Dictionary with weather information
    """
    # Mock weather data for demo
    # In production, you'd call a real weather API
    weather_data = {
        "new york": {"temp": "22°C", "condition": "Sunny", "humidity": "65%"},
        "london": {"temp": "15°C", "condition": "Cloudy", "humidity": "80%"},
        "tokyo": {"temp": "28°C", "condition": "Rainy", "humidity": "90%"},
        "sydney": {"temp": "18°C", "condition": "Windy", "humidity": "55%"},
    }
    
    location_key = location.lower()
    if location_key in weather_data:
        data = weather_data[location_key]
        return {
            "status": "success",
            "location": location.title(),
            "temperature": data["temp"],
            "condition": data["condition"],
            "humidity": data["humidity"],
            "message": f"Current weather in {location.title()}: {data['condition']}, {data['temp']}"
        }
    else:
        return {
            "status": "error",
            "message": f"Sorry, I don't have weather data for {location}"
        }

# Create weather agent with tool
weather_agent = Agent(
    name="weather_assistant",
    model="gemini-2.0-flash-exp",
    instruction="""You are a helpful weather assistant.
    
    When users ask about weather:
    1. Use the get_weather tool to fetch current conditions
    2. Present the information in a friendly, conversational way
    3. Include relevant details like temperature, conditions, and humidity
    4. Offer helpful suggestions based on the weather
    
    If users ask about other topics, be helpful but redirect to weather-related questions.""",
    description="A weather assistant that provides current weather information",
    tools=[get_weather]  # Add our custom tool
)

def test_weather_agent():
    """Test the weather agent functionality."""
    print("🌤️ Weather Agent created successfully!")
    print(f"Agent: {weather_agent.name}")
    print(f"Tools: {[tool.__name__ for tool in weather_agent.tools]}")
    
    # Test the tool directly
    result = get_weather("New York")
    print(f"Sample weather data: {result}")

if __name__ == "__main__":
    test_weather_agent()
```

### Test the Weather Agent

```bash
# Test agent creation
python weather_agent.py

# Start web interface
adk web weather_agent.py
```

### Example Interactions

**User:** "What's the weather like in Tokyo?"

**Agent:** "Let me check the current weather in Tokyo for you! 

*[Tool: get_weather called with location: Tokyo]*

The weather in Tokyo is currently rainy with a temperature of 28°C and humidity at 90%. It's quite humid today! You might want to bring an umbrella if you're heading out. The warm temperature combined with rain makes it feel quite tropical. Stay dry! 🌧️"

---

## 👥 Step 4: Multi-Agent System

### Create Specialized Agents

Create `multi_agent_system.py`:

```python
# multi_agent_system.py
from google.adk.agents import Agent
from google.adk.tools import google_search

# 1. Greeting Specialist Agent
greeting_agent = Agent(
    name="greeter",
    model="gemini-2.0-flash-exp",
    instruction="""You are a professional greeting specialist.
    
    Your ONLY job is to:
    1. Provide warm, professional greetings
    2. Welcome users and make them feel comfortable
    3. Briefly explain what services are available
    4. Keep greetings concise but friendly
    
    Do NOT handle other requests - only greetings.""",
    description="Handles initial greetings and welcomes users"
)

# 2. Research Specialist Agent  
research_agent = Agent(
    name="researcher",
    model="gemini-2.0-flash-exp",
    instruction="""You are a research specialist.
    
    Your expertise includes:
    1. Finding accurate, up-to-date information
    2. Summarizing complex topics clearly
    3. Providing credible sources
    4. Organizing information logically
    
    Always cite sources and be thorough in your research.""",
    description="Conducts research and finds information on various topics",
    tools=[google_search]
)

# 3. Analysis Specialist Agent
analysis_agent = Agent(
    name="analyzer", 
    model="gemini-2.0-flash-exp",
    instruction="""You are an analysis specialist.
    
    Your skills include:
    1. Breaking down complex information
    2. Identifying patterns and trends
    3. Providing insights and recommendations
    4. Creating clear, actionable summaries
    
    Focus on practical, useful analysis.""",
    description="Analyzes data and provides insights and recommendations"
)

# 4. Coordinator Agent (Root Agent)
coordinator_agent = Agent(
    name="coordinator",
    model="gemini-2.0-flash-exp", 
    instruction="""You are the main coordinator agent.
    
    Your responsibilities:
    1. Route user requests to the appropriate specialist
    2. Coordinate between multiple agents when needed
    3. Provide final responses combining specialist outputs
    4. Handle general questions that don't need specialists
    
    Available specialists:
    - Greeter: For welcoming users and initial interactions
    - Researcher: For finding information and conducting research
    - Analyzer: For analyzing data and providing insights
    
    Delegate appropriately and ensure users get comprehensive help.""",
    description="Main coordinator that routes requests to specialized agents",
    sub_agents=[greeting_agent, research_agent, analysis_agent]
)

def demonstrate_multi_agent():
    """Demonstrate the multi-agent system."""
    print("👥 Multi-Agent System created!")
    print(f"Coordinator: {coordinator_agent.name}")
    print(f"Sub-agents: {[agent.name for agent in coordinator_agent.sub_agents]}")
    
    # Show delegation structure
    print("\n🔄 Agent Delegation Structure:")
    print("User → Coordinator → Appropriate Specialist")
    print("├── Greeting requests → Greeter")
    print("├── Research requests → Researcher")  
    print("├── Analysis requests → Analyzer")
    print("└── General requests → Coordinator handles directly")

if __name__ == "__main__":
    demonstrate_multi_agent()
```

### Test Multi-Agent System

```bash
# Test the system
python multi_agent_system.py

# Launch web interface
adk web multi_agent_system.py
```

### Example Multi-Agent Interactions

**Scenario 1: Greeting**
- **User:** "Hi there!"
- **System:** *Routes to greeting_agent*
- **Greeter:** "Hello! Welcome to our AI assistant service! I'm here to help you get started. We have specialists for research, analysis, and general assistance. How can we help you today? 😊"

**Scenario 2: Research Request**  
- **User:** "Can you research the latest developments in renewable energy?"
- **System:** *Routes to research_agent*
- **Researcher:** *Uses google_search tool* "I've found the latest information on renewable energy developments. Here are the key findings from recent sources..."

**Scenario 3: Analysis Request**
- **User:** "Can you analyze the pros and cons of solar vs wind energy?"
- **System:** *Routes to analysis_agent*
- **Analyzer:** "I'll analyze the comparative advantages and disadvantages of solar versus wind energy across multiple dimensions..."

---

## 🔧 Step 5: Advanced Features

### Adding Streaming Support

```python
# streaming_agent.py
from google.adk.agents import Agent
from google.adk.streaming import StreamingConfig

# Create agent with streaming capabilities
streaming_agent = Agent(
    name="streaming_assistant",
    model="gemini-2.0-flash-exp",
    instruction="You are a streaming assistant that provides real-time responses",
    description="Assistant with streaming capabilities",
    streaming=StreamingConfig(
        audio=True,      # Enable audio streaming
        video=False,     # Disable video streaming
        text=True        # Enable text streaming
    )
)
```

### Adding Memory and State

```python
# stateful_agent.py
from google.adk.agents import Agent
from google.adk.memory import ConversationMemory

# Agent with conversation memory
stateful_agent = Agent(
    name="memory_assistant",
    model="gemini-2.0-flash-exp",
    instruction="""You are an assistant with excellent memory.
    
    Remember:
    1. User preferences and past conversations
    2. Context from previous interactions  
    3. User's goals and interests
    4. Any personal details they share
    
    Use this memory to provide personalized assistance.""",
    description="Assistant that remembers conversation context",
    memory=ConversationMemory(max_history=50)
)
```

### Custom Configuration

```python
# advanced_agent.py
from google.adk.agents import Agent
from google.adk.config import AgentConfig

# Advanced agent configuration
config = AgentConfig(
    temperature=0.7,        # Creativity level
    max_tokens=1000,        # Response length limit
    top_p=0.9,             # Nucleus sampling
    frequency_penalty=0.1,  # Reduce repetition
    presence_penalty=0.1,   # Encourage topic diversity
    timeout=30,            # Response timeout
    retry_attempts=3       # Error retry limit
)

advanced_agent = Agent(
    name="advanced_assistant",
    model="gemini-2.0-flash-exp", 
    instruction="You are an advanced AI assistant with optimized parameters",
    description="Advanced assistant with custom configuration",
    config=config
)
```

---

## 🧪 Step 6: Testing Your Agents

### Unit Testing

Create `test_agents.py`:

```python
# test_agents.py
import pytest
from echo_agent import echo_agent
from weather_agent import weather_agent, get_weather
from multi_agent_system import coordinator_agent

def test_echo_agent_creation():
    """Test echo agent is created properly."""
    assert echo_agent.name == "echo_assistant"
    assert echo_agent.model == "gemini-2.0-flash-exp"
    print("✅ Echo agent test passed")

def test_weather_tool():
    """Test weather tool functionality."""
    result = get_weather("New York")
    assert result["status"] == "success"
    assert "New York" in result["message"]
    
    # Test unknown location
    result = get_weather("Unknown City")
    assert result["status"] == "error"
    print("✅ Weather tool test passed")

def test_multi_agent_structure():
    """Test multi-agent system structure."""
    assert len(coordinator_agent.sub_agents) == 3
    agent_names = [agent.name for agent in coordinator_agent.sub_agents]
    assert "greeter" in agent_names
    assert "researcher" in agent_names  
    assert "analyzer" in agent_names
    print("✅ Multi-agent structure test passed")

if __name__ == "__main__":
    test_echo_agent_creation()
    test_weather_tool()
    test_multi_agent_structure()
    print("🎉 All tests passed!")
```

### Run Tests

```bash
# Run tests
python test_agents.py

# Or use pytest for more advanced testing
pip install pytest
pytest test_agents.py -v
```

---

## 📊 Step 7: Evaluation and Monitoring

### Create Evaluation Cases

Create `evaluation/test_cases.json`:

```json
{
  "test_cases": [
    {
      "id": "echo_test_1",
      "agent": "echo_assistant", 
      "input": "Hello world!",
      "expected_keywords": ["hello", "world", "enthusiasm"],
      "description": "Test basic echo functionality"
    },
    {
      "id": "weather_test_1",
      "agent": "weather_assistant",
      "input": "What's the weather in New York?",
      "expected_keywords": ["New York", "temperature", "sunny"],
      "description": "Test weather retrieval"
    },
    {
      "id": "greeting_delegation_test",
      "agent": "coordinator",
      "input": "Hi there!",
      "expected_keywords": ["welcome", "greeting", "help"],
      "description": "Test greeting delegation"
    }
  ]
}
```

### Run Evaluation

```python
# evaluate_agents.py
from google.adk.evaluation import AgentEvaluator
from echo_agent import echo_agent
from weather_agent import weather_agent
from multi_agent_system import coordinator_agent

def run_evaluation():
    """Run comprehensive agent evaluation."""
    evaluator = AgentEvaluator()
    
    # Evaluate each agent
    agents = [
        ("echo", echo_agent),
        ("weather", weather_agent), 
        ("coordinator", coordinator_agent)
    ]
    
    results = {}
    for name, agent in agents:
        print(f"📊 Evaluating {name} agent...")
        result = evaluator.evaluate(
            agent=agent,
            test_file="evaluation/test_cases.json",
            metrics=["response_quality", "tool_usage", "delegation_accuracy"]
        )
        results[name] = result
        print(f"✅ {name} evaluation complete: {result.score:.2f}/10")
    
    return results

if __name__ == "__main__":
    results = run_evaluation()
    print(f"\n🎯 Overall Results: {results}")
```

---

## 🚀 Step 8: Deployment

### Local Development Server

```bash
# Start development server
adk web multi_agent_system.py --host 0.0.0.0 --port 8080

# With debug mode
adk web multi_agent_system.py --debug --reload
```

### Container Deployment

Create `Dockerfile`:

```dockerfile
FROM python:3.10-slim

# Install ADK
RUN pip install google-adk

# Copy agent files
COPY *.py /app/
COPY evaluation/ /app/evaluation/

WORKDIR /app

# Set environment
ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}

# Expose port
EXPOSE 8080

# Run agent
CMD ["adk", "web", "multi_agent_system.py", "--host", "0.0.0.0"]
```

```bash
# Build and run container
docker build -t my-agent-system .
docker run -p 8080:8080 -e GOOGLE_API_KEY=your_key my-agent-system
```

---

## 🎯 What You've Learned

Congratulations! You've successfully built:

✅ **Simple Agent** - Basic agent creation and interaction  
✅ **Tool Integration** - Custom tools and function calling  
✅ **Multi-Agent System** - Agent coordination and delegation  
✅ **Testing** - Unit tests and evaluation frameworks  
✅ **Deployment** - Local and containerized deployment  

### Key Concepts Mastered

1. **Agent Creation** - Using `Agent` class with instructions and descriptions
2. **Tool Integration** - Adding custom functions as agent tools
3. **Multi-Agent Coordination** - Using sub_agents for delegation
4. **Agent Communication** - How agents route requests automatically
5. **Testing & Evaluation** - Ensuring agent quality and reliability

---

## 🚀 Next Steps

### Immediate Next Steps

1. **[Core Concepts](core-concepts.md)** - Deep dive into ADK fundamentals
2. **[Agent Types](agent-types.md)** - Explore Sequential, Parallel, Loop agents
3. **[Built-in Tools](../03-tools/built-in-tools.md)** - Discover pre-built tools
4. **[Multi-Agent Patterns](../02-agents/multi-agent-systems.md)** - Advanced architectures

### Project Ideas

- **Customer Service Bot** - Multi-agent system for support
- **Research Assistant** - Coordinated research and analysis
- **Code Assistant** - Programming help with multiple specialists
- **Content Creator** - Writing, editing, and publishing workflow

### Advanced Features to Explore

- **Streaming Interfaces** - Real-time audio/video interaction
- **Custom Models** - Using different LLMs for specialized tasks
- **Cloud Deployment** - Scaling with Google Cloud
- **Integration** - Connecting with existing systems

---

## 🆘 Troubleshooting

### Common Issues

**Agent not responding:**
```bash
# Check API key
echo $GOOGLE_API_KEY

# Test connection
python -c "from google.adk import Client; print(Client().models.list())"
```

**Tool not found:**
```python
# Debug tool registration
print(f"Agent tools: {[tool.__name__ for tool in agent.tools]}")
```

**Web interface not loading:**
```bash
# Check port availability
lsof -i :8080

# Try different port
adk web agent.py --port 8090
```

### Get Help

- **Documentation**: [ADK Docs](https://google.github.io/adk-docs/)
- **Community**: [GitHub Discussions](https://github.com/google/adk-python/discussions)
- **Issues**: [Report Bugs](https://github.com/google/adk-python/issues)

---

> **🎉 Congratulations!** You've built your first Google ADK agents. Ready to create something amazing with Autoflow? Let's keep building! 🚀 