# 🔧 Built-in Tools - Google ADK

> **Comprehensive guide to Google ADK's powerful pre-built tools and capabilities**

## 🎯 Overview

Google ADK provides a rich ecosystem of built-in tools that extend agent capabilities beyond language understanding. These tools are production-ready, optimized, and seamlessly integrate with agents to provide powerful functionality out-of-the-box.

---

## 🔍 Search & Information Tools

### 1. Google Search Tool

Access real-time web information through Google's search infrastructure.

```python
from google.adk.tools import google_search

# Basic usage
search_agent = Agent(
    name="research_assistant",
    model="gemini-2.0-flash-exp",
    instruction="Help users find accurate, up-to-date information",
    tools=[google_search]
)

# Advanced configuration
from google.adk.tools.config import GoogleSearchConfig

advanced_search = google_search.configure(
    GoogleSearchConfig(
        num_results=10,        # Number of results to return
        language="en",         # Search language
        region="US",           # Geographic region
        safe_search="moderate", # Safe search level
        time_filter="recent",  # Time-based filtering
        include_snippets=True, # Include page snippets
        include_images=False   # Exclude image results
    )
)
```

#### Search Tool Features
- **Real-time Results**: Latest information from the web
- **Snippet Extraction**: Automatic content summarization
- **Source Attribution**: Reliable source tracking
- **Geographic Filtering**: Region-specific results
- **Time-based Filtering**: Recent, past week, month, year
- **Safe Search**: Content filtering options

#### Usage Examples
```python
# Research agent with search
research_agent = Agent(
    name="researcher",
    model="gemini-2.0-flash-exp",
    instruction="""You are a research specialist.
    
    When users ask questions:
    1. Use google_search to find current information
    2. Analyze multiple sources for accuracy
    3. Provide well-sourced, comprehensive answers
    4. Always cite your sources
    
    Focus on factual, verifiable information.""",
    tools=[google_search]
)

# Example interaction:
# User: "What are the latest developments in quantum computing?"
# Agent uses google_search to find recent articles and provides comprehensive answer
```

---

### 2. Web Scraper Tool

Extract and analyze content from web pages.

```python
from google.adk.tools import web_scraper

# Basic web scraping
scraper_agent = Agent(
    name="content_analyzer",
    model="gemini-2.0-flash-exp",
    instruction="Extract and analyze web page content",
    tools=[web_scraper]
)

# Advanced scraping configuration
from google.adk.tools.config import WebScraperConfig

advanced_scraper = web_scraper.configure(
    WebScraperConfig(
        extract_text=True,     # Extract text content
        extract_links=True,    # Extract all links
        extract_images=False,  # Skip images
        extract_metadata=True, # Page metadata
        follow_redirects=True, # Follow redirects
        timeout=30,            # Request timeout
        user_agent="ADK-Bot/1.0", # Custom user agent
        headers={               # Custom headers
            "Accept": "text/html,application/xhtml+xml"
        }
    )
)
```

#### Web Scraper Features
- **Content Extraction**: Text, links, images, metadata
- **Format Support**: HTML, XML, JSON responses
- **Redirect Handling**: Automatic redirect following
- **Error Handling**: Robust error recovery
- **Rate Limiting**: Respectful crawling
- **Custom Headers**: User agent and header customization

#### Usage Examples
```python
# Content analysis agent
content_analyzer = Agent(
    name="web_content_analyzer",
    model="gemini-2.0-flash-exp",
    instruction="""Analyze web page content for insights.
    
    When given a URL:
    1. Use web_scraper to extract page content
    2. Analyze the text for key themes and topics
    3. Identify important links and references
    4. Summarize the main points
    5. Assess content quality and credibility""",
    tools=[web_scraper]
)
```

---

## 💻 Code & Development Tools

### 3. Code Execution Tool

Execute and test code in secure sandboxed environments.

```python
from google.adk.tools import code_exec

# Basic code execution
coding_agent = Agent(
    name="code_assistant",
    model="gemini-2.0-flash-exp",
    instruction="Help users write, test, and debug code",
    tools=[code_exec]
)

# Language-specific configuration
from google.adk.tools.config import CodeExecConfig

python_executor = code_exec.configure(
    CodeExecConfig(
        language="python",
        timeout=30,           # Execution timeout
        memory_limit="512MB", # Memory limit
        cpu_limit="1 core",   # CPU limit
        network_access=False, # Disable network
        file_access="read_only", # File system access
        packages=["numpy", "pandas", "matplotlib"] # Available packages
    )
)
```

