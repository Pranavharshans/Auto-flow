# 🔐 Authentication - Google ADK

> **Secure your AI agents with robust authentication and authorization mechanisms**

## 🎯 Overview

Google ADK provides comprehensive authentication and authorization frameworks to secure your AI agents and protect sensitive data. This guide covers identity management, access control, API security, and compliance requirements for enterprise-grade agent deployments.

---

## 🏗️ Authentication Architecture

### 1. 📋 Authentication Methods

Google ADK supports multiple authentication methods for different use cases.

```python
from google.adk.auth import AuthenticationManager, AuthMethod

# Configure authentication methods
auth_manager = AuthenticationManager([
    AuthMethod.API_KEY,          # Simple API key authentication
    AuthMethod.OAUTH2,           # OAuth 2.0 for user authentication
    AuthMethod.JWT,              # JSON Web Tokens
    AuthMethod.GOOGLE_AUTH,      # Google Identity Platform
    AuthMethod.CUSTOM_SSO,       # Custom SSO integration
    AuthMethod.MUTUAL_TLS        # mTLS for service-to-service
])

# Configure each method
auth_config = {
    "api_key": {
        "header_name": "X-API-Key",
        "encryption": "AES-256",
        "rotation_interval": "30d",
        "rate_limiting": True
    },
    "oauth2": {
        "provider": "google",
        "scopes": ["openid", "email", "profile"],
        "token_validation": "strict",
        "refresh_tokens": True
    },
    "jwt": {
        "algorithm": "RS256",
        "issuer": "your-auth-service",
        "audience": "adk-agents",
        "expiration": 3600,  # 1 hour
        "verify_signature": True
    },
    "google_auth": {
        "project_id": "your-gcp-project",
        "client_id": "your-oauth-client-id",
        "identity_pools": ["pool-1", "pool-2"],
        "domain_restriction": "your-domain.com"
    }
}

# Initialize authentication
auth_manager.configure(auth_config)
```

### 2. 🔑 API Key Management

Implement secure API key management for agent access.

