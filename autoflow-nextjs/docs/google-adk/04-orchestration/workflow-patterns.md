# 🔄 Workflow Patterns - Google ADK

> **Master advanced workflow orchestration patterns for complex multi-agent systems**

## 🎯 Overview

Workflow orchestration is the art of coordinating multiple agents, tools, and processes to achieve complex business objectives. Google ADK provides sophisticated patterns and primitives for building scalable, reliable, and maintainable agent workflows.

---

## 🏗️ Core Orchestration Patterns

### 1. 📋 Sequential Workflow Pattern

Execute agents in a predetermined order with data flowing from one stage to the next.

```python
from google.adk.orchestration import SequentialWorkflow, WorkflowStep
from google.adk.agents import Agent

# Document processing pipeline
document_workflow = SequentialWorkflow([
    WorkflowStep(
        name="extract",
        agent=Agent(
            name="text_extractor",
            model="gemini-2.0-flash-exp",
            instruction="Extract text from documents",
            tools=[pdf_reader, ocr_tool]
        ),
        inputs=["document"],
        outputs=["raw_text"]
    ),
    
    WorkflowStep(
        name="clean",
        agent=Agent(
            name="text_cleaner",
            model="gemini-2.0-flash-exp",
            instruction="Clean and normalize extracted text"
        ),
        inputs=["raw_text"],
        outputs=["clean_text"],
        depends_on=["extract"]
    ),
    
    WorkflowStep(
        name="analyze",
        agent=Agent(
            name="content_analyzer",
            model="gemini-2.0-flash-exp",
            instruction="Analyze document content and extract insights"
        ),
        inputs=["clean_text"],
        outputs=["analysis"],
        depends_on=["clean"]
    ),
    
    WorkflowStep(
        name="summarize",
        agent=Agent(
            name="summarizer",
            model="gemini-2.0-flash-exp",
            instruction="Create comprehensive document summary"
        ),
        inputs=["clean_text", "analysis"],
        outputs=["summary"],
        depends_on=["analyze"]
    )
])

# Execute workflow
result = document_workflow.execute({
    "document": "path/to/document.pdf"
})
```

#### Sequential Pattern Features
- **Ordered Execution**: Guaranteed execution order
- **Data Flow**: Automatic data passing between steps
- **Dependency Management**: Clear step dependencies
- **Error Propagation**: Failures stop the workflow
- **Result Aggregation**: Collect outputs from all steps

#### Use Cases
- Document processing pipelines
- Data transformation workflows
- Multi-stage approval processes
- Content generation workflows
- Quality assurance chains

---

### 2. ⚡ Parallel Workflow Pattern

Execute multiple agents simultaneously for independent tasks.

```python
from google.adk.orchestration import ParallelWorkflow, ParallelGroup

# Market analysis workflow
market_analysis_workflow = ParallelWorkflow([
    ParallelGroup([
        WorkflowStep(
            name="technical_analysis",
            agent=technical_analyst,
            inputs=["stock_symbol", "timeframe"],
            outputs=["technical_signals"]
        ),
        
        WorkflowStep(
            name="fundamental_analysis", 
            agent=fundamental_analyst,
            inputs=["stock_symbol", "financial_data"],
            outputs=["fundamental_metrics"]
        ),
        
        WorkflowStep(
            name="sentiment_analysis",
            agent=sentiment_analyst,
            inputs=["stock_symbol", "news_data"],
            outputs=["market_sentiment"]
        ),
        
        WorkflowStep(
            name="risk_assessment",
            agent=risk_analyst,
            inputs=["stock_symbol", "portfolio_data"],
            outputs=["risk_metrics"]
        )
    ]),
    
    # Synthesis step after parallel analysis
    WorkflowStep(
        name="synthesis",
        agent=synthesis_agent,
        inputs=["technical_signals", "fundamental_metrics", "market_sentiment", "risk_metrics"],
        outputs=["investment_recommendation"],
        depends_on=["technical_analysis", "fundamental_analysis", "sentiment_analysis", "risk_assessment"]
    )
])

# Execute with automatic parallelization
result = market_analysis_workflow.execute({
    "stock_symbol": "AAPL",
    "timeframe": "1M",
    "financial_data": financial_data,
    "news_data": news_data,
    "portfolio_data": portfolio_data
})
```