#### Supported Languages
- **Python**: Full Python 3.11+ support with popular packages
- **JavaScript**: Node.js runtime with npm packages
- **Java**: JDK 17+ with Maven dependencies
- **Go**: Latest Go runtime
- **Rust**: Stable Rust toolchain
- **SQL**: SQLite, PostgreSQL, MySQL dialects

#### Security Features
- **Sandboxed Execution**: Isolated runtime environments
- **Resource Limits**: CPU, memory, and time constraints
- **Network Isolation**: Controlled network access
- **File System Controls**: Read-only or restricted access
- **Package Management**: Pre-approved package libraries

#### Usage Examples
```python
# Programming tutor agent
programming_tutor = Agent(
    name="python_tutor",
    model="gemini-2.0-flash-exp",
    instruction="""You are a Python programming tutor.
    
    Help users learn programming by:
    1. Explaining concepts clearly
    2. Writing example code
    3. Using code_exec to demonstrate working examples
    4. Testing and debugging code together
    5. Providing hands-on learning experiences
    
    Always run code to verify it works before sharing.""",
    tools=[code_exec]
)

# Data analysis agent
data_analyst = Agent(
    name="data_analyst",
    model="gemini-2.0-flash-exp",
    instruction="""Analyze data and create visualizations.
    
    Process:
    1. Understand the data analysis request
    2. Write Python code using pandas, numpy, matplotlib
    3. Use code_exec to run analysis and generate results
    4. Interpret results and provide insights
    5. Suggest next steps or additional analyses""",
    tools=[code_exec.configure(
        CodeExecConfig(
            language="python",
            packages=["pandas", "numpy", "matplotlib", "seaborn", "scipy"]
        )
    )]
)
```

---

### 4. File System Tool

Interact with files and directories safely.

```python
from google.adk.tools import file_system

# Basic file operations
file_agent = Agent(
    name="file_manager",
    model="gemini-2.0-flash-exp",
    instruction="Help users manage files and directories",
    tools=[file_system]
)

# Secure file system configuration
from google.adk.tools.config import FileSystemConfig

secure_fs = file_system.configure(
    FileSystemConfig(
        base_path="/safe/workspace",  # Restrict to specific directory
        read_access=True,             # Allow reading files
        write_access=True,            # Allow writing files
        create_dirs=True,             # Allow directory creation
        delete_access=False,          # Prevent deletions
        max_file_size="10MB",         # File size limit
        allowed_extensions=[".txt", ".json", ".csv", ".py"], # File type restrictions
        scan_for_malware=True         # Security scanning
    )
)
```

#### File System Features
- **Safe Operations**: Sandboxed file access
- **Path Validation**: Prevent directory traversal
- **Size Limits**: File and directory size constraints
- **Type Restrictions**: Allowed file extensions
- **Security Scanning**: Malware and virus detection
- **Backup Support**: Automatic file backups

#### Usage Examples
```python
# Document processor agent
document_processor = Agent(
    name="document_processor",
    model="gemini-2.0-flash-exp",
    instruction="""Process and organize documents.
    
    Capabilities:
    1. Read various document formats
    2. Extract and analyze content
    3. Organize files into logical structures
    4. Create summaries and indexes
    5. Convert between formats when needed""",
    tools=[file_system, code_exec]
)
```

---

## 🌐 Integration & Communication Tools

### 5. HTTP Client Tool

Make HTTP requests to external APIs and services.

```python
from google.adk.tools import http_client

# Basic HTTP client
api_agent = Agent(
    name="api_integrator",
    model="gemini-2.0-flash-exp",
    instruction="Integrate with external APIs and services",
    tools=[http_client]
)

# Advanced HTTP configuration
from google.adk.tools.config import HTTPClientConfig

api_client = http_client.configure(
    HTTPClientConfig(
        timeout=30,                    # Request timeout
        max_redirects=5,               # Redirect limit
        verify_ssl=True,               # SSL verification
        user_agent="ADK-Agent/1.0",    # User agent
        default_headers={              # Default headers
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        retry_attempts=3,              # Retry failed requests
        retry_delay=1,                 # Delay between retries
        allowed_hosts=[                # Whitelist of allowed hosts
            "api.example.com",
            "secure.api.service.com"
        ]
    )
)
```

