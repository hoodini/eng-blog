---
title: "Why I Switched to Custom AWS Infra"
date: "2025-12-01"
excerpt: "Vercel is great, but when you're running heavy inference, you need the raw power and cost control of AWS."
coverImage: "https://placehold.co/1200x630/f56300/ffffff?text=AWS+Infra"
tags: ["AWS", "Infrastructure"]
author: "Yuval Avidani"
---

## When Serverless Stops Being the Answer (And What Comes Next)

Vercel is phenomenal. I mean it - the developer experience is best-in-class, deployment is magical, and for 90% of web applications, it's the right choice. But I hit the 10% edge case: building an AI agent platform that runs long-running inference workloads, maintains WebSocket connections for hours, and processes GPU-intensive vision tasks. Serverless hit its limits, and I had to go deeper into the infrastructure stack.

This matters to developers because we're increasingly building applications that don't fit the "stateless request-response" model. AI agents that think for 10 minutes on complex tasks. Real-time collaborative editing. Live data processing pipelines. WebSocket-heavy applications. Serverless was designed for HTTP APIs, not persistent processes. Understanding when and how to break out of the serverless paradigm is becoming a core skill.

## The Specific Problems Serverless Couldn't Solve

Let me be concrete about what broke:

### 1. Execution Time Limits

**The Problem:**
Vercel serverless functions: 10-second timeout (Hobby), 60-second timeout (Pro), 300-second max (Enterprise).

**My Use Case:**
AI agent running a multi-step research task - fetch documents, analyze with LLM, synthesize findings, generate report. Total execution time: 3-15 minutes depending on complexity.

**What Broke:**
```typescript
// This works on Vercel
export default async function handler(req: Request) {
  const summary = await quickSummarize(req.body.text);  // 5 seconds
  return Response.json({ summary });
}

// This times out
export default async function handler(req: Request) {
  const research = await deepResearch(req.body.topic);  // 8 minutes
  return Response.json({ research });  // ❌ Function timeout after 5 minutes
}
```

Workarounds exist (queue + polling, streaming responses, background jobs), but they add complexity and fragility.

### 2. WebSocket Persistence

**The Problem:**
Serverless functions are stateless and short-lived. WebSockets require persistent connections.

**My Use Case:**
Real-time agent status updates - client connects via WebSocket, receives streaming thoughts from agent as it works, maintains connection for duration of task (5-30 minutes).

**What Broke:**
```typescript
// This doesn't work on Vercel Edge
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  // Connection would be terminated after function execution
  agent.on('progress', (update) => {
    ws.send(JSON.stringify(update));  // ❌ Connection dies when function completes
  });
});
```

Vercel doesn't support long-lived WebSocket connections. You need a persistent server process.

### 3. Cost Unpredictability at Scale

**The Problem:**
Serverless pricing is per-request and per-GB-second. For high-frequency, compute-intensive workloads, costs scale linearly (or worse) with usage.

**My Use Case:**
Running local LLM inference (Llama 3 70B) for privacy-sensitive tasks. Each request needs 40GB RAM and 30-120 seconds of processing.

**Cost Math:**
- Vercel Pro: ~$0.0002 per request-second + RAM costs
- 1000 inference requests/day × 60 seconds avg × $0.0002 = $12/day base
- Plus RAM (40GB): 1000 × 60 × 40GB × $0.000012 = $28.8/day
- **Total: ~$1,200/month** for just compute

Compare to dedicated AWS instance:
- g5.2xlarge (GPU instance, 24GB VRAM, 32GB RAM): ~$1.20/hour
- Running 24/7: $864/month
- **Can handle unlimited requests within capacity**

For high-throughput, the dedicated instance wins.

### 4. Custom Runtime Requirements

**The Problem:**
Serverless environments provide standard runtimes (Node.js, Python, Go). Custom system dependencies, GPU drivers, or specific binary tools are difficult or impossible.

**My Use Case:**
Running vision models that require CUDA, specific PyTorch versions, custom compiled libraries for optimal inference.