#### Parallel Pattern Features
- **Concurrent Execution**: Maximum performance through parallelism
- **Resource Optimization**: Efficient resource utilization
- **Independent Processing**: No dependencies between parallel tasks
- **Result Synchronization**: Wait for all parallel tasks to complete
- **Fault Isolation**: Failures in one branch don't affect others

#### Use Cases
- Multi-source data analysis
- Content generation from different perspectives
- Independent validation processes
- Batch processing workflows
- Comparison and benchmarking tasks

---

### 3. 🔄 Loop Workflow Pattern

Repeat workflow sections until conditions are met or limits reached.

```python
from google.adk.orchestration import LoopWorkflow, LoopCondition

# Iterative code improvement workflow
code_improvement_workflow = LoopWorkflow(
    workflow=SequentialWorkflow([
        WorkflowStep(
            name="code_review",
            agent=code_reviewer,
            inputs=["code"],
            outputs=["review_comments", "quality_score"]
        ),
        
        WorkflowStep(
            name="code_improvement",
            agent=code_improver,
            inputs=["code", "review_comments"],
            outputs=["improved_code"],
            condition="quality_score < 8.0"  # Only improve if quality is low
        )
    ]),
    
    loop_condition=LoopCondition(
        expression="quality_score >= 8.0 OR iteration >= 5",
        variables=["quality_score", "iteration"]
    ),
    
    max_iterations=5,
    timeout=300  # 5 minutes total
)

# Keep improving until quality threshold is met
result = code_improvement_workflow.execute({
    "code": initial_code
})
```

#### Advanced Loop Patterns

```python
# Dynamic loop with state management
class DynamicLoopWorkflow(LoopWorkflow):
    def __init__(self):
        super().__init__(
            workflow=self.create_dynamic_workflow(),
            loop_condition=self.create_dynamic_condition(),
            state_manager=WorkflowStateManager()
        )
    
    def create_dynamic_workflow(self):
        return SequentialWorkflow([
            WorkflowStep(
                name="analyze_queue",
                agent=queue_analyzer,
                inputs=["task_queue"],
                outputs=["priority_tasks", "queue_status"]
            ),
            
            WorkflowStep(
                name="process_batch",
                agent=batch_processor,
                inputs=["priority_tasks"],
                outputs=["processed_results", "remaining_tasks"]
            ),
            
            WorkflowStep(
                name="update_queue",
                agent=queue_updater,
                inputs=["remaining_tasks", "processed_results"],
                outputs=["updated_queue"]
            )
        ])
    
    def create_dynamic_condition(self):
        return LoopCondition(
            expression="len(updated_queue) == 0 OR processing_time > max_time",
            variables=["updated_queue", "processing_time", "max_time"]
        )
```

#### Loop Pattern Features
- **Conditional Execution**: Continue based on dynamic conditions
- **State Persistence**: Maintain state across iterations
- **Progress Tracking**: Monitor iteration progress
- **Timeout Protection**: Prevent infinite loops
- **Early Termination**: Exit when conditions are met

#### Use Cases
- Iterative refinement processes
- Queue processing workflows
- Convergence algorithms
- Monitoring and polling tasks
- Progressive data processing

---

### 4. 🌳 Conditional Workflow Pattern

Branch workflow execution based on runtime conditions.