#### HTTP Client Features
- **Multiple Methods**: GET, POST, PUT, DELETE, PATCH
- **Authentication**: Bearer tokens, API keys, OAuth
- **Request/Response Handling**: JSON, XML, form data
- **Error Handling**: Automatic retries and error recovery
- **Security**: Host whitelisting and SSL verification
- **Rate Limiting**: Respectful API usage

#### Usage Examples
```python
# Weather service integration
weather_agent = Agent(
    name="weather_service",
    model="gemini-2.0-flash-exp",
    instruction="""Provide weather information using external APIs.
    
    Process:
    1. Parse location requests
    2. Use http_client to call weather APIs
    3. Process and format weather data
    4. Provide helpful weather insights
    5. Include relevant warnings or recommendations""",
    tools=[http_client]
)

# CRM integration agent
crm_agent = Agent(
    name="crm_integrator",
    model="gemini-2.0-flash-exp",
    instruction="""Integrate with CRM systems.
    
    Functions:
    1. Retrieve customer information
    2. Update customer records
    3. Create new leads and opportunities
    4. Generate reports and analytics
    5. Sync data between systems""",
    tools=[http_client.configure(
        HTTPClientConfig(
            default_headers={
                "Authorization": "Bearer ${CRM_API_TOKEN}",
                "Content-Type": "application/json"
            },
            allowed_hosts=["api.crm-system.com"]
        )
    )]
)
```

---

### 6. Email Tool

Send and manage email communications.

```python
from google.adk.tools import email_tool

# Basic email functionality
email_agent = Agent(
    name="email_assistant",
    model="gemini-2.0-flash-exp",
    instruction="Help users compose and send emails",
    tools=[email_tool]
)

# Email configuration
from google.adk.tools.config import EmailConfig

email_client = email_tool.configure(
    EmailConfig(
        smtp_host="smtp.gmail.com",
        smtp_port=587,
        use_tls=True,
        username="${EMAIL_USERNAME}",
        password="${EMAIL_PASSWORD}",
        from_name="AI Assistant",
        reply_to="noreply@company.com",
        max_recipients=50,            # Recipient limit
        attachment_limit="25MB",      # Attachment size limit
        rate_limit=100,               # Emails per hour
        template_engine="jinja2"      # Template support
    )
)
```

#### Email Features
- **HTML/Text Support**: Rich formatting options
- **Attachments**: File attachment support
- **Templates**: Email template system
- **Bulk Sending**: Efficient bulk email handling
- **Tracking**: Delivery and read receipts
- **Security**: Encryption and authentication

#### Usage Examples
```python
# Customer service email agent
customer_email_agent = Agent(
    name="customer_email_support",
    model="gemini-2.0-flash-exp",
    instruction="""Handle customer email communications.
    
    Responsibilities:
    1. Read and understand customer emails
    2. Compose appropriate responses
    3. Escalate complex issues to humans
    4. Track email conversations
    5. Maintain professional tone and branding""",
    tools=[email_tool, file_system]
)

# Marketing automation agent
marketing_agent = Agent(
    name="marketing_automation",
    model="gemini-2.0-flash-exp",
    instruction="""Automate marketing email campaigns.
    
    Capabilities:
    1. Create personalized email content
    2. Segment customer lists
    3. Schedule email campaigns
    4. Track engagement metrics
    5. A/B test email variations""",
    tools=[email_tool, http_client]
)
```

---

## 📊 Data & Analytics Tools

### 7. Database Tool

Connect to and query various database systems.

```python
from google.adk.tools import database_tool

# Basic database operations
db_agent = Agent(
    name="database_manager",
    model="gemini-2.0-flash-exp",
    instruction="Query and manage database information",
    tools=[database_tool]
)

# Database configuration
from google.adk.tools.config import DatabaseConfig

postgres_db = database_tool.configure(
    DatabaseConfig(
        database_type="postgresql",
        host="localhost",
        port=5432,
        database="production_db",
        username="${DB_USERNAME}",
        password="${DB_PASSWORD}",
        connection_pool_size=10,      # Connection pooling
        query_timeout=30,             # Query timeout
        read_only=True,               # Read-only access
        allowed_tables=[              # Table whitelist
            "customers", "orders", "products"
        ],
        row_limit=1000,               # Maximum rows per query
        enable_sql_logging=True       # Log all queries
    )
)
```

