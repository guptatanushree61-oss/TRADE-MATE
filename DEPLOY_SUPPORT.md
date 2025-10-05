# Deploy Support Flow (Edge Function + DB table)

This guide walks through deploying the secure support flow you chose: create the `support_messages` table (SQL), then deploy the Supabase Edge Function `support` (server-side insertion + optional email). Finally, configure the client to use the Edge Function.

Prereqs
- Supabase project and admin access
- Supabase CLI installed and authenticated (https://supabase.com/docs/guides/cli)
- Optional: SendGrid account (if you want server-side transactional email)

Steps

1) Create the table in Supabase

Open the SQL editor in the Supabase dashboard for your project and run the SQL in `sql/create_support_messages.sql`. Alternatively, using the Supabase CLI you can run:

```bash
# from repo root
supabase db query < sql/create_support_messages.sql
```

2) Deploy the Edge Function

Set the required environment variables for the function (set these in Supabase -> Project -> Settings -> Environment variables for Functions or via the CLI):

- `SUPABASE_URL` — your Supabase project URL (example: `https://abcd1234.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` — your service_role key (keeps write permissions safe on server)
- `SUPPORT_EMAIL` — email address where notifications will be sent (optional)
- `FROM_EMAIL` — sender email for notifications (optional)
- `SENDGRID_API_KEY` — optional; if provided, the function will attempt to send an email via SendGrid

Deploy the function with the Supabase CLI:

```bash
supabase functions deploy support --project-ref <your-project-ref>
```

You can run the function locally for testing (Supabase CLI):

```bash
# serve using env file (see example in supabase/functions/support/.env.example)
supabase functions serve support --env-file supabase/functions/support/.env.example
```

3) Configure your client (Vite) env variables

Add these variables to your `.env` (or `.env.local`) for the client and restart the dev server:

```env
# Use the Edge Function for support form submissions
VITE_USE_EDGE_FUNCTION=true
# The public origin where your functions are hosted, e.g. https://<project>.functions.supabase.co
VITE_EDGE_FUNCTION_ORIGIN=https://<project>.functions.supabase.co

# Supabase (fallback path if you choose to use client insert)
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your_anon_key>
```

4) Test

- Start your app locally (`npm run dev`).
- Visit `/help` and submit the support form. The form will POST to the Edge Function and the function will insert into `support_messages`. If SendGrid configured, an email will be attempted.
- Verify the row in Supabase Table Editor.

Notes
- The function uses the Service Role key — keep this secret and only set it in the server/Functions environment. Do not commit it to the repo.
- If you prefer another email provider, you can replace the SendGrid block in `supabase/functions/support/index.ts` with your provider's API call.

Assistant Edge Function
-----------------------
If you want an AI Assistant that can securely answer inventory and feature questions (e.g. "How much Rice is left?"), there's a small Edge Function scaffold at `supabase/functions/assistant/index.ts` and a client page at `src/pages/Assistant.tsx`.

Steps:
- Create the `products` table by running `sql/create_products.sql` in the Supabase SQL editor or via CLI (`supabase db query < sql/create_products.sql`).
- Deploy the function with the Supabase CLI:

```bash
supabase functions deploy assistant --project-ref <your-project-ref>
```

- Set environment variables for the function:
	- `SUPABASE_URL` (your project URL)
	- `SUPABASE_SERVICE_ROLE_KEY` (service role key)

- On the client, set:
	- `VITE_USE_EDGE_FUNCTION=true`
	- `VITE_EDGE_FUNCTION_ORIGIN=https://<project>.functions.supabase.co`

Once deployed, visit `/assistant` in the app (must be authenticated) and ask questions. The client will POST the user query to the Edge Function which will run secure DB queries using the service role key and return an answer.

Connecting the Assistant to your Supabase project
------------------------------------------------
1) Set environment variables for the function in the Supabase dashboard
	 - Open your Supabase project → Settings → Environment variables (Functions) → Add variables
	 - Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (paste the value of the service_role key from Project Settings → API)
	 - Optionally add `OPENAI_API_KEY` if you want the function to call OpenAI

2) Deploy the function (example):

```bash
supabase functions deploy assistant --project-ref <your-project-ref>
```

3) Test the function with curl (replace origin):

```bash
curl -X POST "https://<your-project>.functions.supabase.co/assistant" \
	-H "Content-Type: application/json" \
	-d '{"query":"How much Rice is left?"}'
```

4) Configure your client (Vite) envs (on local machine):

```.env.local
VITE_USE_EDGE_FUNCTION=true
VITE_EDGE_FUNCTION_ORIGIN=https://<your-project>.functions.supabase.co
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your_anon_key>
```

5) Open the app, sign in, and ask the assistant. It will POST to your deployed function and return secure DB-backed answers.