```python
from google.adk.orchestration import ConditionalWorkflow, Condition, Branch

# Customer service routing workflow
customer_service_workflow = ConditionalWorkflow([
    # Initial triage
    WorkflowStep(
        name="triage",
        agent=triage_agent,
        inputs=["customer_message", "customer_history"],
        outputs=["urgency_level", "issue_category", "complexity_score"]
    ),
    
    # Conditional branching based on triage results
    Branch(
        condition=Condition("urgency_level == 'critical'"),
        workflow=SequentialWorkflow([
            WorkflowStep(
                name="escalate_immediately",
                agent=escalation_agent,
                inputs=["customer_message", "customer_history"],
                outputs=["escalation_ticket"]
            ),
            
            WorkflowStep(
                name="notify_manager",
                agent=notification_agent,
                inputs=["escalation_ticket"],
                outputs=["notification_sent"]
            )
        ])
    ),
    
    Branch(
        condition=Condition("issue_category == 'technical' AND complexity_score > 7"),
        workflow=SequentialWorkflow([
            WorkflowStep(
                name="technical_diagnosis",
                agent=technical_support_agent,
                inputs=["customer_message", "system_logs"],
                outputs=["diagnosis", "solution_steps"]
            ),
            
            WorkflowStep(
                name="create_technical_response",
                agent=technical_response_agent,
                inputs=["diagnosis", "solution_steps"],
                outputs=["technical_response"]
            )
        ])
    ),
    
    # Default branch for standard inquiries
    Branch(
        condition=Condition("True"),  # Default catch-all
        workflow=SequentialWorkflow([
            WorkflowStep(
                name="knowledge_base_search",
                agent=kb_search_agent,
                inputs=["customer_message"],
                outputs=["relevant_articles"]
            ),
            
            WorkflowStep(
                name="generate_response",
                agent=response_agent,
                inputs=["customer_message", "relevant_articles"],
                outputs=["customer_response"]
            )
        ])
    )
])
```

#### Advanced Conditional Patterns

```python
# Multi-criteria decision workflow
class SmartRoutingWorkflow(ConditionalWorkflow):
    def __init__(self):
        super().__init__([
            self.create_assessment_step(),
            self.create_routing_logic()
        ])
    
    def create_routing_logic(self):
        return MultiConditionalBranch([
            # High-value customer path
            Branch(
                condition=Condition("customer_tier == 'premium' AND issue_value > 1000"),
                workflow=self.create_premium_workflow()
            ),
            
            # Technical issue path
            Branch(
                condition=Condition("issue_type == 'technical' AND requires_specialist == True"),
                workflow=self.create_technical_workflow()
            ),
            
            # Billing issue path
            Branch(
                condition=Condition("issue_type == 'billing' AND amount_disputed > 100"),
                workflow=self.create_billing_workflow()
            ),
            
            # Standard support path
            Branch(
                condition=Condition("True"),
                workflow=self.create_standard_workflow()
            )
        ])
```

#### Conditional Pattern Features
- **Dynamic Routing**: Route based on runtime data
- **Multiple Conditions**: Complex conditional logic
- **Nested Workflows**: Workflows within conditions
- **Default Handling**: Fallback branches
- **Context Preservation**: Maintain context across branches

#### Use Cases
- Customer service routing
- Error handling workflows
- A/B testing workflows
- Dynamic content generation
- Approval and escalation processes

---

## 🏢 Enterprise Workflow Patterns

### 5. 🎭 Actor Model Pattern

Distribute workflow execution across independent actor agents.

```python
from google.adk.orchestration import ActorSystem, Actor, Message

# E-commerce order processing system
class OrderActor(Actor):
    def __init__(self):
        super().__init__(name="order_processor")
        self.state = "idle"
    
    async def receive(self, message: Message):
        if message.type == "process_order":
            return await self.process_order(message.data)
        elif message.type == "cancel_order":
            return await self.cancel_order(message.data)
    
    async def process_order(self, order_data):
        # Validate order
        validation_result = await self.send_message(
            "inventory_actor",
            Message("check_availability", order_data)
        )
        
        if validation_result.available:
            # Process payment
            payment_result = await self.send_message(
                "payment_actor",
                Message("process_payment", order_data)
            )
            
            if payment_result.success:
                # Fulfill order
                await self.send_message(
                    "fulfillment_actor",
                    Message("ship_order", order_data)
                )
                
                return {"status": "processed", "order_id": order_data["id"]}
        
        return {"status": "failed", "reason": "validation_failed"}

class InventoryActor(Actor):
    def __init__(self):
        super().__init__(name="inventory_manager")
        self.inventory = {}
    
    async def receive(self, message: Message):
        if message.type == "check_availability":
            return self.check_stock(message.data)
        elif message.type == "reserve_items":
            return self.reserve_stock(message.data)
    
    def check_stock(self, order_data):
        # Check if items are available
        for item in order_data["items"]:
            if self.inventory.get(item["id"], 0) < item["quantity"]:
                return {"available": False, "item": item["id"]}
        return {"available": True}

# Actor system setup
actor_system = ActorSystem([
    OrderActor(),
    InventoryActor(),
    PaymentActor(),
    FulfillmentActor(),
    NotificationActor()
])

# Process order through actor system
order_result = await actor_system.send_message(
    "order_processor",
    Message("process_order", order_data)
)
```