#### Supported Databases
- **PostgreSQL**: Full PostgreSQL support
- **MySQL**: MySQL and MariaDB
- **SQLite**: Embedded SQLite databases
- **MongoDB**: NoSQL document database
- **Redis**: Key-value store and cache
- **BigQuery**: Google Cloud data warehouse
- **Snowflake**: Cloud data platform

#### Security Features
- **Read-only Access**: Prevent data modifications
- **Table Whitelisting**: Restrict accessible tables
- **Query Validation**: SQL injection prevention
- **Row Limits**: Prevent large data exports
- **Audit Logging**: Complete query logging
- **Connection Encryption**: TLS/SSL connections

#### Usage Examples
```python
# Business intelligence agent
bi_agent = Agent(
    name="business_intelligence",
    model="gemini-2.0-flash-exp",
    instruction="""Provide business intelligence insights.
    
    Analyze business data by:
    1. Understanding business questions
    2. Writing appropriate SQL queries
    3. Executing queries safely
    4. Interpreting results and trends
    5. Providing actionable insights""",
    tools=[database_tool, code_exec]
)

# Customer support database agent
support_db_agent = Agent(
    name="support_database",
    model="gemini-2.0-flash-exp",
    instruction="""Access customer support database.
    
    Help support agents by:
    1. Looking up customer information
    2. Finding order and ticket history
    3. Checking product details
    4. Generating customer reports
    5. Maintaining data privacy""",
    tools=[database_tool.configure(
        DatabaseConfig(
            read_only=True,
            allowed_tables=["customers", "tickets", "orders"],
            row_limit=100
        )
    )]
)
```

---

## 🎨 Content & Media Tools

### 8. Image Analysis Tool

Analyze and process images using computer vision.

```python
from google.adk.tools import image_analysis

# Basic image analysis
vision_agent = Agent(
    name="image_analyzer",
    model="gemini-2.0-flash-exp",
    instruction="Analyze and describe images",
    tools=[image_analysis]
)

# Advanced image analysis configuration
from google.adk.tools.config import ImageAnalysisConfig

advanced_vision = image_analysis.configure(
    ImageAnalysisConfig(
        max_image_size="10MB",        # Size limit
        supported_formats=["jpg", "png", "gif", "webp"],
        features=[                    # Analysis features
            "object_detection",
            "text_extraction",
            "face_detection",
            "scene_analysis",
            "color_analysis"
        ],
        confidence_threshold=0.7,     # Minimum confidence
        max_objects=50,               # Object detection limit
        enable_nsfw_filter=True       # Content filtering
    )
)
```

#### Image Analysis Features
- **Object Detection**: Identify objects and their locations
- **Text Extraction (OCR)**: Extract text from images
- **Face Detection**: Detect and analyze faces
- **Scene Analysis**: Understand image context
- **Color Analysis**: Dominant colors and palettes
- **Content Moderation**: NSFW and inappropriate content detection

#### Usage Examples
```python
# Content moderation agent
content_moderator = Agent(
    name="image_moderator",
    model="gemini-2.0-flash-exp",
    instruction="""Moderate user-uploaded images.
    
    Review images for:
    1. Inappropriate or harmful content
    2. Copyright violations
    3. Quality and relevance
    4. Policy compliance
    5. Automatic flagging of issues""",
    tools=[image_analysis]
)

# Product catalog agent
catalog_agent = Agent(
    name="product_catalog",
    model="gemini-2.0-flash-exp",
    instruction="""Process product images for e-commerce.
    
    Extract information:
    1. Product features and attributes
    2. Color variations and details
    3. Text and labels on products
    4. Quality assessment
    5. Category classification""",
    tools=[image_analysis, database_tool]
)
```

---

## 🔗 Model Context Protocol (MCP) Tools

### 9. MCP Integration

Access community-built tools through the Model Context Protocol.

