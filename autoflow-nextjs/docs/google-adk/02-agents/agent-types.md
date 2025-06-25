# 🤖 Agent Types - Google ADK

> **Master all agent types available in Google ADK for different use cases**

## 🎯 Overview

Google ADK provides several specialized agent types, each optimized for different patterns of AI interaction and workflow orchestration. Understanding when and how to use each type is crucial for building effective multi-agent systems.

---

## 1. 🧠 LLM Agent (Basic Agent)

The foundational agent type powered by large language models.

### When to Use
- Single-purpose conversational agents
- Decision-making with natural language
- Content generation and analysis
- User interaction and support

### Basic Implementation
```python
from google.adk.agents import Agent

customer_support = Agent(
    name="customer_support",
    model="gemini-2.0-flash-exp",
    instruction="""You are a helpful customer support agent.
    
    Your responsibilities:
    1. Answer customer questions politely and accurately
    2. Provide product information and guidance
    3. Escalate complex issues when needed
    4. Maintain a friendly, professional tone
    
    Always ask clarifying questions if needed.""",
    description="Handles customer inquiries and support requests",
    tools=[knowledge_base_search, ticket_creation]
)
```

### Advanced Configuration
```python
from google.adk.config import AgentConfig

advanced_agent = Agent(
    name="research_analyst",
    model="gemini-2.0-flash-exp",
    instruction="Conduct thorough research and provide detailed analysis",
    config=AgentConfig(
        temperature=0.3,        # Lower for more focused responses
        max_tokens=2000,        # Longer responses for detailed analysis
        top_p=0.9,
        frequency_penalty=0.1,
        presence_penalty=0.1
    )
)
```

---

## 2. 🔄 Sequential Agent

Executes agents in a specific order, passing output from one to the next.

### When to Use
- Multi-step processes with dependencies
- Data processing pipelines
- Document workflows
- Progressive refinement tasks

### Implementation
```python
from google.adk.agents import SequentialAgent

# Document processing pipeline
document_processor = SequentialAgent([
    # Step 1: Extract text from document
    Agent(
        name="text_extractor",
        model="gemini-2.0-flash-exp",
        instruction="Extract and clean text from the provided document",
        tools=[pdf_reader, ocr_tool]
    ),
    
    # Step 2: Analyze content structure
    Agent(
        name="structure_analyzer", 
        model="gemini-2.0-flash-exp",
        instruction="Analyze document structure and identify key sections"
    ),
    
    # Step 3: Generate summary
    Agent(
        name="summarizer",
        model="gemini-2.0-flash-exp",
        instruction="Create a comprehensive summary of the analyzed document"
    ),
    
    # Step 4: Format output
    Agent(
        name="formatter",
        model="gemini-2.0-flash-exp", 
        instruction="Format the summary into a structured report",
        tools=[template_engine]
    )
])

# Usage
result = document_processor.process("Please process this contract document.")
```

### Error Handling in Sequential Workflows
```python
sequential_agent = SequentialAgent(
    agents=[agent1, agent2, agent3],
    error_handling="continue",  # Options: "stop", "continue", "retry"
    max_retries=3,
    timeout=60  # seconds
)
```

---

## 3. ⚡ Parallel Agent

Executes multiple agents simultaneously and combines their results.

### When to Use
- Independent parallel tasks
- Data analysis from multiple sources
- Content generation with different perspectives
- Performance optimization for concurrent workloads

### Implementation
```python
from google.adk.agents import ParallelAgent

# Market analysis from multiple perspectives
market_analyzer = ParallelAgent([
    # Technical analysis
    Agent(
        name="technical_analyst",
        model="gemini-2.0-flash-exp",
        instruction="Perform technical analysis on market data",
        tools=[chart_analyzer, indicator_calculator]
    ),
    
    # Fundamental analysis
    Agent(
        name="fundamental_analyst",
        model="gemini-2.0-flash-exp",
        instruction="Analyze company fundamentals and financials",
        tools=[financial_data_api, news_aggregator]
    ),
    
    # Sentiment analysis
    Agent(
        name="sentiment_analyst",
        model="gemini-2.0-flash-exp",
        instruction="Analyze market sentiment from news and social media",
        tools=[social_media_api, sentiment_analyzer]
    ),
    
    # Risk assessment
    Agent(
        name="risk_analyst",
        model="gemini-2.0-flash-exp",
        instruction="Assess investment risks and volatility",
        tools=[risk_calculator, volatility_analyzer]
    )
])

# All agents run simultaneously
analysis_result = market_analyzer.process("Analyze AAPL stock for investment decision")
```

### Result Aggregation
```python
class CustomParallelAgent(ParallelAgent):
    def aggregate_results(self, results: List[AgentResult]) -> str:
        """Custom logic to combine parallel agent results."""
        technical = results[0].output
        fundamental = results[1].output
        sentiment = results[2].output
        risk = results[3].output
        
        return f"""
        Comprehensive Market Analysis:
        
        Technical Analysis: {technical}
        
        Fundamental Analysis: {fundamental}
        
        Sentiment Analysis: {sentiment}
        
        Risk Assessment: {risk}
        
        Recommendation: {self.generate_recommendation(results)}
        """
```