```python
from google.adk.auth import APIKeyManager
from google.adk.security import EncryptionService

class SecureAPIKeyManager:
    def __init__(self):
        self.encryption = EncryptionService(algorithm="AES-256-GCM")
        self.key_store = SecureKeyStore()
        self.audit_logger = AuditLogger()
    
    async def create_api_key(self, user_id, permissions, metadata=None):
        """Create a new API key with specified permissions."""
        
        # Generate secure random key
        raw_key = self.generate_secure_key(length=64)
        
        # Create key metadata
        key_metadata = {
            "user_id": user_id,
            "permissions": permissions,
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(days=90),
            "status": "active",
            "metadata": metadata or {}
        }
        
        # Encrypt and store key
        encrypted_key = await self.encryption.encrypt(raw_key)
        key_id = await self.key_store.store(encrypted_key, key_metadata)
        
        # Log key creation
        await self.audit_logger.log_event({
            "action": "api_key_created",
            "user_id": user_id,
            "key_id": key_id,
            "permissions": permissions
        })
        
        # Return only the key ID and display key
        return {
            "key_id": key_id,
            "api_key": f"adk_{key_id}_{raw_key[:8]}...",  # Truncated for display
            "full_key": raw_key,  # Return once, never stored
            "expires_at": key_metadata["expires_at"]
        }
    
    async def validate_api_key(self, api_key):
        """Validate an API key and return associated permissions."""
        
        try:
            # Extract key ID from formatted key
            key_parts = api_key.split('_')
            if len(key_parts) < 2 or key_parts[0] != 'adk':
                raise AuthenticationError("Invalid API key format")
            
            key_id = key_parts[1]
            
            # Retrieve key metadata
            key_data = await self.key_store.get(key_id)
            if not key_data:
                raise AuthenticationError("API key not found")
            
            # Check key status and expiration
            if key_data["status"] != "active":
                raise AuthenticationError("API key is disabled")
            
            if key_data["expires_at"] < datetime.utcnow():
                raise AuthenticationError("API key has expired")
            
            # Verify key signature (if using signed keys)
            if not await self.verify_key_signature(api_key, key_data):
                raise AuthenticationError("Invalid API key signature")
            
            # Update last used timestamp
            await self.key_store.update_last_used(key_id)
            
            # Log successful authentication
            await self.audit_logger.log_event({
                "action": "api_key_used",
                "key_id": key_id,
                "user_id": key_data["user_id"]
            })
            
            return {
                "valid": True,
                "user_id": key_data["user_id"],
                "permissions": key_data["permissions"],
                "metadata": key_data["metadata"]
            }
            
        except Exception as e:
            # Log failed authentication attempt
            await self.audit_logger.log_event({
                "action": "api_key_validation_failed",
                "error": str(e),
                "api_key_prefix": api_key[:12] if api_key else None
            })
            
            raise AuthenticationError(f"Authentication failed: {str(e)}")
    
    async def rotate_api_key(self, key_id, user_id):
        """Rotate an existing API key."""
        
        # Verify ownership
        existing_key = await self.key_store.get(key_id)
        if not existing_key or existing_key["user_id"] != user_id:
            raise AuthorizationError("Access denied")
        
        # Create new key with same permissions
        new_key = await self.create_api_key(
            user_id=user_id,
            permissions=existing_key["permissions"],
            metadata=existing_key["metadata"]
        )
        
        # Mark old key as rotated (don't delete immediately for grace period)
        await self.key_store.update_status(key_id, "rotated")
        
        # Schedule old key deletion after grace period
        await self.schedule_key_deletion(key_id, grace_period_hours=24)
        
        return new_key
    
    def generate_secure_key(self, length=64):
        """Generate a cryptographically secure API key."""
        import secrets
        import string
        
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))
```

---

## 🔐 OAuth 2.0 Integration

### 1. 🌐 Google OAuth Integration

Integrate with Google's OAuth 2.0 for user authentication.

```python
from google.adk.auth import GoogleOAuthProvider
from google.oauth2 import id_token
from google.auth.transport import requests

class GoogleOAuthHandler:
    def __init__(self, client_id, client_secret, redirect_uri):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.oauth_provider = GoogleOAuthProvider()
    
    def get_authorization_url(self, state=None, scopes=None):
        """Generate OAuth authorization URL."""
        
        default_scopes = ["openid", "email", "profile"]
        scopes = scopes or default_scopes
        
        auth_url = self.oauth_provider.get_authorization_url(
            client_id=self.client_id,
            redirect_uri=self.redirect_uri,
            scopes=scopes,
            state=state,
            access_type="offline",  # Get refresh token
            prompt="consent"        # Force consent for refresh token
        )
        
        return auth_url
    
    async def handle_oauth_callback(self, authorization_code, state=None):
        """Handle OAuth callback and exchange code for tokens."""
        
        try:
            # Exchange authorization code for tokens
            token_response = await self.oauth_provider.exchange_code(
                code=authorization_code,
                client_id=self.client_id,
                client_secret=self.client_secret,
                redirect_uri=self.redirect_uri
            )
            
            # Verify ID token
            id_info = id_token.verify_oauth2_token(
                token_response["id_token"],
                requests.Request(),
                self.client_id
            )
            
            # Extract user information
            user_info = {
                "user_id": id_info["sub"],
                "email": id_info["email"],
                "name": id_info.get("name"),
                "picture": id_info.get("picture"),
                "email_verified": id_info.get("email_verified", False)
            }
            
            # Create session
            session = await self.create_user_session(
                user_info=user_info,
                access_token=token_response["access_token"],
                refresh_token=token_response.get("refresh_token"),
                expires_in=token_response["expires_in"]
            )
            
            return {
                "success": True,
                "user": user_info,
                "session": session,
                "tokens": {
                    "access_token": token_response["access_token"],
                    "refresh_token": token_response.get("refresh_token"),
                    "expires_in": token_response["expires_in"]
                }
            }
            
        except Exception as e:
            # Log authentication failure
            await self.audit_logger.log_event({
                "action": "oauth_callback_failed",
                "error": str(e),
                "state": state
            })
            
            raise AuthenticationError(f"OAuth authentication failed: {str(e)}")
    
    async def refresh_access_token(self, refresh_token):
        """Refresh an expired access token."""
        
        try:
            token_response = await self.oauth_provider.refresh_token(
                refresh_token=refresh_token,
                client_id=self.client_id,
                client_secret=self.client_secret
            )
            
            return {
                "access_token": token_response["access_token"],
                "expires_in": token_response["expires_in"],
                "refresh_token": token_response.get("refresh_token", refresh_token)
            }
            
        except Exception as e:
            raise AuthenticationError(f"Token refresh failed: {str(e)}")
    
    async def create_user_session(self, user_info, access_token, refresh_token, expires_in):
        """Create a user session with token management."""
        
        session_id = self.generate_session_id()
        session_data = {
            "session_id": session_id,
            "user_id": user_info["user_id"],
            "user_info": user_info,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_at": datetime.utcnow() + timedelta(seconds=expires_in),
            "created_at": datetime.utcnow(),
            "last_activity": datetime.utcnow()
        }
        
        # Store session securely
        await self.session_store.create_session(session_id, session_data)
        
        return session_id
```