```python
from google.adk.tools.mcp import load_mcp_tool, list_mcp_tools

# Discover available MCP tools
available_tools = list_mcp_tools()
print("Available MCP tools:", [tool.name for tool in available_tools])

# Load specific MCP tools
calculator = load_mcp_tool("calculator")
file_manager = load_mcp_tool("file-manager")
git_tool = load_mcp_tool("git-integration")

# Agent with MCP tools
utility_agent = Agent(
    name="utility_assistant",
    model="gemini-2.0-flash-exp",
    instruction="Provide utility functions using MCP tools",
    tools=[calculator, file_manager, git_tool]
)
```

#### Popular MCP Tools
- **Calculator**: Advanced mathematical calculations
- **File Manager**: Enhanced file operations
- **Git Integration**: Version control operations
- **Calendar**: Calendar and scheduling
- **Todo Manager**: Task management
- **Password Generator**: Secure password creation
- **QR Code**: QR code generation and reading
- **Weather**: Weather information services

#### Usage Examples
```python
# Development assistant with MCP tools
dev_assistant = Agent(
    name="development_assistant",
    model="gemini-2.0-flash-exp",
    instruction="""Help developers with common tasks.
    
    Provide assistance with:
    1. Mathematical calculations
    2. File and directory operations
    3. Git version control
    4. Code generation and testing
    5. Project management tasks""",
    tools=[
        load_mcp_tool("calculator"),
        load_mcp_tool("file-manager"),
        load_mcp_tool("git-integration"),
        code_exec
    ]
)
```

---

## 🔧 Tool Configuration Best Practices

### 1. Security Configuration

```python
# Secure tool configuration template
def create_secure_tool_config():
    return {
        "timeout": 30,                # Reasonable timeouts
        "rate_limit": 100,            # Prevent abuse
        "allowed_hosts": [            # Whitelist external hosts
            "api.trusted-service.com"
        ],
        "ssl_verify": True,           # Always verify SSL
        "max_file_size": "10MB",      # Limit file sizes
        "sandbox_mode": True,         # Enable sandboxing
        "audit_logging": True         # Log all operations
    }
```

### 2. Performance Optimization

```python
# Optimized tool configuration
performance_config = {
    "connection_pooling": True,       # Reuse connections
    "cache_results": True,            # Cache frequent requests
    "batch_operations": True,         # Batch when possible
    "async_execution": True,          # Non-blocking operations
    "compression": True,              # Compress data transfer
    "timeout": 15                     # Fast timeouts
}
```

### 3. Error Handling

```python
# Robust error handling
error_handling_config = {
    "retry_attempts": 3,              # Retry failed operations
    "retry_delay": 1,                 # Exponential backoff
    "fallback_enabled": True,         # Fallback mechanisms
    "error_reporting": True,          # Report errors
    "graceful_degradation": True      # Continue on non-critical errors
}
```

### 4. Monitoring and Observability

```python
# Monitoring configuration
monitoring_config = {
    "metrics_enabled": True,          # Collect metrics
    "tracing_enabled": True,          # Distributed tracing
    "logging_level": "INFO",          # Appropriate logging
    "health_checks": True,            # Health monitoring
    "performance_tracking": True      # Performance metrics
}
```

---

## 🎯 Tool Selection Guide

### Decision Matrix

| Use Case | Recommended Tools | Why |
|----------|-------------------|-----|
| Research & Information | google_search, web_scraper | Real-time web information |
| Code Development | code_exec, file_system, git_tool | Complete development environment |
| API Integration | http_client, database_tool | External service connectivity |
| Customer Communication | email_tool, database_tool | Communication and data access |
| Content Analysis | image_analysis, web_scraper | Multi-modal content processing |
| Data Analytics | database_tool, code_exec | Data query and analysis |
| File Processing | file_system, image_analysis | File management and analysis |
| Utility Functions | MCP tools, calculator | Specialized utility functions |

---

## ✅ Next Steps

Now that you understand Google ADK's built-in tools:

1. **[Custom Tools](custom-tools.md)** - Learn to create your own tools
2. **[MCP Tools](mcp-tools.md)** - Explore community tools
3. **[Tool Patterns](tool-patterns.md)** - Best practices for tool design
4. **[API Integrations](api-integrations.md)** - Connect to external services

> **🚀 Pro Tip**: Start with built-in tools for common tasks, then extend with custom tools for specialized needs! 