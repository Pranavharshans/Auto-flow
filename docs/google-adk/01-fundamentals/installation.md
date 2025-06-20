# 🚀 Installation Guide - Google Agent Development Kit (ADK)

> **Complete setup guide for Python and Java ADK implementations**

## 📋 Prerequisites

### System Requirements

| Component | Python ADK | Java ADK | Notes |
|-----------|------------|----------|-------|
| **Python** | 3.8+ | N/A | Recommended: 3.10+ |
| **Java** | N/A | 11+ | Recommended: 17+ LTS |
| **Memory** | 4GB+ | 8GB+ | Varies by model size |
| **Disk Space** | 2GB+ | 3GB+ | For dependencies and models |

### API Access Requirements

1. **Google API Key** (for Gemini Developer API)
   - Free tier available
   - Rate limits apply
   - Best for development/testing

2. **Google Cloud Credentials** (for Vertex AI)
   - Requires GCP project
   - Production-grade scaling
   - Enterprise features

3. **Third-party API Keys** (optional)
   - OpenAI, Anthropic, etc.
   - For LiteLLM integration

---

## 🐍 Python ADK Installation

### Option 1: Standard Installation

```bash
# Install from PyPI
pip install google-adk

# Verify installation
python -c "from google.adk import __version__; print(f'ADK v{__version__}')"
```

### Option 2: Development Installation

```bash
# Clone repository
git clone https://github.com/google/adk-python.git
cd adk-python

# Create virtual environment
python -m venv adk-env
source adk-env/bin/activate  # Linux/Mac
# OR
adk-env\Scripts\activate     # Windows

# Install in development mode
pip install -e .

# Install development dependencies
pip install -e ".[dev]"
```

### Option 3: Docker Installation

```bash
# Pull official image
docker pull google/adk:latest

# Run container with volume mount
docker run -it --rm \
  -v $(pwd):/workspace \
  -e GOOGLE_API_KEY=your_key \
  google/adk:latest
```

### Virtual Environment Setup

```bash
# Create isolated environment
python -m venv adk-env
source adk-env/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install ADK with optional dependencies
pip install google-adk[all]

# Available extras:
# pip install google-adk[streaming]  # Streaming support
# pip install google-adk[cloud]      # Cloud integrations
# pip install google-adk[dev]        # Development tools
```

---

## ☕ Java ADK Installation

### Maven Configuration

Add to your `pom.xml`:

```xml
<dependencies>
    <dependency>
        <groupId>com.google.adk</groupId>
        <artifactId>google-adk</artifactId>
        <version>0.1.0</version>
    </dependency>
    
    <!-- Optional: Streaming support -->
    <dependency>
        <groupId>com.google.adk</groupId>
        <artifactId>google-adk-streaming</artifactId>
        <version>0.1.0</version>
    </dependency>
    
    <!-- Optional: Cloud integrations -->
    <dependency>
        <groupId>com.google.adk</groupId>
        <artifactId>google-adk-cloud</artifactId>
        <version>0.1.0</version>
    </dependency>
</dependencies>
```

### Gradle Configuration

Add to your `build.gradle`:

```gradle
dependencies {
    implementation 'com.google.adk:google-adk:0.1.0'
    
    // Optional modules
    implementation 'com.google.adk:google-adk-streaming:0.1.0'
    implementation 'com.google.adk:google-adk-cloud:0.1.0'
    
    // Testing
    testImplementation 'com.google.adk:google-adk-test:0.1.0'
}
```

### Verification

```java
import com.google.adk.ADKVersion;

public class VerifyInstallation {
    public static void main(String[] args) {
        System.out.println("ADK Version: " + ADKVersion.get());
    }
}
```

---

## 🔑 Authentication Setup

### 1. Google API Key (Developer API)

```bash
# Set environment variable
export GOOGLE_API_KEY='your-api-key-here'

# Or create .env file
echo "GOOGLE_API_KEY=your-api-key-here" > .env
```

**Python verification:**
```python
import os
from google.adk import Client

# Auto-detects from environment
client = Client()

# Or explicit key
client = Client(api_key='your-api-key')
```

### 2. Vertex AI Credentials

