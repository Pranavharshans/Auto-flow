# 🧠 Core Concepts - Google Agent Development Kit (ADK)

> **Master the fundamental concepts that power sophisticated multi-agent systems**

## 🎯 Overview

Google ADK is built on a foundation of well-defined concepts that enable the creation of complex, production-ready AI agent systems. Understanding these core concepts is essential for leveraging ADK's full potential in your Autoflow project.

---

## 🤖 1. Agents - The Core Building Blocks

### What is an Agent?

An **Agent** in ADK is an autonomous unit that can:
- Understand natural language instructions
- Make decisions based on context
- Use tools to accomplish tasks
- Communicate with other agents
- Maintain state across interactions

### Agent Anatomy

```python
agent = Agent(
    name="customer_service",           # Unique identifier
    model="gemini-2.0-flash-exp",     # LLM backbone
    instruction="You are a helpful...", # Behavior definition
    description="Handles customer...",  # Purpose description (for delegation)
    tools=[search_tool, email_tool],   # Available capabilities
    sub_agents=[escalation_agent],     # Specialized helpers
    memory=ConversationMemory(),       # State management
    config=AgentConfig()               # Advanced settings
)
```

### Agent Types & Hierarchy

```
Agent Types
├── LlmAgent (AI-powered reasoning)
├── SequentialAgent (Step-by-step workflows)
├── ParallelAgent (Concurrent execution)
├── LoopAgent (Iterative processing)
└── CustomAgent (Specialized behavior)
```

---

## 🔧 2. Tools - Agent Capabilities

### Tool Concept

Tools extend agent capabilities beyond language understanding. They're the "hands" and "senses" of your agents.

### Tool Categories

#### A. Function Tools (Custom)
```python
def calculate_tax(amount: float, rate: float) -> float:
    """Calculate tax for a given amount and rate.
    
    Args:
        amount: The amount to calculate tax for
        rate: Tax rate as decimal (e.g., 0.08 for 8%)
    
    Returns:
        Tax amount
    """
    return amount * rate

# Agent automatically understands when to use this tool
tax_agent = Agent(
    name="tax_calculator",
    model="gemini-2.0-flash-exp",
    instruction="Help users calculate taxes accurately",
    tools=[calculate_tax]
)
```

#### B. Built-in Tools
```python
from google.adk.tools import google_search, code_exec, web_scraper

research_agent = Agent(
    name="researcher",
    model="gemini-2.0-flash-exp",
    instruction="Research topics using reliable sources",
    tools=[google_search, web_scraper]
)
```

#### C. MCP (Model Context Protocol) Tools
```python
from google.adk.tools.mcp import load_mcp_tool

# Load community-built tools
calculator = load_mcp_tool("calculator")
file_manager = load_mcp_tool("file_manager")

utility_agent = Agent(
    name="utility_helper",
    model="gemini-2.0-flash-exp",
    instruction="Help with calculations and file management",
    tools=[calculator, file_manager]
)
```

### Tool Integration Patterns

#### 1. **Single-Purpose Tools**
```python
def send_email(to: str, subject: str, body: str) -> dict:
    """Send an email to specified recipient."""
    # Implementation
    return {"status": "sent", "message_id": "12345"}
```

#### 2. **Multi-Function Tools**
```python
class DatabaseTool:
    def query(self, sql: str) -> list:
        """Execute SQL query."""
        pass
    
    def insert(self, table: str, data: dict) -> str:
        """Insert data into table."""
        pass
    
    def update(self, table: str, id: str, data: dict) -> bool:
        """Update record in table."""
        pass
```

#### 3. **Stateful Tools**
```python
class ShoppingCartTool:
    def __init__(self):
        self.items = []
    
    def add_item(self, product_id: str, quantity: int):
        """Add item to cart."""
        self.items.append({"product_id": product_id, "quantity": quantity})
    
    def get_total(self) -> float:
        """Calculate cart total."""
        # Implementation
        pass
```

---

## 🌐 3. Multi-Agent Orchestration

### Delegation Patterns