### 2. 🔒 Custom SSO Integration

Integrate with enterprise SSO systems.

```python
from google.adk.auth import SSOProvider
import saml2
from saml2.config import Config as SAMLConfig

class EnterpriseSSOHandler:
    def __init__(self, sso_config):
        self.sso_config = sso_config
        self.saml_config = self.setup_saml_config()
        self.sso_provider = SSOProvider(self.sso_config)
    
    def setup_saml_config(self):
        """Configure SAML 2.0 settings."""
        
        saml_settings = {
            "entityid": self.sso_config["entity_id"],
            "assertion_consumer_service": {
                "url": self.sso_config["acs_url"],
                "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
            },
            "single_logout_service": {
                "url": self.sso_config["sls_url"],
                "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
            },
            "name_id_format": "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
            "x509cert": self.sso_config["certificate"],
            "private_key": self.sso_config["private_key"]
        }
        
        return SAMLConfig(saml_settings)
    
    async def initiate_sso_login(self, relay_state=None):
        """Initiate SSO login flow."""
        
        # Generate SAML authentication request
        auth_request = await self.sso_provider.create_auth_request(
            destination=self.sso_config["sso_url"],
            relay_state=relay_state
        )
        
        return {
            "sso_url": auth_request["redirect_url"],
            "saml_request": auth_request["saml_request"],
            "relay_state": relay_state
        }
    
    async def handle_sso_response(self, saml_response, relay_state=None):
        """Handle SSO authentication response."""
        
        try:
            # Validate SAML response
            auth_response = await self.sso_provider.validate_response(
                saml_response=saml_response,
                relay_state=relay_state
            )
            
            if not auth_response["valid"]:
                raise AuthenticationError("Invalid SAML response")
            
            # Extract user attributes
            attributes = auth_response["attributes"]
            user_info = {
                "user_id": attributes.get("NameID"),
                "email": attributes.get("email", [None])[0],
                "name": attributes.get("displayName", [None])[0],
                "groups": attributes.get("groups", []),
                "department": attributes.get("department", [None])[0],
                "employee_id": attributes.get("employeeID", [None])[0]
            }
            
            # Create or update user in local system
            user = await self.create_or_update_user(user_info)
            
            # Create authenticated session
            session = await self.create_sso_session(user, attributes)
            
            return {
                "success": True,
                "user": user,
                "session": session,
                "attributes": attributes
            }
            
        except Exception as e:
            await self.audit_logger.log_event({
                "action": "sso_authentication_failed",
                "error": str(e),
                "relay_state": relay_state
            })
            
            raise AuthenticationError(f"SSO authentication failed: {str(e)}")
    
    async def create_or_update_user(self, user_info):
        """Create or update user based on SSO attributes."""
        
        user = await self.user_store.get_by_sso_id(user_info["user_id"])
        
        if user:
            # Update existing user
            await self.user_store.update(user["id"], {
                "email": user_info["email"],
                "name": user_info["name"],
                "groups": user_info["groups"],
                "department": user_info["department"],
                "last_login": datetime.utcnow()
            })
        else:
            # Create new user
            user = await self.user_store.create({
                "sso_id": user_info["user_id"],
                "email": user_info["email"],
                "name": user_info["name"],
                "groups": user_info["groups"],
                "department": user_info["department"],
                "employee_id": user_info["employee_id"],
                "created_at": datetime.utcnow(),
                "last_login": datetime.utcnow()
            })
        
        return user
```

