# ☁️ Cloud Platforms - Google ADK

> **Deploy your AI agents to production cloud environments with confidence**

## 🎯 Overview

Google ADK agents can be deployed across multiple cloud platforms for maximum scalability, reliability, and performance. This guide covers deployment strategies, configurations, and best practices for major cloud providers.

---

## 🌐 Google Cloud Platform (GCP)

### 1. 🏃 Cloud Run Deployment

Deploy agents as serverless containers that scale automatically.

```python
# Dockerfile for ADK agent
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy agent code
COPY src/ ./src/
COPY config/ ./config/

# Set environment variables
ENV GOOGLE_ADK_PROJECT_ID=${PROJECT_ID}
ENV GOOGLE_ADK_LOCATION=${LOCATION}

# Expose port
EXPOSE 8080

# Run agent
CMD ["python", "src/main.py"]
```

```yaml
# clouddeploy.yaml
apiVersion: skaffold/v4beta6
kind: Config
metadata:
  name: adk-agent-deployment
build:
  artifacts:
  - image: gcr.io/PROJECT_ID/adk-agent
    docker:
      dockerfile: Dockerfile
deploy:
  cloudrun:
    region: us-central1
    projectid: PROJECT_ID
```

#### Cloud Run Configuration

```python
from google.adk.deployment import CloudRunDeployment

# Configure Cloud Run deployment
deployment = CloudRunDeployment(
    service_name="intelligent-agent",
    image="gcr.io/my-project/adk-agent:latest",
    region="us-central1",
    config={
        "cpu": "2",
        "memory": "2Gi",
        "min_instances": 0,
        "max_instances": 100,
        "concurrency": 10,
        "timeout": "300s",
        "env_vars": {
            "GEMINI_API_KEY": "${GEMINI_API_KEY}",
            "PROJECT_ID": "my-project"
        },
        "vpc_connector": "projects/my-project/locations/us-central1/connectors/vpc-connector"
    }
)

# Deploy to Cloud Run
deployment.deploy()
```

#### Auto-scaling Configuration

```python
# Advanced scaling configuration
scaling_config = {
    "min_instances": 1,           # Always warm
    "max_instances": 1000,        # High scale limit
    "target_concurrency": 80,     # Requests per instance
    "cpu_utilization": 70,        # CPU-based scaling
    "request_timeout": 60,        # Request timeout
    "startup_probe": {
        "path": "/health",
        "timeout": 10,
        "failure_threshold": 3
    }
}
```

---

### 2. 🎛️ Google Kubernetes Engine (GKE)

Deploy agents on managed Kubernetes for advanced orchestration.

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: adk-agent-deployment
  labels:
    app: adk-agent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: adk-agent
  template:
    metadata:
      labels:
        app: adk-agent
    spec:
      containers:
      - name: adk-agent
        image: gcr.io/PROJECT_ID/adk-agent:latest
        ports:
        - containerPort: 8080
        env:
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: gemini-api-key
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: adk-agent-service
spec:
  selector:
    app: adk-agent
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

#### Horizontal Pod Autoscaler

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: adk-agent-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: adk-agent-deployment
  minReplicas: 2
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

### 3. 🔧 Vertex AI Platform

Deploy agents directly on Google's AI platform.

```python
from google.adk.deployment import VertexAIDeployment
from google.cloud import aiplatform

# Initialize Vertex AI
aiplatform.init(
    project="my-project",
    location="us-central1"
)

# Deploy to Vertex AI
vertex_deployment = VertexAIDeployment(
    display_name="Production ADK Agent",
    agent_config={
        "model": "gemini-2.0-flash-exp",
        "tools": ["search", "code_exec", "database"],
        "memory_config": {
            "type": "conversation",
            "max_messages": 50
        }
    },
    machine_config={
        "machine_type": "n1-standard-4",
        "accelerator_type": "NVIDIA_TESLA_T4",
        "accelerator_count": 1,
        "disk_size_gb": 100
    },
    auto_scaling={
        "min_replica_count": 1,
        "max_replica_count": 10,
        "target_utilization": 70
    }
)

# Deploy
endpoint = vertex_deployment.deploy()
print(f"Deployed to endpoint: {endpoint.resource_name}")
```