#### A. **Hierarchical Delegation**
```python
# CEO → Department Heads → Specialists
ceo_agent = Agent(
    name="ceo",
    instruction="Coordinate company operations",
    sub_agents=[
        sales_manager,
        engineering_manager,
        support_manager
    ]
)

sales_manager = Agent(
    name="sales_manager", 
    instruction="Handle sales-related tasks",
    sub_agents=[
        lead_qualifier,
        deal_closer,
        customer_onboarder
    ]
)
```

#### B. **Peer-to-Peer Collaboration**
```python
# Research Team: each agent has different expertise
research_team = [
    Agent(name="data_collector", instruction="Gather data from sources"),
    Agent(name="data_analyzer", instruction="Analyze collected data"),
    Agent(name="report_writer", instruction="Write comprehensive reports")
]

coordinator = Agent(
    name="research_coordinator",
    instruction="Coordinate research team activities",
    sub_agents=research_team
)
```

### Communication Patterns

#### 1. **Auto-Delegation** (Default)
```python
# ADK automatically routes based on descriptions
main_agent = Agent(
    name="main",
    description="General purpose assistant",
    sub_agents=[
        Agent(name="weather", description="Weather information"),
        Agent(name="calendar", description="Schedule management")
    ]
)

# User: "What's the weather?" → Auto-routes to weather agent
# User: "Schedule a meeting" → Auto-routes to calendar agent
```

#### 2. **Explicit Routing**
```python
class RouterAgent(CustomAgent):
    def process(self, message: str) -> str:
        if "weather" in message.lower():
            return self.delegate_to("weather_agent", message)
        elif "schedule" in message.lower():
            return self.delegate_to("calendar_agent", message)
        else:
            return self.handle_general_query(message)
```

#### 3. **Workflow-Based**
```python
# Sequential workflow: each agent processes in order
workflow = SequentialAgent([
    document_parser,    # Step 1: Parse uploaded document
    content_analyzer,   # Step 2: Analyze content
    summary_generator,  # Step 3: Generate summary
    formatter          # Step 4: Format output
])
```

---

## 🔄 4. Workflow Orchestration

### Sequential Workflows

Perfect for step-by-step processes with dependencies:

```python
data_pipeline = SequentialAgent([
    data_extractor,     # Extract data from source
    data_cleaner,       # Clean and validate data
    data_transformer,   # Transform to target format
    data_loader        # Load into destination
])

# Each agent waits for the previous one to complete
# Output of agent N becomes input of agent N+1
```

### Parallel Workflows

Ideal for independent, concurrent tasks:

```python
content_processor = ParallelAgent([
    image_analyzer,     # Analyze images
    text_processor,     # Process text content  
    metadata_extractor, # Extract metadata
    sentiment_analyzer  # Analyze sentiment
])

# All agents run simultaneously
# Results are collected and combined
```

### Loop Workflows

Great for iterative processing:

```python
batch_processor = LoopAgent(
    agent=document_processor,
    condition=lambda state: len(state.pending_documents) > 0,
    max_iterations=1000
)

# Processes documents until queue is empty
# Each iteration handles one document
```

### Conditional Workflows

Dynamic routing based on conditions:

```python
class ConditionalRouter(CustomAgent):
    def process(self, input_data):
        if input_data.priority == "high":
            return self.delegate_to("urgent_handler", input_data)
        elif input_data.type == "complaint":
            return self.delegate_to("complaint_specialist", input_data)
        else:
            return self.delegate_to("general_handler", input_data)
```

---

## 💾 5. State Management & Memory

### Conversation Memory

Enables agents to remember context across interactions:

```python
from google.adk.memory import ConversationMemory

chatbot = Agent(
    name="personal_assistant",
    model="gemini-2.0-flash-exp",
    instruction="Remember user preferences and past conversations",
    memory=ConversationMemory(
        max_history=100,        # Remember last 100 interactions
        summarize_old=True,     # Summarize older conversations
        persist=True            # Save to disk
    )
)

# Agent remembers:
# - User's name and preferences
# - Previous questions and answers
# - Ongoing tasks and context
```