---

## 4. 🔁 Loop Agent

Repeats agent execution until a condition is met or maximum iterations reached.

### When to Use
- Iterative refinement processes
- Batch processing with queues
- Monitoring and polling tasks
- Conversational loops with context

### Implementation
```python
from google.adk.agents import LoopAgent

# Iterative code reviewer
code_reviewer = LoopAgent(
    agent=Agent(
        name="code_critic",
        model="gemini-2.0-flash-exp",
        instruction="""Review the provided code and suggest improvements.
        
        If the code is satisfactory, respond with "APPROVED".
        Otherwise, provide specific suggestions for improvement.""",
        tools=[static_analyzer, security_scanner]
    ),
    condition=lambda result: "APPROVED" in result.output.upper(),
    max_iterations=5,
    timeout=300  # 5 minutes total
)

# Keep reviewing until approved or max iterations
final_review = code_reviewer.process("Please review this Python function: ...")
```

### Batch Processing Example
```python
from google.adk.state import SharedState

# Process queue of documents
batch_processor = LoopAgent(
    agent=Agent(
        name="document_processor",
        model="gemini-2.0-flash-exp",
        instruction="Process the next document in the queue",
        tools=[document_parser, database_updater]
    ),
    condition=lambda state: len(state.shared_state.get("pending_docs", [])) == 0,
    max_iterations=1000,
    shared_state=SharedState({"pending_docs": document_queue})
)
```

---

## 5. 🎨 Custom Agent

Create specialized agents with custom behavior and logic.

### When to Use
- Unique business logic requirements
- Complex decision trees
- Integration with legacy systems
- Specialized processing workflows

### Implementation
```python
from google.adk.agents import CustomAgent
from typing import Any, Dict

class TradingAgent(CustomAgent):
    def __init__(self, portfolio_manager, risk_tolerance="medium"):
        super().__init__(
            name="trading_bot",
            model="gemini-2.0-flash-exp"
        )
        self.portfolio_manager = portfolio_manager
        self.risk_tolerance = risk_tolerance
        self.trading_rules = self.load_trading_rules()
    
    def process(self, market_data: Dict[str, Any]) -> str:
        """Custom trading logic."""
        
        # 1. Analyze market conditions
        market_analysis = self.analyze_market(market_data)
        
        # 2. Check portfolio balance
        portfolio_status = self.portfolio_manager.get_status()
        
        # 3. Apply trading rules
        trading_decision = self.apply_trading_rules(
            market_analysis, 
            portfolio_status
        )
        
        # 4. Execute if conditions are met
        if trading_decision.should_trade:
            execution_result = self.execute_trade(trading_decision)
            return f"Trade executed: {execution_result}"
        else:
            return f"No trade: {trading_decision.reason}"
    
    def analyze_market(self, data):
        """Use LLM for market analysis."""
        prompt = f"Analyze market conditions: {data}"
        return self.llm_call(prompt)
    
    def apply_trading_rules(self, analysis, portfolio):
        """Apply custom business logic."""
        # Custom decision logic here
        pass
```

### State Machine Agent
```python
class WorkflowAgent(CustomAgent):
    def __init__(self):
        super().__init__(name="workflow_manager", model="gemini-2.0-flash-exp")
        self.state = "IDLE"
        self.transitions = {
            "IDLE": ["PROCESSING"],
            "PROCESSING": ["REVIEW", "ERROR"],
            "REVIEW": ["APPROVED", "REJECTED"],
            "APPROVED": ["COMPLETE"],
            "REJECTED": ["PROCESSING"],
            "ERROR": ["PROCESSING", "FAILED"],
            "COMPLETE": ["IDLE"],
            "FAILED": ["IDLE"]
        }
    
    def process(self, input_data):
        """State-based processing."""
        if self.state == "IDLE":
            return self.start_processing(input_data)
        elif self.state == "PROCESSING":
            return self.continue_processing(input_data)
        elif self.state == "REVIEW":
            return self.review_output(input_data)
        # ... handle other states
    
    def transition_to(self, new_state):
        """Safe state transitions."""
        if new_state in self.transitions.get(self.state, []):
            self.state = new_state
        else:
            raise ValueError(f"Invalid transition from {self.state} to {new_state}")
```

---

## 6. 🌊 Streaming Agent

Provides real-time streaming responses and interactions.

### When to Use
- Real-time chat interfaces
- Live content generation
- Progressive processing display
- Interactive applications

### Implementation
```python
from google.adk.streaming import StreamingAgent

# Text streaming
text_streamer = StreamingAgent(
    base_agent=Agent(
        name="storyteller",
        model="gemini-2.0-flash-exp",
        instruction="Tell engaging stories with rich details"
    ),
    stream_config={
        "text": True,
        "chunk_size": 50,
        "delay": 0.1
    }
)

# Usage with async
async def stream_story():
    async for chunk in text_streamer.stream("Tell me a story about AI"):
        print(chunk.text, end='', flush=True)
        await asyncio.sleep(chunk.delay)
```