#### Vertex AI Model Registry

```python
# Register agent as a model version
from google.adk.deployment import ModelRegistry

registry = ModelRegistry()

# Upload agent to registry
model_version = registry.upload_agent(
    agent=my_agent,
    model_name="customer-service-agent",
    version="v2.1.0",
    description="Enhanced customer service agent with improved NLU",
    metadata={
        "training_data": "customer_conversations_2024",
        "accuracy": 0.95,
        "response_time": "< 500ms"
    }
)

# Deploy from registry
registry.deploy_version(
    model_name="customer-service-agent",
    version="v2.1.0",
    traffic_split={"v2.0.0": 80, "v2.1.0": 20}  # Canary deployment
)
```

---

## ☁️ Amazon Web Services (AWS)

### 1. 🚀 AWS Lambda Deployment

Deploy lightweight agents as serverless functions.

```python
# lambda_function.py
import json
import os
from google.adk.agents import Agent
from google.adk.deployment import LambdaHandler

# Initialize agent
agent = Agent(
    name="lambda_agent",
    model="gemini-2.0-flash-exp",
    instruction="Handle user requests efficiently",
    tools=["search", "calculator"]
)

# Lambda handler
handler = LambdaHandler(agent)

def lambda_handler(event, context):
    """AWS Lambda entry point."""
    try:
        # Process request through ADK agent
        result = handler.process(event)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
```

```yaml
# serverless.yml
service: adk-agent-lambda

provider:
  name: aws
  runtime: python3.11
  region: us-east-1
  environment:
    GEMINI_API_KEY: ${env:GEMINI_API_KEY}
    AGENT_CONFIG: ${env:AGENT_CONFIG}
  iamRoleStatements:
    - Effect: Allow
      Action:
        - secretsmanager:GetSecretValue
      Resource: "arn:aws:secretsmanager:*:*:secret:*"

functions:
  agent:
    handler: lambda_function.lambda_handler
    timeout: 30
    memorySize: 1024
    events:
      - http:
          path: /agent
          method: post
          cors: true
      - http:
          path: /agent/{proxy+}
          method: any
          cors: true

plugins:
  - serverless-python-requirements
```

#### Lambda Layer for Dependencies

```yaml
# Create a layer for ADK dependencies
layers:
  adkDependencies:
    path: layer
    name: adk-dependencies
    description: Google ADK and dependencies
    compatibleRuntimes:
      - python3.11
    package:
      exclude:
        - ./**
      include:
        - layer/**
```

---

### 2. 🏗️ AWS ECS/Fargate

Deploy containerized agents with managed container orchestration.

```python
# ecs_deploy.py
from google.adk.deployment import ECSDeployment

# Configure ECS deployment
ecs_deployment = ECSDeployment(
    cluster_name="adk-agent-cluster",
    service_name="intelligent-agent-service",
    task_definition={
        "family": "adk-agent",
        "cpu": "512",
        "memory": "1024",
        "network_mode": "awsvpc",
        "requires_attributes": ["ecs.capability.execution-role-awslogs"],
        "execution_role_arn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
        "container_definitions": [{
            "name": "adk-agent",
            "image": "ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/adk-agent:latest",
            "port_mappings": [{"container_port": 8080, "protocol": "tcp"}],
            "environment": [
                {"name": "GEMINI_API_KEY", "value": "${GEMINI_API_KEY}"},
                {"name": "AWS_REGION", "value": "us-east-1"}
            ],
            "log_configuration": {
                "log_driver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/adk-agent",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }]
    },
    service_config={
        "desired_count": 2,
        "launch_type": "FARGATE",
        "platform_version": "LATEST",
        "network_configuration": {
            "awsvpc_configuration": {
                "subnets": ["subnet-12345", "subnet-67890"],
                "security_groups": ["sg-abcdef"],
                "assign_public_ip": "ENABLED"
            }
        },
        "load_balancers": [{
            "target_group_arn": "arn:aws:elasticloadbalancing:us-east-1:ACCOUNT:targetgroup/adk-agent-tg/1234567890123456",
            "container_name": "adk-agent",
            "container_port": 8080
        }]
    }
)

# Deploy to ECS
ecs_deployment.deploy()
```