### Shared State

Multiple agents sharing information:

```python
from google.adk.state import SharedState

# Shared state across agent team
team_state = SharedState({
    "current_project": "website_redesign",
    "deadline": "2024-03-15",
    "team_members": ["alice", "bob", "charlie"]
})

designer = Agent(
    name="designer",
    instruction="Create designs for the current project",
    shared_state=team_state
)

developer = Agent(
    name="developer", 
    instruction="Implement designs for the current project",
    shared_state=team_state
)
```

### Persistent Storage

Long-term data storage:

```python
from google.adk.storage import DatabaseStorage

customer_service = Agent(
    name="customer_service",
    instruction="Help customers with their questions",
    storage=DatabaseStorage(
        type="postgresql",
        connection_string="postgresql://user:pass@host:5432/db"
    )
)

# Agent can:
# - Store customer interaction history
# - Look up previous tickets
# - Track resolution patterns
```

---

## 🚦 6. Event System & Callbacks

### Event-Driven Architecture

Agents can react to events and trigger actions:

```python
from google.adk.events import EventHandler

class OrderEventHandler(EventHandler):
    def on_order_created(self, order_data):
        # Automatically send confirmation email
        self.email_agent.send_confirmation(order_data)
        
        # Update inventory
        self.inventory_agent.reserve_items(order_data.items)
        
        # Schedule delivery
        self.logistics_agent.schedule_delivery(order_data)

order_processor = Agent(
    name="order_processor",
    instruction="Process customer orders",
    event_handlers=[OrderEventHandler()]
)
```

### Lifecycle Callbacks

Hook into agent execution phases:

```python
from google.adk.callbacks import Callback

class MonitoringCallback(Callback):
    def on_start(self, agent_name: str):
        print(f"Agent {agent_name} started")
        
    def on_tool_call(self, tool_name: str, args: dict):
        print(f"Tool {tool_name} called with {args}")
        
    def on_error(self, error: Exception):
        print(f"Error occurred: {error}")
        # Send alert, log to monitoring system
        
    def on_complete(self, agent_name: str, result: str):
        print(f"Agent {agent_name} completed with result")

monitored_agent = Agent(
    name="production_agent",
    instruction="Handle production tasks",
    callbacks=[MonitoringCallback()]
)
```

---

## 🔒 7. Configuration & Customization

### Agent Configuration

Fine-tune agent behavior:

```python
from google.adk.config import AgentConfig

config = AgentConfig(
    # Generation parameters
    temperature=0.7,           # Creativity (0.0-2.0)
    max_tokens=1000,          # Response length limit
    top_p=0.9,                # Nucleus sampling
    top_k=50,                 # Top-k sampling
    
    # Behavior controls
    frequency_penalty=0.1,     # Reduce repetition
    presence_penalty=0.1,      # Encourage topic diversity
    
    # Performance settings
    timeout=30,               # Response timeout (seconds)
    retry_attempts=3,         # Error retry limit
    batch_size=10,            # Parallel processing batch size
    
    # Safety settings
    safety_level="strict",    # Content filtering
    max_tool_calls=5,         # Tool call limit per turn
)

precise_agent = Agent(
    name="analyst",
    model="gemini-2.0-flash-exp",
    instruction="Provide precise, analytical responses",
    config=config
)
```

### Runtime Configuration

Dynamic behavior adjustment:

```python
# Change behavior based on context
if user.is_premium:
    agent.config.max_tokens = 2000
    agent.config.temperature = 0.8
else:
    agent.config.max_tokens = 500
    agent.config.temperature = 0.3

# Time-based configuration
if current_time.hour < 9 or current_time.hour > 17:
    agent.config.response_mode = "brief"
else:
    agent.config.response_mode = "detailed"
```

---

## 🌊 8. Streaming & Real-time Interaction

### Text Streaming

Real-time response generation:

```python
from google.adk.streaming import StreamingAgent

streaming_assistant = StreamingAgent(
    base_agent=base_agent,
    stream_config={
        "text": True,
        "chunk_size": 50,      # Characters per chunk
        "delay": 0.1           # Seconds between chunks
    }
)

# Stream responses as they're generated
async for chunk in streaming_assistant.stream_response("Tell me a story"):
    print(chunk.text, end='', flush=True)
```

### Audio/Video Streaming

Multi-modal real-time interaction:

```python
from google.adk.streaming import MultiModalStreamingAgent

voice_assistant = MultiModalStreamingAgent(
    base_agent=base_agent,
    stream_config={
        "audio": {
            "input": True,        # Accept audio input
            "output": True,       # Generate audio output
            "format": "wav",
            "sample_rate": 16000
        },
        "video": {
            "input": True,        # Accept video input
            "output": False       # No video output
        }
    }
)
```

---

## 📊 9. Evaluation & Testing

### Built-in Evaluation

Systematic quality assessment:

```python
from google.adk.evaluation import AgentEvaluator

evaluator = AgentEvaluator()

# Define test cases
test_cases = [
    {
        "input": "What's the weather in Tokyo?",
        "expected_keywords": ["tokyo", "weather", "temperature"],
        "expected_tool_calls": ["get_weather"]
    },
    {
        "input": "Schedule a meeting for tomorrow",
        "expected_keywords": ["schedule", "meeting", "tomorrow"],
        "expected_tool_calls": ["create_calendar_event"]
    }
]

# Run evaluation
results = evaluator.evaluate(
    agent=my_agent,
    test_cases=test_cases,
    metrics=["response_quality", "tool_usage", "response_time"]
)

print(f"Overall score: {results.overall_score}")
print(f"Response quality: {results.response_quality}")
print(f"Tool usage accuracy: {results.tool_usage}")
```

### Custom Evaluation Metrics

Define domain-specific quality measures:

```python
from google.adk.evaluation import CustomMetric

class CustomerSatisfactionMetric(CustomMetric):
    def evaluate(self, input_text: str, output_text: str, expected: dict) -> float:
        # Custom logic to measure customer satisfaction
        sentiment_score = self.analyze_sentiment(output_text)
        helpfulness_score = self.measure_helpfulness(output_text, expected)
        politeness_score = self.measure_politeness(output_text)
        
        return (sentiment_score + helpfulness_score + politeness_score) / 3

# Use in evaluation
results = evaluator.evaluate(
    agent=customer_service_agent,
    test_cases=test_cases,
    custom_metrics=[CustomerSatisfactionMetric()]
)
```

---

## 🎯 10. Best Practices & Patterns

### Agent Design Principles

#### 1. **Single Responsibility**
```python
# Good: Focused responsibility
weather_agent = Agent(
    name="weather_specialist",
    instruction="Provide accurate weather information only"
)

# Avoid: Too many responsibilities
general_agent = Agent(
    name="everything_agent", 
    instruction="Handle weather, calendar, email, shopping, and cooking"
)
```

#### 2. **Clear Descriptions**
```python
# Good: Clear, specific description
email_agent = Agent(
    name="email_manager",
    description="Composes, sends, and manages email communications"
)

# Avoid: Vague description
helper_agent = Agent(
    name="helper",
    description="Helps with stuff"
)
```

#### 3. **Appropriate Tool Selection**
```python
# Good: Relevant tools only
calculator_agent = Agent(
    name="math_helper",
    instruction="Help with mathematical calculations",
    tools=[calculate, plot_graph, solve_equation]
)

# Avoid: Irrelevant tools
math_agent = Agent(
    name="math_helper", 
    instruction="Help with mathematical calculations",
    tools=[calculate, send_email, book_flight]  # email/flight tools irrelevant
)
```

### Error Handling Patterns

#### 1. **Graceful Degradation**
```python
def robust_weather_tool(location: str) -> dict:
    try:
        # Try primary weather API
        return primary_weather_api.get_weather(location)
    except APIError:
        try:
            # Fallback to secondary API
            return secondary_weather_api.get_weather(location)
        except APIError:
            # Final fallback to cached data
            return get_cached_weather(location)
```