---

## 🛡️ Authorization & Access Control

### 1. 🎭 Role-Based Access Control (RBAC)

Implement comprehensive RBAC for agent access.

```python
from google.adk.auth import RBACManager, Permission, Role

class AgentRBACSystem:
    def __init__(self):
        self.rbac_manager = RBACManager()
        self.setup_default_roles()
    
    def setup_default_roles(self):
        """Setup default roles and permissions."""
        
        # Define permissions
        permissions = {
            # Agent permissions
            "agent.create": Permission("agent.create", "Create new agents"),
            "agent.read": Permission("agent.read", "View agent details"),
            "agent.update": Permission("agent.update", "Modify agent configuration"),
            "agent.delete": Permission("agent.delete", "Delete agents"),
            "agent.execute": Permission("agent.execute", "Execute agent workflows"),
            
            # Tool permissions
            "tools.use": Permission("tools.use", "Use agent tools"),
            "tools.manage": Permission("tools.manage", "Manage tool configurations"),
            
            # Data permissions
            "data.read": Permission("data.read", "Read data sources"),
            "data.write": Permission("data.write", "Write to data sources"),
            "data.admin": Permission("data.admin", "Administer data sources"),
            
            # System permissions
            "system.monitor": Permission("system.monitor", "Monitor system health"),
            "system.admin": Permission("system.admin", "System administration"),
            "system.audit": Permission("system.audit", "Access audit logs")
        }
        
        # Define roles
        roles = {
            "viewer": Role("viewer", "Read-only access", [
                permissions["agent.read"],
                permissions["system.monitor"]
            ]),
            
            "developer": Role("developer", "Developer access", [
                permissions["agent.create"],
                permissions["agent.read"],
                permissions["agent.update"],
                permissions["agent.execute"],
                permissions["tools.use"],
                permissions["data.read"],
                permissions["system.monitor"]
            ]),
            
            "admin": Role("admin", "Administrative access", [
                permissions["agent.create"],
                permissions["agent.read"],
                permissions["agent.update"],
                permissions["agent.delete"],
                permissions["agent.execute"],
                permissions["tools.use"],
                permissions["tools.manage"],
                permissions["data.read"],
                permissions["data.write"],
                permissions["data.admin"],
                permissions["system.monitor"],
                permissions["system.admin"],
                permissions["system.audit"]
            ]),
            
            "operator": Role("operator", "Operations access", [
                permissions["agent.read"],
                permissions["agent.execute"],
                permissions["tools.use"],
                permissions["data.read"],
                permissions["system.monitor"]
            ])
        }
        
        # Register roles and permissions
        for permission in permissions.values():
            self.rbac_manager.register_permission(permission)
        
        for role in roles.values():
            self.rbac_manager.register_role(role)
    
    async def check_permission(self, user_id, permission_name, resource=None):
        """Check if user has specific permission."""
        
        try:
            # Get user roles
            user_roles = await self.get_user_roles(user_id)
            
            # Check each role for permission
            for role in user_roles:
                if await self.rbac_manager.role_has_permission(role, permission_name):
                    # Additional resource-specific checks
                    if resource:
                        return await self.check_resource_access(user_id, resource, permission_name)
                    return True
            
            return False
            
        except Exception as e:
            # Log permission check failure
            await self.audit_logger.log_event({
                "action": "permission_check_failed",
                "user_id": user_id,
                "permission": permission_name,
                "resource": resource,
                "error": str(e)
            })
            
            return False
    
    async def check_resource_access(self, user_id, resource, permission_name):
        """Check resource-specific access permissions."""
        
        # Resource ownership check
        if resource.get("owner_id") == user_id:
            return True
        
        # Team/group access check
        user_groups = await self.get_user_groups(user_id)
        resource_groups = resource.get("allowed_groups", [])
        
        if any(group in resource_groups for group in user_groups):
            return True
        
        # Organization-level access check
        user_org = await self.get_user_organization(user_id)
        resource_org = resource.get("organization_id")
        
        if user_org == resource_org and permission_name in ["agent.read", "data.read"]:
            return True
        
        return False
    
    async def assign_role(self, user_id, role_name, scope=None):
        """Assign role to user with optional scope."""
        
        # Validate role exists
        role = await self.rbac_manager.get_role(role_name)
        if not role:
            raise ValueError(f"Role '{role_name}' does not exist")
        
        # Create role assignment
        assignment = {
            "user_id": user_id,
            "role_name": role_name,
            "scope": scope,  # Optional: project, organization, etc.
            "assigned_at": datetime.utcnow(),
            "assigned_by": "system"  # Or actual admin user ID
        }
        
        await self.rbac_manager.assign_role(assignment)
        
        # Log role assignment
        await self.audit_logger.log_event({
            "action": "role_assigned",
            "user_id": user_id,
            "role": role_name,
            "scope": scope
        })
    
    async def revoke_role(self, user_id, role_name, scope=None):
        """Revoke role from user."""
        
        await self.rbac_manager.revoke_role(user_id, role_name, scope)
        
        # Log role revocation
        await self.audit_logger.log_event({
            "action": "role_revoked",
            "user_id": user_id,
            "role": role_name,
            "scope": scope
        })
```