**What Broke:**
```dockerfile
# This level of customization doesn't work in Vercel functions
FROM nvidia/cuda:12.1-runtime-ubuntu22.04
RUN apt-get install -y libvips ffmpeg
RUN pip install torch==2.2.0+cu121 --index-url https://download.pytorch.org/whl/cu121
COPY custom_compiled_lib.so /usr/local/lib/
```

Serverless platforms abstract away the runtime - which is usually good, but becomes a constraint for specialized workloads.

## The Solution: AWS ECS with Fargate

After evaluating options (ECS, EKS, Lambda with extensions, Google Cloud Run), I landed on **AWS ECS with Fargate** for this specific use case.

**Why ECS:**
- Full control over Docker containers (custom runtimes, dependencies)
- Persistent services (long-running processes, WebSockets)
- Predictable pricing (pay for vCPU/RAM hours, not per-request)
- Auto-scaling based on actual metrics
- Integrated with AWS ecosystem (ALB, CloudWatch, Secrets Manager)

**Why Fargate over EC2:**
- No server management (Fargate is serverless containers)
- Pay-per-use (only when tasks are running)
- Automatic scaling without managing EC2 instances
- Security (no SSH access needed, less attack surface)

### The Architecture

```
┌─────────────────┐
│ Application     │
│ Load Balancer   │  ← Public HTTPS endpoint
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Target   │
    │ Groups   │  ← Health checks, routing
    └────┬─────┘
         │
┌────────▼──────────┐
│ ECS Fargate Tasks │
│ ┌───────────────┐ │
│ │  Container 1  │ │ ← Agent service (persistent)
│ │  Container 2  │ │ ← Worker service (auto-scale)
│ │  Container 3  │ │ ← WebSocket server
│ └───────────────┘ │
└───────────────────┘
```

### The Implementation

**1. Dockerfile for the Service**

```dockerfile
FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies for AI workloads
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Install Node dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose ports
EXPOSE 3000 8080

# Start application
CMD ["node", "server.js"]
```

**2. ECS Task Definition (Terraform)**

```hcl
resource "aws_ecs_task_definition" "agent_service" {
  family                   = "ai-agent-service"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = "4096"   # 4 vCPU
  memory                  = "16384"  # 16 GB RAM
  
  execution_role_arn = aws_iam_role.ecs_execution_role.arn
  task_role_arn      = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "agent-service"
      image = "your-ecr-repo/agent-service:latest"
      
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        },
        {
          containerPort = 8080  # WebSocket
          protocol      = "tcp"
        }
      ]
      
      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "OLLAMA_HOST", value = "http://localhost:11434" }
      ]
      
      secrets = [
        {
          name      = "OPENAI_API_KEY"
          valueFrom = aws_secretsmanager_secret.openai_key.arn
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/agent-service"
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}
```

**3. ECS Service with Auto-Scaling**

```hcl
resource "aws_ecs_service" "agent_service" {
  name            = "agent-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.agent_service.arn
  desired_count   = 2  # Min 2 tasks for availability
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.agent_service.arn
    container_name   = "agent-service"
    container_port   = 3000
  }
}

# Auto-scaling based on CPU
resource "aws_appautoscaling_target" "agent_service" {
  max_capacity       = 10
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.agent_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "agent_service_cpu" {
  name               = "agent-service-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.agent_service.resource_id
  scalable_dimension = aws_appautoscaling_target.agent_service.scalable_dimension
  service_namespace  = aws_appautoscaling_target.agent_service.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value       = 70.0
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}
```

**4. Application Load Balancer**

```hcl
resource "aws_lb" "main" {
  name               = "agent-service-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
}

resource "aws_lb_target_group" "agent_service" {
  name        = "agent-service-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"  # Required for Fargate

  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 60
    interval            = 120
    matcher             = "200"
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate.main.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.agent_service.arn
  }
}
```

## The Migration Weekend (and What Broke)

Migrating from Vercel to AWS was **not trivial**. Here's what I learned:

### Networking is Hard

Setting up VPCs, subnets (public/private), NAT gateways, route tables, security groups - this is infrastructure complexity that Vercel abstracts away. I spent 4 hours debugging "why can't my tasks pull from ECR" (answer: private subnet needs NAT gateway for internet access).