### Multi-modal Streaming
```python
from google.adk.streaming import MultiModalStreamingAgent

voice_assistant = MultiModalStreamingAgent(
    base_agent=base_agent,
    stream_config={
        "audio": {
            "input": True,
            "output": True,
            "format": "wav",
            "sample_rate": 16000
        },
        "video": {
            "input": True,
            "output": False
        },
        "text": {
            "output": True,
            "chunk_size": 30
        }
    }
)
```

---

## 🎯 Agent Selection Guide

### Decision Matrix

| Use Case | Best Agent Type | Why |
|----------|----------------|-----|
| Simple Q&A | LLM Agent | Direct conversation, no complex workflow |
| Document Processing | Sequential Agent | Step-by-step pipeline with dependencies |
| Market Analysis | Parallel Agent | Multiple independent analyses |
| Code Review | Loop Agent | Iterative refinement until quality met |
| Trading Bot | Custom Agent | Complex business logic and state |
| Chat Interface | Streaming Agent | Real-time user interaction |
| Content Moderation | Sequential + Parallel | Parallel analysis, sequential decision |
| Customer Service | Custom + Sub-agents | Complex routing with specialized helpers |

### Performance Considerations

#### Memory Usage
```python
# Memory-efficient agent configuration
efficient_agent = Agent(
    name="efficient_processor",
    model="gemini-2.0-flash-exp",
    config=AgentConfig(
        max_tokens=500,        # Limit response size
        timeout=15,            # Quick timeout
        batch_size=1           # Process one at a time
    ),
    memory=ConversationMemory(
        max_history=10,        # Limited history
        summarize_old=True     # Compress old conversations
    )
)
```

#### Scaling Patterns
```python
# Horizontal scaling with parallel agents
scaled_processor = ParallelAgent([
    create_worker_agent(f"worker_{i}") 
    for i in range(cpu_count())
])

# Vertical scaling with batching
batch_agent = Agent(
    name="batch_processor",
    model="gemini-2.0-flash-exp",
    config=AgentConfig(batch_size=10)  # Process 10 items at once
)
```

---

## 🔧 Advanced Patterns

### Hybrid Agent Systems
```python
# Combine multiple agent types
class HybridWorkflow:
    def __init__(self):
        # Parallel analysis
        self.analyzer = ParallelAgent([
            sentiment_agent,
            entity_agent,
            classification_agent
        ])
        
        # Sequential processing
        self.processor = SequentialAgent([
            self.analyzer,
            synthesis_agent,
            output_formatter
        ])
        
        # Loop for quality control
        self.quality_controller = LoopAgent(
            agent=quality_checker,
            condition=lambda r: r.quality_score > 0.8,
            max_iterations=3
        )
    
    def process(self, input_data):
        processed = self.processor.process(input_data)
        return self.quality_controller.process(processed)
```

### Agent Composition
```python
# Compose agents for complex workflows
def create_content_pipeline():
    return SequentialAgent([
        # Research phase (parallel)
        ParallelAgent([
            research_agent,
            fact_checker,
            source_validator
        ]),
        
        # Writing phase (sequential)
        SequentialAgent([
            outline_creator,
            content_writer,
            editor
        ]),
        
        # Quality assurance (loop)
        LoopAgent(
            agent=quality_reviewer,
            condition=lambda r: "APPROVED" in r.output,
            max_iterations=3
        )
    ])
```

---

## ✅ Best Practices

### 1. **Choose the Right Type**
- Start with LLM Agent for simple cases
- Use Sequential for step-by-step processes
- Use Parallel for independent concurrent tasks
- Use Loop for iterative refinement
- Use Custom for complex business logic

### 2. **Error Handling**
```python
# Robust error handling
resilient_agent = Agent(
    name="resilient_processor",
    model="gemini-2.0-flash-exp",
    config=AgentConfig(
        retry_attempts=3,
        timeout=30,
        fallback_model="gemini-2.0-flash"  # Fallback if primary fails
    )
)
```

### 3. **Performance Optimization**
```python
# Optimize for your use case
fast_agent = Agent(
    name="speed_demon",
    model="gemini-2.0-flash-exp",  # Fastest model
    config=AgentConfig(
        temperature=0.1,    # Less randomness = faster
        max_tokens=200,     # Shorter responses = faster
        top_p=0.9          # Focused sampling = faster
    )
)
```

### 4. **Monitoring and Logging**
```python
from google.adk.monitoring import AgentMonitor

monitored_agent = Agent(
    name="production_agent",
    model="gemini-2.0-flash-exp",
    monitors=[
        AgentMonitor(
            metrics=["response_time", "error_rate", "token_usage"],
            alerts=["error_rate > 0.1", "response_time > 10"]
        )
    ]
)
```

---

> **🎯 Next Steps**: Now that you understand all agent types, explore [Multi-Agent Systems](multi-agent-systems.md) to learn how to coordinate them effectively! 