### 2. 🔐 Attribute-Based Access Control (ABAC)

Implement fine-grained ABAC for complex scenarios.

```python
from google.adk.auth import ABACEngine, Policy, Attribute

class AgentABACSystem:
    def __init__(self):
        self.abac_engine = ABACEngine()
        self.setup_policies()
    
    def setup_policies(self):
        """Setup ABAC policies for agent access."""
        
        policies = [
            # Time-based access policy
            Policy(
                name="business_hours_access",
                description="Allow access only during business hours",
                condition="""
                    current_time >= "09:00" AND 
                    current_time <= "17:00" AND 
                    day_of_week NOT IN ["saturday", "sunday"]
                """,
                effect="allow",
                resources=["agent.*"],
                actions=["execute", "read"]
            ),
            
            # Location-based access policy
            Policy(
                name="office_location_access",
                description="Allow access only from office locations",
                condition="""
                    user.location.country IN ["US", "CA", "UK"] AND
                    user.location.ip_range IN office_ip_ranges
                """,
                effect="allow",
                resources=["sensitive_agent.*"],
                actions=["*"]
            ),
            
            # Department-based access policy
            Policy(
                name="department_data_access",
                description="Users can only access their department's data",
                condition="""
                    user.department == resource.department OR
                    user.role == "admin" OR
                    user.department == "IT"
                """,
                effect="allow",
                resources=["data.*"],
                actions=["read", "write"]
            ),
            
            # Confidentiality-based access policy
            Policy(
                name="confidential_data_access",
                description="Only senior staff can access confidential data",
                condition="""
                    resource.classification == "confidential" AND
                    user.clearance_level >= "senior" AND
                    user.training.security_awareness == "current"
                """,
                effect="allow",
                resources=["data.confidential.*"],
                actions=["read"]
            ),
            
            # Agent execution limits policy
            Policy(
                name="agent_execution_limits",
                description="Limit agent execution based on user tier",
                condition="""
                    (user.tier == "basic" AND action.execution_cost <= 100) OR
                    (user.tier == "premium" AND action.execution_cost <= 1000) OR
                    user.tier == "enterprise"
                """,
                effect="allow",
                resources=["agent.*"],
                actions=["execute"]
            )
        ]
        
        # Register policies
        for policy in policies:
            self.abac_engine.add_policy(policy)
    
    async def evaluate_access(self, user_id, action, resource, context=None):
        """Evaluate access using ABAC policies."""
        
        try:
            # Gather attributes
            attributes = await self.gather_attributes(user_id, resource, context)
            
            # Evaluate policies
            decision = await self.abac_engine.evaluate(
                subject_attributes=attributes["user"],
                action_attributes=attributes["action"],
                resource_attributes=attributes["resource"],
                environment_attributes=attributes["environment"]
            )
            
            # Log access decision
            await self.audit_logger.log_event({
                "action": "abac_evaluation",
                "user_id": user_id,
                "requested_action": action,
                "resource": resource,
                "decision": decision.effect,
                "policies_applied": decision.policies_applied,
                "attributes_used": attributes
            })
            
            return decision
            
        except Exception as e:
            # Log evaluation error
            await self.audit_logger.log_event({
                "action": "abac_evaluation_error",
                "user_id": user_id,
                "error": str(e)
            })
            
            # Fail secure - deny access on error
            return ABACDecision(effect="deny", reason="evaluation_error")
    
    async def gather_attributes(self, user_id, resource, context):
        """Gather attributes for ABAC evaluation."""
        
        # User attributes
        user = await self.user_store.get(user_id)
        user_attributes = {
            "id": user["id"],
            "email": user["email"],
            "department": user["department"],
            "role": user["role"],
            "tier": user["tier"],
            "clearance_level": user.get("clearance_level", "basic"),
            "location": await self.get_user_location(user_id),
            "training": await self.get_user_training_status(user_id)
        }
        
        # Resource attributes
        resource_attributes = {
            "id": resource.get("id"),
            "type": resource.get("type"),
            "classification": resource.get("classification", "public"),
            "department": resource.get("department"),
            "owner_id": resource.get("owner_id"),
            "sensitivity": resource.get("sensitivity", "low")
        }
        
        # Action attributes
        action_attributes = {
            "type": context.get("action_type"),
            "execution_cost": context.get("execution_cost", 0),
            "data_access_level": context.get("data_access_level", "read"),
            "tool_usage": context.get("tool_usage", [])
        }
        
        # Environment attributes
        environment_attributes = {
            "current_time": datetime.utcnow().strftime("%H:%M"),
            "day_of_week": datetime.utcnow().strftime("%A").lower(),
            "ip_address": context.get("ip_address"),
            "user_agent": context.get("user_agent"),
            "session_age": context.get("session_age"),
            "security_level": context.get("security_level", "standard")
        }
        
        return {
            "user": user_attributes,
            "resource": resource_attributes,
            "action": action_attributes,
            "environment": environment_attributes
        }
```

