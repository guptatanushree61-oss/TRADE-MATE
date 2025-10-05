Deploy the `support` Edge Function to Supabase

1. Place the function code under `supabase/functions/support` (this folder).
2. Set required environment variables in Supabase for the function:
   - SUPABASE_URL (your project URL)
   - SUPABASE_SERVICE_ROLE_KEY (your service_role key)
   - SUPPORT_EMAIL (optional, where support emails are sent)
   - FROM_EMAIL (optional)
   - SENDGRID_API_KEY (optional, to send email via SendGrid)

3. Deploy with the Supabase CLI:

```bash
supabase functions deploy support --project-ref your-project-ref
```

4. In your client, set `VITE_USE_EDGE_FUNCTION=true` and `VITE_EDGE_FUNCTION_ORIGIN` to your functions origin (e.g. https://your-project.functions.supabase.co)