```hcl
# The networking setup that took 4 hours to get right
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
}

# NAT Gateway for private subnets to access internet (ECR, etc.)
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id
}
```

### IAM Roles and Permissions

ECS requires two types of IAM roles:
- **Execution Role**: Allows ECS to pull images, write logs, fetch secrets
- **Task Role**: Allows your application code to access AWS services

I spent 2 hours on "access denied pulling from ECR" before realizing my execution role was missing `ecr:GetAuthorizationToken`.

### Logging and Monitoring

With Vercel, logs are automatic and searchable. With ECS, you need to configure CloudWatch, set up log groups, manage retention, and build dashboards.

```typescript
// Application-side structured logging for CloudWatch Insights
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()  // CloudWatch captures stdout
  ]
});

logger.info('Agent task started', {
  taskId: taskId,
  userId: userId,
  model: 'gpt-4'
});
```

Then query in CloudWatch Insights:
```
fields @timestamp, taskId, model, @message
| filter @message like /Agent task started/
| stats count() by model
```

## Cost Comparison: 3 Months of Real Data

**Before (Vercel Pro + external compute for AI):**
- Vercel Pro plan: $20/month
- Modal.com GPU hours for inference: $800-1200/month
- Upstash Redis: $40/month
- **Total: ~$900/month**

**After (AWS ECS + self-hosted inference):**
- 2x g5.2xlarge Fargate tasks (GPU, 24/7): ~$1,728/month
- Application Load Balancer: $25/month
- NAT Gateway: $45/month
- Data transfer: $30/month
- CloudWatch: $15/month
- **Total: ~$1,843/month**

Wait, that's more expensive! But here's the key: **unlimited usage within capacity**. On Vercel + Modal, I was rate-limiting users to control costs. On AWS, I can handle 10x more traffic for the same $1,843.

**Usage Scaling:**
- **At current usage (1000 inferences/day):** AWS costs more
- **At 5000 inferences/day:** Break-even
- **At 10,000+ inferences/day:** AWS is 60% cheaper

Plus: full control over runtime, no timeout limits, native WebSocket support, custom optimizations.

## When To Choose What

After this experience, here's my decision matrix:

**Choose Vercel (or similar serverless) when:**
- Request-response HTTP APIs (most web apps)
- Execution time under 30 seconds
- Unpredictable or spiky traffic (serverless handles this well)
- Stateless operations
- You want minimal DevOps overhead
- Team is small, wants to focus on features not infrastructure

**Choose AWS ECS/Fargate when:**
- Long-running processes (minutes to hours)
- WebSocket or persistent connections
- Custom runtime requirements (specific libraries, GPU, system tools)
- Predictable baseline traffic (dedicated instances are cost-effective)
- Need fine-grained control over environment
- Team has infrastructure expertise or wants to build it

**Choose Kubernetes (EKS) when:**
- Everything ECS does + multi-cloud portability
- Complex orchestration requirements
- Large team with k8s expertise
- Need advanced scheduling, batch jobs, sophisticated networking

## My Honest Take

Migrating from Vercel to AWS was painful. A weekend project became a week project. I debugged networking, fought with IAM policies, learned Terraform, set up monitoring dashboards, and questioned my life choices.

But it was the right move for my specific use case. I now have:
- ✅ Unlimited execution time for agent tasks
- ✅ Native WebSocket support for real-time updates
- ✅ Full control over GPU inference runtime
- ✅ Predictable costs at scale
- ✅ Custom optimizations (shared model loading, connection pooling)

The trade-off: I'm now responsible for infrastructure. Security updates, scaling policies, networking, monitoring - all on me. Vercel abstracts this away beautifully, which is why most projects should stay there.

**Bottom line:** Serverless is amazing until it isn't. When you hit the edge cases (long execution, WebSockets, custom runtime, cost at scale), moving to container orchestration is the next evolution. It's more complex, but it unlocks capabilities that serverless fundamentally can't provide.

Start with Vercel. Graduate to AWS when you have to, not because it's trendy. And when you do migrate, block out a week, learn Terraform, and embrace the infrastructure complexity - it's worth it for the right workloads.

The future isn't "serverless wins" or "containers win." It's knowing which tool to use for which job.