---

## 🔒 Security Middleware

### 1. 🛡️ Authentication Middleware

Implement authentication middleware for agent requests.

```python
from google.adk.middleware import AuthenticationMiddleware
from google.adk.security import SecurityContext

class AgentAuthMiddleware(AuthenticationMiddleware):
    def __init__(self, auth_manager, rbac_system):
        self.auth_manager = auth_manager
        self.rbac_system = rbac_system
        super().__init__()
    
    async def authenticate_request(self, request):
        """Authenticate incoming request."""
        
        try:
            # Extract authentication credentials
            auth_header = request.headers.get("Authorization")
            api_key = request.headers.get("X-API-Key")
            session_token = request.cookies.get("session_token")
            
            if auth_header:
                # Handle Bearer token authentication
                if auth_header.startswith("Bearer "):
                    token = auth_header[7:]
                    return await self.validate_bearer_token(token)
                
            elif api_key:
                # Handle API key authentication
                return await self.validate_api_key(api_key)
                
            elif session_token:
                # Handle session token authentication
                return await self.validate_session_token(session_token)
            
            else:
                # No authentication provided
                raise AuthenticationError("No authentication credentials provided")
                
        except Exception as e:
            await self.log_authentication_failure(request, str(e))
            raise
    
    async def validate_bearer_token(self, token):
        """Validate JWT bearer token."""
        
        try:
            # Decode and validate JWT
            payload = await self.auth_manager.validate_jwt(token)
            
            # Extract user information
            user_id = payload["sub"]
            scopes = payload.get("scopes", [])
            
            # Create security context
            return SecurityContext(
                user_id=user_id,
                authentication_method="jwt",
                scopes=scopes,
                token_payload=payload
            )
            
        except Exception as e:
            raise AuthenticationError(f"Invalid bearer token: {str(e)}")
    
    async def validate_api_key(self, api_key):
        """Validate API key."""
        
        validation_result = await self.auth_manager.validate_api_key(api_key)
        
        if not validation_result["valid"]:
            raise AuthenticationError("Invalid API key")
        
        return SecurityContext(
            user_id=validation_result["user_id"],
            authentication_method="api_key",
            permissions=validation_result["permissions"],
            metadata=validation_result["metadata"]
        )
    
    async def validate_session_token(self, session_token):
        """Validate session token."""
        
        session = await self.auth_manager.get_session(session_token)
        
        if not session or session["expires_at"] < datetime.utcnow():
            raise AuthenticationError("Invalid or expired session")
        
        return SecurityContext(
            user_id=session["user_id"],
            authentication_method="session",
            session_data=session
        )
    
    async def authorize_request(self, security_context, request):
        """Authorize request based on security context."""
        
        # Extract requested action and resource
        action = self.extract_action(request)
        resource = self.extract_resource(request)
        
        # Check permissions
        has_permission = await self.rbac_system.check_permission(
            user_id=security_context.user_id,
            permission_name=action,
            resource=resource
        )
        
        if not has_permission:
            raise AuthorizationError(f"Access denied for action: {action}")
        
        # Add authorization context to request
        request.security_context = security_context
        
        return True
    
    def extract_action(self, request):
        """Extract the requested action from the request."""
        
        method = request.method.lower()
        path = request.path
        
        # Map HTTP methods and paths to permissions
        if path.startswith("/agents/"):
            if method == "get":
                return "agent.read"
            elif method == "post":
                return "agent.create"
            elif method in ["put", "patch"]:
                return "agent.update"
            elif method == "delete":
                return "agent.delete"
        
        elif path.startswith("/agents/") and path.endswith("/execute"):
            return "agent.execute"
        
        elif path.startswith("/tools/"):
            return "tools.use"
        
        # Default fallback
        return "system.access"
    
    def extract_resource(self, request):
        """Extract resource information from the request."""
        
        path_parts = request.path.strip("/").split("/")
        
        if len(path_parts) >= 2:
            resource_type = path_parts[0]
            resource_id = path_parts[1]
            
            return {
                "type": resource_type,
                "id": resource_id,
                "path": request.path
            }
        
        return {"type": "system", "path": request.path}
```