---

### 3. 🔄 AWS Step Functions Integration

Orchestrate complex agent workflows with AWS Step Functions.

```json
{
  "Comment": "ADK Agent Workflow",
  "StartAt": "ProcessInput",
  "States": {
    "ProcessInput": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:input-processor",
      "Next": "RouteToAgent"
    },
    "RouteToAgent": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.requestType",
          "StringEquals": "customer_service",
          "Next": "CustomerServiceAgent"
        },
        {
          "Variable": "$.requestType",
          "StringEquals": "technical_support",
          "Next": "TechnicalSupportAgent"
        }
      ],
      "Default": "GeneralAgent"
    },
    "CustomerServiceAgent": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:customer-service-agent",
      "Next": "ProcessResponse"
    },
    "TechnicalSupportAgent": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:technical-support-agent",
      "Next": "ProcessResponse"
    },
    "GeneralAgent": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:general-agent",
      "Next": "ProcessResponse"
    },
    "ProcessResponse": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:ACCOUNT:function:response-processor",
      "End": true
    }
  }
}
```

---

## 🔷 Microsoft Azure

### 1. 🏃 Azure Container Instances

Quick deployment of containerized agents.

```python
from google.adk.deployment import AzureContainerDeployment

# Deploy to Azure Container Instances
azure_deployment = AzureContainerDeployment(
    resource_group="adk-agents",
    container_group_name="intelligent-agent-group",
    location="East US",
    containers=[{
        "name": "adk-agent",
        "image": "myregistry.azurecr.io/adk-agent:latest",
        "cpu": 1.0,
        "memory": 1.5,
        "ports": [{"port": 8080, "protocol": "TCP"}],
        "environment_variables": [
            {"name": "GEMINI_API_KEY", "secure_value": "${GEMINI_API_KEY}"},
            {"name": "AZURE_REGION", "value": "eastus"}
        ]
    }],
    ip_address={
        "type": "Public",
        "dns_name_label": "adk-agent-unique",
        "ports": [{"port": 8080, "protocol": "TCP"}]
    },
    restart_policy="Always"
)

# Deploy
azure_deployment.deploy()
```

---

### 2. ⚡ Azure Functions

Serverless agent deployment on Azure.

```python
# Azure Function entry point
import azure.functions as func
import json
from google.adk.agents import Agent
from google.adk.deployment import AzureFunctionHandler

# Initialize agent
agent = Agent(
    name="azure_agent",
    model="gemini-2.0-flash-exp",
    instruction="Process requests on Azure Functions"
)

# Azure Function handler
handler = AzureFunctionHandler(agent)

def main(req: func.HttpRequest) -> func.HttpResponse:
    """Azure Function entry point."""
    try:
        # Get request data
        req_body = req.get_json()
        
        # Process through ADK agent
        result = handler.process(req_body)
        
        return func.HttpResponse(
            json.dumps(result),
            status_code=200,
            headers={"Content-Type": "application/json"}
        )
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500
        )
```

```json
// function.json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
```

---

## 🌍 Multi-Cloud Deployment

### 1. 🔄 Cross-Cloud Agent Distribution

Deploy agents across multiple cloud providers for resilience.