#### Actor Pattern Features
- **Isolation**: Each actor maintains its own state
- **Concurrency**: Actors process messages concurrently
- **Fault Tolerance**: Actor failures don't affect others
- **Scalability**: Easy horizontal scaling
- **Message Passing**: Asynchronous communication

#### Use Cases
- Microservices orchestration
- Real-time systems
- High-throughput processing
- Distributed workflows
- Event-driven architectures

---

### 6. 🏭 Pipeline Pattern

Process data through a series of transformation stages.

```python
from google.adk.orchestration import Pipeline, PipelineStage

# Data processing pipeline
class DataProcessingPipeline(Pipeline):
    def __init__(self):
        super().__init__([
            PipelineStage(
                name="ingestion",
                processor=DataIngestionAgent(),
                config={
                    "batch_size": 1000,
                    "timeout": 30,
                    "retry_attempts": 3
                }
            ),
            
            PipelineStage(
                name="validation",
                processor=DataValidationAgent(),
                config={
                    "strict_mode": True,
                    "error_threshold": 0.05
                }
            ),
            
            PipelineStage(
                name="transformation",
                processor=DataTransformationAgent(),
                config={
                    "parallel_workers": 4,
                    "chunk_size": 100
                }
            ),
            
            PipelineStage(
                name="enrichment",
                processor=DataEnrichmentAgent(),
                config={
                    "external_apis": ["geocoding", "demographics"],
                    "cache_enabled": True
                }
            ),
            
            PipelineStage(
                name="storage",
                processor=DataStorageAgent(),
                config={
                    "destination": "data_warehouse",
                    "compression": True,
                    "partition_by": "date"
                }
            )
        ])
    
    def create_monitoring_dashboard(self):
        return PipelineMonitor(
            metrics=["throughput", "latency", "error_rate"],
            alerts=["error_rate > 0.1", "latency > 30s"],
            dashboards=["real_time", "historical"]
        )

# Execute pipeline with monitoring
pipeline = DataProcessingPipeline()
monitor = pipeline.create_monitoring_dashboard()

# Process data stream
async for batch in data_stream:
    result = await pipeline.process_batch(batch)
    monitor.record_metrics(result)
```

#### Advanced Pipeline Patterns

```python
# Adaptive pipeline with dynamic scaling
class AdaptivePipeline(Pipeline):
    def __init__(self):
        super().__init__()
        self.load_balancer = PipelineLoadBalancer()
        self.auto_scaler = PipelineAutoScaler()
    
    async def process_batch(self, batch):
        # Monitor current load
        current_load = self.load_balancer.get_current_load()
        
        # Auto-scale if needed
        if current_load > 0.8:
            await self.auto_scaler.scale_up()
        elif current_load < 0.3:
            await self.auto_scaler.scale_down()
        
        # Route to least loaded workers
        worker = self.load_balancer.get_next_worker()
        return await worker.process(batch)
    
    def create_fault_tolerance(self):
        return FaultToleranceManager(
            strategies=["retry", "circuit_breaker", "bulkhead"],
            monitoring=["health_checks", "error_tracking"]
        )
```

#### Pipeline Pattern Features
- **Stream Processing**: Handle continuous data streams
- **Backpressure Handling**: Manage flow control
- **Error Recovery**: Robust error handling
- **Monitoring**: Real-time pipeline monitoring
- **Scalability**: Dynamic scaling capabilities

#### Use Cases
- ETL/ELT processes
- Real-time data processing
- Content processing workflows
- Machine learning pipelines
- Event stream processing

---

## 🔧 Advanced Orchestration Techniques