#### 2. **Error Recovery**
```python
class ResilientAgent(Agent):
    def handle_error(self, error: Exception, context: dict) -> str:
        if isinstance(error, ToolTimeoutError):
            return "I'm experiencing some delays. Let me try a different approach."
        elif isinstance(error, APIRateLimitError):
            return "I need to wait a moment before trying again. Please hold on."
        else:
            return "I encountered an issue. Let me contact a human assistant for you."
```

### Performance Optimization

#### 1. **Efficient Tool Design**
```python
# Good: Efficient tool with caching
@lru_cache(maxsize=100)
def get_stock_price(symbol: str) -> float:
    """Get stock price with caching."""
    return api.get_current_price(symbol)

# Good: Batch operations
def get_multiple_stock_prices(symbols: list) -> dict:
    """Get multiple stock prices in one API call."""
    return api.get_batch_prices(symbols)
```

#### 2. **Smart Delegation**
```python
# Route based on complexity
class SmartRouter(CustomAgent):
    def route_query(self, query: str) -> str:
        complexity = self.assess_complexity(query)
        
        if complexity == "simple":
            return self.delegate_to("fast_agent", query)
        elif complexity == "medium":
            return self.delegate_to("standard_agent", query)
        else:
            return self.delegate_to("expert_agent", query)
```

---

## 🚀 Putting It All Together

### Complete Example: Customer Service System

```python
from google.adk.agents import Agent, SequentialAgent
from google.adk.tools import database_tool, email_tool
from google.adk.memory import ConversationMemory
from google.adk.config import AgentConfig

# 1. Specialized agents
ticket_classifier = Agent(
    name="classifier",
    model="gemini-2.0-flash-exp",
    instruction="Classify customer tickets by type and urgency",
    description="Analyzes and categorizes customer service requests"
)

knowledge_searcher = Agent(
    name="knowledge_base",
    model="gemini-2.0-flash-exp", 
    instruction="Search knowledge base for solutions",
    description="Finds relevant information from company knowledge base",
    tools=[database_tool]
)

response_generator = Agent(
    name="responder",
    model="gemini-2.0-flash-exp",
    instruction="Generate helpful, empathetic customer responses",
    description="Creates personalized responses to customer inquiries",
    memory=ConversationMemory(max_history=20)
)

escalation_handler = Agent(
    name="escalation",
    model="gemini-2.0-flash-exp",
    instruction="Handle complex issues requiring human intervention",
    description="Manages escalation to human agents",
    tools=[email_tool]
)

# 2. Main coordinator
customer_service_system = Agent(
    name="customer_service",
    model="gemini-2.0-flash-exp",
    instruction="""You are a customer service coordinator.
    
    Process customer inquiries by:
    1. Understanding the customer's issue
    2. Classifying the type and urgency 
    3. Searching for relevant solutions
    4. Generating appropriate responses
    5. Escalating when necessary
    
    Always be helpful, empathetic, and professional.""",
    description="Main customer service coordination system",
    sub_agents=[
        ticket_classifier,
        knowledge_searcher, 
        response_generator,
        escalation_handler
    ],
    config=AgentConfig(
        temperature=0.7,
        max_tokens=500,
        timeout=15
    )
)

# 3. Usage
response = customer_service_system.process(
    "I've been charged twice for my order #12345. Can you help me get a refund?"
)
```

This system demonstrates:
- **Multi-agent coordination** (classifier → searcher → responder)
- **Tool integration** (database and email tools)
- **Memory management** (conversation history)
- **Error handling** (escalation path)
- **Configuration** (optimized for customer service)

---

## ✅ Next Steps

Now that you understand ADK's core concepts:

1. **Practice**: Build the examples in the [Quick Start Guide](quickstart.md)
2. **Explore**: Try different [Agent Types](agent-types.md)
3. **Experiment**: Create custom tools and workflows
4. **Integrate**: Apply concepts to your Autoflow project

> **🎯 Remember**: Start simple, then gradually add complexity. Each concept builds on the others to create powerful, sophisticated agent systems! 