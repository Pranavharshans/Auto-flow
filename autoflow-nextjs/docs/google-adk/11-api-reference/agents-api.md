# 🔧 Agents API - Google ADK

> **Complete API reference for creating and managing AI agents**

## 🎯 Overview

The Agents API provides comprehensive functionality for creating, configuring, and managing AI agents in Google ADK. This reference covers all classes, methods, and parameters.

---

## 🤖 Agent Class

### Constructor

```python
class Agent:
    def __init__(
        self,
        name: str,
        model: str = "gemini-2.0-flash-exp",
        instruction: str = "",
        tools: List[Tool] = None,
        memory: Memory = None,
        config: Dict = None
    ):
        """
        Create a new AI agent.
        
        Args:
            name (str): Unique identifier for the agent
            model (str): LLM model to use (default: "gemini-2.0-flash-exp")
            instruction (str): System instruction defining agent behavior
            tools (List[Tool]): Available tools for the agent
            memory (Memory): Memory system for conversation context
            config (Dict): Additional configuration options
        
        Raises:
            ValueError: If name is empty or invalid
            ConfigurationError: If model is not supported
        """
```

### Core Methods

#### process()
```python
async def process(
    self,
    input_data: Union[str, Dict],
    context: Dict = None,
    stream: bool = False,
    max_tokens: int = None
) -> AgentResponse:
    """
    Process user input and generate response.
    
    Args:
        input_data: User input (text or structured data)
        context: Additional context for processing
        stream: Enable streaming responses
        max_tokens: Maximum tokens in response
        
    Returns:
        AgentResponse: Structured response object
        
    Example:
        response = await agent.process("Hello, how are you?")
        print(response.text)
    """
```

#### add_tool()
```python
def add_tool(self, tool: Tool) -> None:
    """
    Add a tool to the agent's toolkit.
    
    Args:
        tool (Tool): Tool instance to add
        
    Raises:
        DuplicateToolError: If tool name already exists
    """
```

#### remove_tool()
```python
def remove_tool(self, tool_name: str) -> bool:
    """
    Remove a tool from the agent's toolkit.
    
    Args:
        tool_name (str): Name of tool to remove
        
    Returns:
        bool: True if tool was removed, False if not found
    """
```

### Configuration Methods

#### update_instruction()
```python
def update_instruction(self, instruction: str) -> None:
    """
    Update the agent's system instruction.
    
    Args:
        instruction (str): New system instruction
    """
```

#### set_memory()
```python
def set_memory(self, memory: Memory) -> None:
    """
    Set or update the agent's memory system.
    
    Args:
        memory (Memory): Memory instance to use
    """
```

---

## 📋 AgentResponse Class

```python
class AgentResponse:
    """Response object returned by agent processing."""
    
    text: str                    # Generated text response
    confidence: float            # Confidence score (0.0-1.0)
    tokens_used: int            # Number of tokens consumed
    tools_used: List[str]       # Tools invoked during processing
    execution_time: float       # Processing time in seconds
    metadata: Dict              # Additional response metadata
    
    def to_dict(self) -> Dict:
        """Convert response to dictionary format."""
    
    def to_json(self) -> str:
        """Convert response to JSON string."""
```

---

## 🧠 Memory Classes

### ConversationMemory

```python
class ConversationMemory:
    def __init__(
        self,
        max_messages: int = 50,
        summarization_threshold: int = 40,
        auto_summarize: bool = True
    ):
        """
        Conversation-based memory system.
        
        Args:
            max_messages: Maximum messages to retain
            summarization_threshold: When to trigger summarization
            auto_summarize: Enable automatic summarization
        """
    
    async def add_message(
        self,
        role: str,
        content: str,
        metadata: Dict = None
    ) -> None:
        """Add message to conversation history."""
    
    async def get_context(self, limit: int = None) -> List[Dict]:
        """Retrieve conversation context."""
    
    async def clear(self) -> None:
        """Clear conversation history."""
```

### VectorMemory

```python
class VectorMemory:
    def __init__(
        self,
        embedding_model: str = "text-embedding-004",
        similarity_threshold: float = 0.8,
        max_entries: int = 1000
    ):
        """
        Vector-based semantic memory system.
        
        Args:
            embedding_model: Model for generating embeddings
            similarity_threshold: Minimum similarity for retrieval
            max_entries: Maximum memory entries
        """
    
    async def store(
        self,
        content: str,
        metadata: Dict = None
    ) -> str:
        """Store content in vector memory."""
    
    async def search(
        self,
        query: str,
        limit: int = 5
    ) -> List[Dict]:
        """Search for similar content."""
```

---

## 🛠️ Tool Integration

### Tool Base Class

```python
class Tool:
    def __init__(
        self,
        name: str,
        description: str,
        parameters: Dict = None
    ):
        """
        Base class for agent tools.
        
        Args:
            name: Unique tool identifier
            description: Tool functionality description
            parameters: JSON schema for tool parameters
        """
    
    async def execute(
        self,
        parameters: Dict,
        context: Dict = None
    ) -> ToolResult:
        """Execute tool with given parameters."""
    
    def get_schema(self) -> Dict:
        """Get tool's JSON schema for LLM integration."""
```

### Built-in Tools

#### SearchTool
```python
from google.adk.tools import SearchTool

search_tool = SearchTool(
    provider="google",
    api_key="your-api-key",
    safe_search=True,
    max_results=10
)

# Usage in agent
agent = Agent(
    name="research_agent",
    tools=[search_tool]
)
```