### 7. 📊 State Machine Workflows

Model complex business processes as state machines.

```python
from google.adk.orchestration import StateMachine, State, Transition

# Order fulfillment state machine
class OrderFulfillmentStateMachine(StateMachine):
    def __init__(self):
        super().__init__(
            initial_state="pending",
            states=[
                State("pending", self.handle_pending),
                State("validated", self.handle_validated),
                State("processing", self.handle_processing),
                State("shipped", self.handle_shipped),
                State("delivered", self.handle_delivered),
                State("cancelled", self.handle_cancelled),
                State("failed", self.handle_failed)
            ],
            transitions=[
                Transition("pending", "validated", "validation_success"),
                Transition("pending", "cancelled", "validation_failed"),
                Transition("validated", "processing", "payment_success"),
                Transition("validated", "failed", "payment_failed"),
                Transition("processing", "shipped", "fulfillment_complete"),
                Transition("processing", "failed", "fulfillment_error"),
                Transition("shipped", "delivered", "delivery_confirmed"),
                Transition("any", "cancelled", "cancellation_requested")
            ]
        )
    
    async def handle_pending(self, context):
        """Handle pending order state."""
        validation_agent = Agent(
            name="order_validator",
            model="gemini-2.0-flash-exp",
            instruction="Validate order details and inventory"
        )
        
        result = await validation_agent.process(context.order_data)
        
        if result.valid:
            return self.trigger_transition("validation_success", context)
        else:
            return self.trigger_transition("validation_failed", context)
    
    async def handle_processing(self, context):
        """Handle order processing state."""
        fulfillment_workflow = ParallelWorkflow([
            WorkflowStep("inventory_reservation", inventory_agent),
            WorkflowStep("payment_processing", payment_agent),
            WorkflowStep("shipping_preparation", shipping_agent)
        ])
        
        result = await fulfillment_workflow.execute(context.order_data)
        
        if result.success:
            return self.trigger_transition("fulfillment_complete", context)
        else:
            return self.trigger_transition("fulfillment_error", context)

# Usage
order_fsm = OrderFulfillmentStateMachine()
final_state = await order_fsm.execute(OrderContext(order_data))
```

#### State Machine Features
- **Clear State Management**: Explicit state definitions
- **Transition Control**: Controlled state transitions
- **Event Handling**: React to external events
- **Persistence**: Save and restore state
- **Visualization**: Visual state machine diagrams

#### Use Cases
- Order processing workflows
- Approval workflows
- Game logic
- Protocol implementations
- Complex business processes

---

### 8. 🎪 Event-Driven Workflows

React to events and orchestrate workflows dynamically.

```python
from google.adk.orchestration import EventDrivenWorkflow, EventHandler, Event

class CustomerJourneyOrchestrator(EventDrivenWorkflow):
    def __init__(self):
        super().__init__()
        self.register_event_handlers()
    
    def register_event_handlers(self):
        # User registration event
        self.add_handler(
            EventHandler(
                event_type="user_registered",
                workflow=self.create_onboarding_workflow(),
                priority=1
            )
        )
        
        # Purchase event
        self.add_handler(
            EventHandler(
                event_type="purchase_completed",
                workflow=self.create_purchase_workflow(),
                priority=2
            )
        )
        
        # Support ticket event
        self.add_handler(
            EventHandler(
                event_type="support_ticket_created",
                workflow=self.create_support_workflow(),
                priority=3
            )
        )
    
    def create_onboarding_workflow(self):
        return SequentialWorkflow([
            WorkflowStep(
                name="send_welcome_email",
                agent=email_agent,
                inputs=["user_data"],
                outputs=["email_sent"]
            ),
            
            WorkflowStep(
                name="create_user_profile",
                agent=profile_agent,
                inputs=["user_data"],
                outputs=["profile_created"]
            ),
            
            WorkflowStep(
                name="setup_preferences",
                agent=preferences_agent,
                inputs=["user_data"],
                outputs=["preferences_set"]
            )
        ])
    
    def create_purchase_workflow(self):
        return ParallelWorkflow([
            WorkflowStep(
                name="send_receipt",
                agent=receipt_agent,
                inputs=["purchase_data"],
                outputs=["receipt_sent"]
            ),
            
            WorkflowStep(
                name="update_loyalty_points",
                agent=loyalty_agent,
                inputs=["purchase_data"],
                outputs=["points_updated"]
            ),
            
            WorkflowStep(
                name="recommend_products",
                agent=recommendation_agent,
                inputs=["purchase_data", "user_history"],
                outputs=["recommendations"]
            )
        ])

# Event processing
orchestrator = CustomerJourneyOrchestrator()

# Process events as they arrive
await orchestrator.handle_event(Event(
    type="user_registered",
    data={"user_id": "12345", "email": "user@example.com"},
    timestamp=datetime.now()
))
```