```python
from google.adk.deployment import MultiCloudDeployment

# Configure multi-cloud deployment
multi_cloud = MultiCloudDeployment([
    {
        "provider": "gcp",
        "region": "us-central1",
        "service": "cloud-run",
        "config": gcp_config,
        "weight": 60  # Primary deployment
    },
    {
        "provider": "aws",
        "region": "us-east-1", 
        "service": "lambda",
        "config": aws_config,
        "weight": 30  # Secondary deployment
    },
    {
        "provider": "azure",
        "region": "eastus",
        "service": "functions",
        "config": azure_config,
        "weight": 10  # Backup deployment
    }
])

# Deploy across all clouds
multi_cloud.deploy()

# Configure traffic routing
multi_cloud.configure_routing({
    "strategy": "latency_based",
    "health_checks": True,
    "failover": "automatic"
})
```

### 2. 🌐 Global Load Balancing

Route requests to the optimal deployment based on latency and availability.

```python
from google.adk.deployment import GlobalLoadBalancer

# Configure global load balancer
global_lb = GlobalLoadBalancer(
    deployments=[
        {"endpoint": "https://us-central1-project.cloudfunctions.net/agent", "region": "us-central1"},
        {"endpoint": "https://europe-west1-project.cloudfunctions.net/agent", "region": "europe-west1"},
        {"endpoint": "https://asia-northeast1-project.cloudfunctions.net/agent", "region": "asia-northeast1"}
    ],
    routing_policy={
        "type": "geolocation",
        "health_check": {
            "path": "/health",
            "interval": 30,
            "timeout": 10,
            "unhealthy_threshold": 3
        },
        "fallback": "closest_healthy"
    }
)

# Setup global routing
global_lb.configure()
```

---

## 📊 Monitoring & Observability

### 1. 📈 Cloud-Native Monitoring

Integrate with cloud provider monitoring services.

```python
# Google Cloud Monitoring
from google.adk.monitoring import CloudMonitoring

gcp_monitoring = CloudMonitoring(
    project_id="my-project",
    metrics=[
        "agent.requests.count",
        "agent.requests.latency",
        "agent.errors.rate",
        "agent.tokens.consumed"
    ],
    dashboards=[
        "agent_performance",
        "error_analysis", 
        "cost_tracking"
    ],
    alerts=[
        {
            "name": "High Error Rate",
            "condition": "error_rate > 5%",
            "notification": ["email", "slack"]
        },
        {
            "name": "High Latency",
            "condition": "p95_latency > 2s",
            "notification": ["email", "pagerduty"]
        }
    ]
)

# AWS CloudWatch
from google.adk.monitoring import CloudWatchMonitoring

aws_monitoring = CloudWatchMonitoring(
    region="us-east-1",
    log_groups=["/aws/lambda/adk-agent"],
    metrics=[
        "Duration",
        "Errors", 
        "Throttles",
        "ConcurrentExecutions"
    ],
    alarms=[
        {
            "name": "LambdaErrors",
            "metric": "Errors",
            "threshold": 10,
            "period": 300
        }
    ]
)
```

### 2. 🔍 Distributed Tracing

Track requests across microservices and cloud boundaries.

```python
from google.adk.tracing import DistributedTracing

# Configure distributed tracing
tracing = DistributedTracing(
    service_name="adk-agent",
    providers=["cloud_trace", "jaeger", "zipkin"],
    sampling_rate=0.1,  # Sample 10% of requests
    custom_attributes=[
        "agent.name",
        "agent.model",
        "request.user_id",
        "request.session_id"
    ]
)

# Add tracing to agent
@tracing.trace_agent
class TracedAgent(Agent):
    def process(self, input_data):
        with tracing.span("agent.process") as span:
            span.set_attribute("input.length", len(input_data))
            
            result = super().process(input_data)
            
            span.set_attribute("output.length", len(result))
            return result
```

---

## 🔒 Security & Compliance

### 1. 🛡️ Identity and Access Management

Secure agent deployments with proper IAM configurations.

