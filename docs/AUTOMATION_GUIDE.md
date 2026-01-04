# Automation & Deployment Guide

## 1. Connecting Make.com to the Blog

To publish posts automatically from Make.com, use the built-in API endpoint.

### Step-by-Step Make.com Setup:

1.  **Create a Scenario**: Add a new module.
2.  **Select Module**: Search for **HTTP** and select **Make a request**.
3.  **Configuration**:
    *   **URL**: `https://en-blog.yuv.ai/api/publish` (once domain is connected) OR `https://your-vercel-project.vercel.app/api/publish`
    *   **Method**: `POST`
    *   **Headers**:
        *   Name: `x-api-key`
        *   Value: `[YOUR_PUBLISH_SECRET]` (Matches the variable in Vercel)
        *   Name: `Content-Type`
        *   Value: `application/json`
    *   **Body Type**: `Raw`
    *   **Content Type**: `JSON (application/json)`
    *   **Request Content**:
        ```json
        {
          "title": "Title form previous step",
          "content": "Markdown content from previous step...",
          "excerpt": "Optional short summary",
          "tags": ["ai", "automation"],
          "coverImage": "https://example.com/image.jpg",
          "date": "2025-01-04" 
        }
        ```

### Important: Environment Variable
Ensure you have set the `PUBLISH_SECRET` environment variable in your Vercel project settings.
1.  Go to Vercel Dashboard > Project > Settings > Environment Variables.
2.  Add Key: `PUBLISH_SECRET`.
3.  Add Value: A strong random string (e.g., `7bacb71dab674a5915f497d3dd436682d4d742ab543494c62587d419c667b67a`).
4.  Redeploy the project for the change to take effect.

---

## 2. Setting up Custom Domain (en-blog.yuv.ai)

To serve the blog at `en-blog.yuv.ai`:

1.  **Vercel Dashboard**:
    *   Go to your Project > **Settings** > **Domains**.
    *   Enter `en-blog.yuv.ai` in the input field and click **Add**.

2.  **DNS Configuration** (at your Domain Registrar):
    *   Login to where you bought `yuv.ai` (e.g., GoDaddy, Namecheap, Cloudflare).
    *   Add a **CNAME Record**:
        *   **Type**: `CNAME`
        *   **Name (Host)**: `en-blog`
        *   **Value (Target)**: `cname.vercel-dns.com`
        *   **TTL**: Automatic or 3600

3.  **Verification**:
    *   Vercel will automatically verify the record. It might take a few minutes to propagate.