### 2. 🔐 Rate Limiting & Throttling

Implement rate limiting to prevent abuse.

```python
from google.adk.middleware import RateLimitingMiddleware
from google.adk.cache import RedisCache
import asyncio

class AgentRateLimiter(RateLimitingMiddleware):
    def __init__(self, redis_client):
        self.cache = RedisCache(redis_client)
        self.rate_limits = {
            "api_key": {
                "requests_per_minute": 100,
                "requests_per_hour": 1000,
                "requests_per_day": 10000
            },
            "oauth": {
                "requests_per_minute": 200,
                "requests_per_hour": 5000,
                "requests_per_day": 50000
            },
            "session": {
                "requests_per_minute": 60,
                "requests_per_hour": 1000,
                "requests_per_day": 5000
            }
        }
    
    async def check_rate_limit(self, security_context, request):
        """Check if request exceeds rate limits."""
        
        user_id = security_context.user_id
        auth_method = security_context.authentication_method
        
        # Get rate limits for authentication method
        limits = self.rate_limits.get(auth_method, self.rate_limits["api_key"])
        
        # Check each time window
        for window, limit in limits.items():
            if await self.is_rate_limited(user_id, window, limit):
                raise RateLimitExceededError(
                    f"Rate limit exceeded for {window}: {limit}"
                )
    
    async def is_rate_limited(self, user_id, window, limit):
        """Check if user is rate limited for specific window."""
        
        # Create cache key
        cache_key = f"rate_limit:{user_id}:{window}"
        
        # Get current count
        current_count = await self.cache.get(cache_key) or 0
        
        if current_count >= limit:
            return True
        
        # Increment counter
        pipe = self.cache.pipeline()
        pipe.incr(cache_key)
        
        # Set expiration based on window
        if window == "requests_per_minute":
            pipe.expire(cache_key, 60)
        elif window == "requests_per_hour":
            pipe.expire(cache_key, 3600)
        elif window == "requests_per_day":
            pipe.expire(cache_key, 86400)
        
        await pipe.execute()
        
        return False
    
    async def apply_throttling(self, security_context, request):
        """Apply throttling based on current load."""
        
        # Get current system load
        system_load = await self.get_system_load()
        
        if system_load > 0.8:  # High load
            # Apply aggressive throttling
            delay = min(2.0, (system_load - 0.8) * 10)
            await asyncio.sleep(delay)
        
        elif system_load > 0.6:  # Medium load
            # Apply moderate throttling
            delay = (system_load - 0.6) * 5
            await asyncio.sleep(delay)
    
    async def get_system_load(self):
        """Get current system load metrics."""
        
        # This would integrate with your monitoring system
        # For example, CPU usage, memory usage, active connections
        
        # Placeholder implementation
        import psutil
        cpu_percent = psutil.cpu_percent()
        memory_percent = psutil.virtual_memory().percent
        
        # Combine metrics for overall load score
        load_score = max(cpu_percent, memory_percent) / 100
        
        return load_score
```

---

## ✅ Best Practices

### 1. **Authentication Strategy**
- Use strong authentication methods (OAuth 2.0, JWT)
- Implement multi-factor authentication for sensitive access
- Regular rotation of API keys and secrets
- Secure storage of authentication credentials
- Comprehensive audit logging

### 2. **Authorization Design**
- Implement principle of least privilege
- Use both RBAC and ABAC as appropriate
- Regular review and cleanup of permissions
- Attribute-based policies for complex scenarios
- Resource-level access controls

### 3. **Security Implementation**
- Input validation and sanitization
- Rate limiting and throttling
- Secure communication (HTTPS/TLS)
- Protection against common attacks (CSRF, XSS, injection)
- Regular security assessments

### 4. **Monitoring & Compliance**
- Comprehensive audit logging
- Real-time security monitoring
- Compliance with regulations (GDPR, HIPAA, SOX)
- Regular security reviews and updates
- Incident response procedures

---

> **🔐 Next Steps**: Explore [Data Protection](data-protection.md) to learn about securing sensitive data in your agent systems!