```python
# GCP IAM Configuration
gcp_iam = {
    "service_account": "adk-agent@project.iam.gserviceaccount.com",
    "roles": [
        "roles/aiplatform.user",
        "roles/secretmanager.secretAccessor",
        "roles/logging.logWriter",
        "roles/monitoring.metricWriter"
    ],
    "conditions": {
        "title": "Time-based access",
        "description": "Access only during business hours",
        "expression": "request.time.getHours() >= 9 && request.time.getHours() <= 17"
    }
}

# AWS IAM Policy
aws_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue",
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Deny",
            "Action": "*",
            "Resource": "*",
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": "203.0.113.0/24"
                }
            }
        }
    ]
}
```

### 2. 🔐 Secrets Management

Securely manage API keys and sensitive configuration.

```python
from google.adk.security import SecretsManager

# Multi-cloud secrets management
secrets_manager = SecretsManager([
    {
        "provider": "gcp",
        "service": "secret_manager",
        "project": "my-project"
    },
    {
        "provider": "aws",
        "service": "secrets_manager",
        "region": "us-east-1"
    },
    {
        "provider": "azure",
        "service": "key_vault",
        "vault_url": "https://my-vault.vault.azure.net/"
    }
])

# Retrieve secrets at runtime
api_key = secrets_manager.get_secret("gemini-api-key")
db_password = secrets_manager.get_secret("database-password")
```

---

## 💰 Cost Optimization

### 1. 📊 Cost Monitoring

Track and optimize deployment costs across cloud providers.

```python
from google.adk.cost import CostOptimizer

# Configure cost monitoring
cost_optimizer = CostOptimizer(
    providers=["gcp", "aws", "azure"],
    budget_alerts=[
        {"threshold": 80, "notification": "email"},
        {"threshold": 95, "notification": "slack"},
        {"threshold": 100, "action": "scale_down"}
    ],
    optimization_rules=[
        {"rule": "scale_down_idle", "threshold": "< 10% utilization for 1h"},
        {"rule": "use_spot_instances", "condition": "batch_workloads"},
        {"rule": "schedule_shutdown", "schedule": "weekends and holidays"}
    ]
)

# Generate cost reports
monthly_report = cost_optimizer.generate_report("monthly")
print(f"Total cost: ${monthly_report.total_cost}")
print(f"Cost by service: {monthly_report.by_service}")
print(f"Optimization suggestions: {monthly_report.suggestions}")
```

### 2. 🎯 Right-sizing Deployments

Automatically adjust resources based on usage patterns.

```python
from google.adk.optimization import AutoScaler

# Configure intelligent auto-scaling
auto_scaler = AutoScaler(
    metrics=["cpu_utilization", "memory_usage", "request_latency", "queue_depth"],
    scaling_policies=[
        {
            "metric": "cpu_utilization",
            "target": 70,
            "scale_up_cooldown": 300,
            "scale_down_cooldown": 600
        },
        {
            "metric": "request_latency",
            "target": "p95 < 1s",
            "scale_up_threshold": "p95 > 2s",
            "scale_down_threshold": "p95 < 500ms"
        }
    ],
    constraints={
        "min_instances": 1,
        "max_instances": 100,
        "max_cost_per_hour": 50
    }
)
```

---

## ✅ Best Practices

### 1. **Deployment Strategy**
- Start with single-cloud deployment
- Plan for multi-cloud from the beginning
- Use infrastructure as code (Terraform, CloudFormation)
- Implement blue-green or canary deployments
- Test thoroughly in staging environments

### 2. **Performance Optimization**
- Choose regions close to your users
- Use CDNs for static content
- Implement caching strategies
- Monitor cold start times for serverless
- Optimize container image sizes

### 3. **Security Hardening**
- Use least privilege access
- Encrypt data in transit and at rest
- Implement proper logging and auditing
- Regular security scans and updates
- Network segmentation and firewalls

### 4. **Cost Management**
- Set up billing alerts and budgets
- Use reserved instances for predictable workloads
- Implement auto-scaling policies
- Regular cost reviews and optimization
- Choose appropriate instance types

---

> **🚀 Next Steps**: Explore [Container Deployment](container-deployment.md) for advanced containerization strategies!