```bash
# Install Google Cloud CLI
curl https://sdk.cloud.google.com | bash

# Authenticate
gcloud auth login
gcloud auth application-default login

# Set project
gcloud config set project your-project-id
export GOOGLE_CLOUD_PROJECT='your-project-id'
```

**Python configuration:**
```python
from google.adk import Client

# Vertex AI client
client = Client(
    vertexai=True,
    project='your-project-id',
    location='us-central1'
)
```

### 3. Service Account Setup

```bash
# Create service account
gcloud iam service-accounts create adk-agent \
    --display-name="ADK Agent Service Account"

# Download credentials
gcloud iam service-accounts keys create credentials.json \
    --iam-account=adk-agent@your-project-id.iam.gserviceaccount.com

# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS='path/to/credentials.json'
```

---

## 🛠️ Development Environment

### ADK CLI Installation

```bash
# ADK comes with CLI tools
pip install google-adk

# Verify CLI
adk --version
adk help

# Available commands:
adk init       # Initialize new project
adk web        # Start web interface
adk eval       # Run evaluations
adk deploy     # Deploy agents
```

### Project Structure Setup

```bash
# Initialize new ADK project
mkdir my-agent-project
cd my-agent-project
adk init

# Generated structure:
# my-agent-project/
# ├── agent.py              # Main agent definition
# ├── .env                  # Environment variables
# ├── requirements.txt      # Python dependencies
# ├── evaluation/           # Test cases
# │   └── test_cases.json
# ├── tools/               # Custom tools
# │   └── __init__.py
# └── config/              # Configuration files
#     └── agent_config.yaml
```

### IDE Configuration

#### VS Code Setup

```json
// .vscode/settings.json
{
  "python.defaultInterpreterPath": "./adk-env/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "files.associations": {
    "*.adk": "yaml"
  }
}
```

#### PyCharm Setup

1. Create new project with existing sources
2. Configure Python interpreter: `adk-env/bin/python`
3. Add ADK as external library
4. Enable pytest for testing

---

## 🧪 Verify Installation

### Basic Functionality Test

```python
# test_installation.py
from google.adk.agents import Agent
from google.adk.tools import echo_tool

def test_basic_agent():
    """Test basic agent creation and execution."""
    agent = Agent(
        name="test_agent",
        model="gemini-2.0-flash-exp",
        instruction="You are a test agent. Simply echo what users say.",
        tools=[echo_tool]
    )
    
    # Test agent creation
    assert agent.name == "test_agent"
    print("✅ Agent creation successful")
    
    # Test tool integration
    assert len(agent.tools) == 1
    print("✅ Tool integration successful")
    
    print("🎉 Basic installation verification complete!")

if __name__ == "__main__":
    test_basic_agent()
```

### Advanced Features Test

```python
# test_advanced.py
import asyncio
from google.adk.agents import Agent, SequentialAgent
from google.adk.tools import google_search

async def test_advanced_features():
    """Test advanced ADK features."""
    
    # Test multi-agent system
    search_agent = Agent(
        name="searcher",
        model="gemini-2.0-flash-exp",
        instruction="Search for information",
        tools=[google_search]
    )
    
    analysis_agent = Agent(
        name="analyzer",
        model="gemini-2.0-flash-exp",
        instruction="Analyze search results"
    )
    
    # Test sequential workflow
    workflow = SequentialAgent([search_agent, analysis_agent])
    assert len(workflow.agents) == 2
    print("✅ Multi-agent workflow successful")
    
    # Test streaming (if available)
    try:
        from google.adk.streaming import StreamingAgent
        streaming_agent = StreamingAgent(
            base_agent=search_agent,
            stream_config={'audio': True, 'video': False}
        )
        print("✅ Streaming capabilities available")
    except ImportError:
        print("ℹ️ Streaming not available (optional)")
    
    print("🚀 Advanced features verification complete!")

if __name__ == "__main__":
    asyncio.run(test_advanced_features())
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Import Errors**

```bash
# Error: ModuleNotFoundError: No module named 'google.adk'
# Solution: Check virtual environment and installation
pip list | grep google-adk
pip install --upgrade google-adk
```

#### 2. **Authentication Errors**

```bash
# Error: Invalid API key
# Solution: Verify environment variables
echo $GOOGLE_API_KEY
echo $GOOGLE_APPLICATION_CREDENTIALS