#### Event-Driven Features
- **Reactive Processing**: React to real-time events
- **Event Routing**: Smart event routing to workflows
- **Priority Handling**: Process high-priority events first
- **Event Persistence**: Store and replay events
- **Scalable Architecture**: Handle high event volumes

#### Use Cases
- Customer journey orchestration
- Real-time monitoring
- IoT event processing
- Microservices coordination
- Business process automation

---

## 📈 Performance & Monitoring

### Workflow Monitoring

```python
from google.adk.monitoring import WorkflowMonitor, MetricsCollector

class ProductionWorkflowMonitor:
    def __init__(self):
        self.metrics = MetricsCollector([
            "execution_time",
            "success_rate", 
            "error_rate",
            "throughput",
            "resource_usage"
        ])
        
        self.alerts = AlertManager([
            Alert("high_error_rate", "error_rate > 0.1"),
            Alert("slow_execution", "avg_execution_time > 30s"),
            Alert("low_throughput", "throughput < 100/min")
        ])
    
    def monitor_workflow(self, workflow):
        return MonitoredWorkflow(
            workflow=workflow,
            metrics_collector=self.metrics,
            alert_manager=self.alerts,
            dashboard=self.create_dashboard()
        )
    
    def create_dashboard(self):
        return Dashboard([
            Chart("execution_time", type="timeseries"),
            Chart("success_rate", type="gauge"),
            Chart("throughput", type="bar"),
            Table("recent_errors"),
            Map("geographic_distribution")
        ])
```

### Performance Optimization

```python
# Workflow optimization techniques
class OptimizedWorkflow:
    def __init__(self):
        self.cache = WorkflowCache()
        self.optimizer = WorkflowOptimizer()
        self.load_balancer = LoadBalancer()
    
    def optimize_execution(self, workflow):
        # Analyze workflow for optimization opportunities
        analysis = self.optimizer.analyze(workflow)
        
        # Apply optimizations
        if analysis.can_parallelize:
            workflow = self.optimizer.parallelize(workflow)
        
        if analysis.can_cache:
            workflow = self.optimizer.add_caching(workflow)
        
        if analysis.can_batch:
            workflow = self.optimizer.add_batching(workflow)
        
        return workflow
```

---

## ✅ Best Practices

### 1. **Design Principles**
- Keep workflows simple and focused
- Use appropriate patterns for the use case
- Plan for failure and recovery
- Monitor and measure performance
- Document workflow logic clearly

### 2. **Error Handling**
```python
# Robust error handling in workflows
class ResilientWorkflow:
    def __init__(self):
        self.error_handler = WorkflowErrorHandler(
            strategies=["retry", "fallback", "circuit_breaker"],
            retry_policy=ExponentialBackoff(max_attempts=3),
            fallback_workflow=create_fallback_workflow()
        )
```

### 3. **Testing Strategies**
```python
# Comprehensive workflow testing
class WorkflowTester:
    def test_workflow(self, workflow):
        # Unit tests for individual steps
        self.test_individual_steps(workflow)
        
        # Integration tests for workflow paths
        self.test_workflow_paths(workflow)
        
        # Performance tests
        self.test_performance(workflow)
        
        # Failure scenario tests
        self.test_failure_scenarios(workflow)
```

---

> **🎯 Next Steps**: Explore [Multi-Agent Systems](../02-agents/multi-agent-systems.md) to learn how to coordinate multiple agents in complex workflows!