#### DatabaseTool
```python
from google.adk.tools import DatabaseTool

db_tool = DatabaseTool(
    connection_string="postgresql://...",
    allowed_operations=["SELECT", "INSERT", "UPDATE"],
    security_level="strict"
)
```

---

## 🔄 Agent Orchestration

### SequentialWorkflow

```python
class SequentialWorkflow:
    def __init__(
        self,
        agents: List[Agent],
        data_flow: str = "chain"
    ):
        """
        Sequential agent workflow executor.
        
        Args:
            agents: List of agents to execute in order
            data_flow: How data flows between agents
        """
    
    async def execute(
        self,
        input_data: Any,
        context: Dict = None
    ) -> WorkflowResult:
        """Execute workflow with input data."""
```

### ParallelWorkflow

```python
class ParallelWorkflow:
    def __init__(
        self,
        agents: List[Agent],
        aggregation_strategy: str = "consensus"
    ):
        """
        Parallel agent workflow executor.
        
        Args:
            agents: List of agents to execute in parallel
            aggregation_strategy: How to combine results
        """
    
    async def execute(
        self,
        input_data: Any,
        context: Dict = None
    ) -> WorkflowResult:
        """Execute agents in parallel."""
```

---

## 📊 Configuration Options

### Agent Configuration

```python
agent_config = {
    "model": {
        "name": "gemini-2.0-flash-exp",
        "temperature": 0.7,
        "max_tokens": 2048,
        "top_p": 0.9,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0
    },
    "behavior": {
        "response_format": "text",
        "safety_level": "strict",
        "fact_checking": True,
        "citation_style": "academic"
    },
    "performance": {
        "timeout": 30,
        "retry_attempts": 3,
        "cache_enabled": True,
        "parallel_tools": True
    },
    "monitoring": {
        "log_level": "INFO",
        "metrics_enabled": True,
        "trace_requests": True
    }
}

agent = Agent(
    name="configured_agent",
    config=agent_config
)
```

---

## 🔧 Advanced Features

### Custom Agent Classes

```python
class CustomAgent(Agent):
    def __init__(self, specialized_config: Dict):
        super().__init__(
            name="custom_agent",
            instruction=self.build_instruction(specialized_config)
        )
        self.specialized_config = specialized_config
    
    def build_instruction(self, config: Dict) -> str:
        """Build specialized instruction from config."""
        return f"You are a {config['role']} specialist..."
    
    async def pre_process(self, input_data: str) -> str:
        """Custom preprocessing logic."""
        return input_data.upper()
    
    async def post_process(self, response: AgentResponse) -> AgentResponse:
        """Custom postprocessing logic."""
        response.text = response.text.strip()
        return response
```

### Event Handlers

```python
from google.adk.events import EventHandler

class AgentEventHandler(EventHandler):
    async def on_agent_start(self, agent: Agent, input_data: Any):
        """Called when agent processing starts."""
        print(f"Agent {agent.name} starting...")
    
    async def on_agent_complete(
        self,
        agent: Agent,
        response: AgentResponse
    ):
        """Called when agent processing completes."""
        print(f"Agent {agent.name} completed in {response.execution_time}s")
    
    async def on_tool_execute(
        self,
        tool: Tool,
        parameters: Dict,
        result: ToolResult
    ):
        """Called when a tool is executed."""
        print(f"Tool {tool.name} executed successfully")

# Register event handler
agent.add_event_handler(AgentEventHandler())
```

---

## 🚀 Performance Optimization

### Caching

```python
from google.adk.cache import ResponseCache

# Enable response caching
cache = ResponseCache(
    backend="redis",
    ttl=3600,  # 1 hour
    key_strategy="content_hash"
)

agent = Agent(
    name="cached_agent",
    config={"cache": cache}
)
```

### Batch Processing

```python
async def batch_process(
    agent: Agent,
    inputs: List[str],
    batch_size: int = 10
) -> List[AgentResponse]:
    """Process multiple inputs in batches."""
    
    responses = []
    for i in range(0, len(inputs), batch_size):
        batch = inputs[i:i + batch_size]
        batch_responses = await asyncio.gather(*[
            agent.process(input_text) for input_text in batch
        ])
        responses.extend(batch_responses)
    
    return responses
```

---

## 🔍 Error Handling

### Exception Classes

```python
class AgentError(Exception):
    """Base exception for agent-related errors."""

class ConfigurationError(AgentError):
    """Raised when agent configuration is invalid."""

class ProcessingError(AgentError):
    """Raised when agent processing fails."""

class ToolExecutionError(AgentError):
    """Raised when tool execution fails."""

class MemoryError(AgentError):
    """Raised when memory operations fail."""
```

### Error Handling Example

```python
try:
    response = await agent.process("Hello, world!")
except ProcessingError as e:
    print(f"Processing failed: {e}")
    # Implement fallback logic
except ToolExecutionError as e:
    print(f"Tool execution failed: {e}")
    # Handle tool errors
except Exception as e:
    print(f"Unexpected error: {e}")
    # Handle unexpected errors
```

---

## ✅ Best Practices

### 1. **Agent Design**
- Clear, specific instructions
- Appropriate tool selection
- Proper memory configuration
- Error handling implementation

### 2. **Performance**
- Use caching for repeated requests
- Implement batch processing for multiple inputs
- Monitor token usage and costs
- Optimize tool execution order

### 3. **Security**
- Validate all inputs
- Implement proper authentication
- Use secure tool configurations
- Log security events

### 4. **Monitoring**
- Track agent performance metrics
- Monitor tool usage patterns
- Log errors and exceptions
- Implement health checks

---

> **📚 Next Steps**: Explore the [Tools API](tools-api.md) for detailed tool integration reference! 