# Test authentication
python -c "from google.adk import Client; Client().models.list()"
```

#### 3. **Permission Errors**

```bash
# Error: Permission denied
# Solution: Check service account permissions
gcloud projects get-iam-policy your-project-id \
    --flatten="bindings[].members" \
    --filter="bindings.members:adk-agent@your-project-id.iam.gserviceaccount.com"
```

#### 4. **Memory Issues**

```bash
# Error: Out of memory
# Solution: Increase memory limits
export ADK_MAX_MEMORY=8g
export ADK_MODEL_CACHE_SIZE=2g
```

### Debug Mode

```python
import logging
from google.adk import set_debug_mode

# Enable debug logging
set_debug_mode(True)
logging.basicConfig(level=logging.DEBUG)

# Your agent code here...
```

### Health Check Script

```python
# health_check.py
import sys
import importlib
from google.adk import Client

def check_installation():
    """Comprehensive installation health check."""
    checks = []
    
    # 1. Check core imports
    try:
        import google.adk
        checks.append(("✅", "Core ADK import"))
    except Exception as e:
        checks.append(("❌", f"Core ADK import: {e}"))
    
    # 2. Check client creation
    try:
        client = Client()
        checks.append(("✅", "Client creation"))
    except Exception as e:
        checks.append(("❌", f"Client creation: {e}"))
    
    # 3. Check API access
    try:
        models = client.models.list()
        checks.append(("✅", f"API access ({len(list(models))} models)"))
    except Exception as e:
        checks.append(("❌", f"API access: {e}"))
    
    # 4. Check optional features
    optional_modules = [
        'google.adk.streaming',
        'google.adk.tools.mcp',
        'google.adk.cloud'
    ]
    
    for module in optional_modules:
        try:
            importlib.import_module(module)
            checks.append(("✅", f"Optional: {module}"))
        except ImportError:
            checks.append(("ℹ️", f"Optional: {module} (not installed)"))
    
    # Print results
    print("🏥 ADK Installation Health Check")
    print("=" * 40)
    for status, message in checks:
        print(f"{status} {message}")
    
    # Return overall status
    failed = sum(1 for status, _ in checks if status == "❌")
    if failed == 0:
        print("\n🎉 Installation is healthy!")
        return True
    else:
        print(f"\n⚠️ {failed} issues found")
        return False

if __name__ == "__main__":
    healthy = check_installation()
    sys.exit(0 if healthy else 1)
```

---

## 🔄 Upgrade Guide

### Regular Updates

```bash
# Check current version
pip show google-adk

# Upgrade to latest
pip install --upgrade google-adk

# Upgrade with all extras
pip install --upgrade google-adk[all]
```

### Breaking Changes Handling

```python
# Version compatibility check
from google.adk import __version__
from packaging import version

min_version = "1.0.0"
if version.parse(__version__) < version.parse(min_version):
    raise RuntimeError(f"ADK {min_version}+ required, got {__version__}")
```

---

## 📦 Docker Deployment

### Official Image

```dockerfile
# Use official ADK image
FROM google/adk:1.0.0

# Copy your agent code
COPY agent.py /app/
COPY requirements.txt /app/

# Install additional dependencies
RUN pip install -r /app/requirements.txt

# Set environment variables
ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}

# Run agent
CMD ["adk", "web", "--host", "0.0.0.0", "--port", "8080"]
```

### Custom Build

```dockerfile
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install ADK
RUN pip install google-adk[all]

# Create app directory
WORKDIR /app

# Copy application
COPY . .

# Install app dependencies
RUN pip install -r requirements.txt

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python health_check.py

# Run application
CMD ["adk", "web", "--host", "0.0.0.0"]
```

---

## ✅ Next Steps

After successful installation:

1. **[Quick Start Guide](quickstart.md)** - Build your first agent
2. **[Core Concepts](core-concepts.md)** - Understand ADK fundamentals
3. **[Agent Types](agent-types.md)** - Explore different agent architectures
4. **[Tool Integration](../03-tools/built-in-tools.md)** - Add capabilities to your agents

---

> **Need Help?** Join the [ADK Community](https://github.com/google/adk-python/discussions) or check the [Troubleshooting Guide](../12-appendix/troubleshooting.md)! 