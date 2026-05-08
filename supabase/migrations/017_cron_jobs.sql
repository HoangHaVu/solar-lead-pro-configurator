-- Migration 017: pg_cron Schedules für Edge Functions

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Bestehende Jobs entfernen falls vorhanden (idempotent)
SELECT cron.unschedule('notify-offer-expiry-daily') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'notify-offer-expiry-daily'
);
SELECT cron.unschedule('notify-payment-due-daily') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'notify-payment-due-daily'
);

-- täglich 08:00 UTC — Installateure bei ablaufenden Angeboten warnen
SELECT cron.schedule(
  'notify-offer-expiry-daily',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url     := 'https://ecsqbsgbfmvqaqnryvwf.supabase.co/functions/v1/notify-offer-expiry',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjc3Fic2diZm12cWFxbnJ5dndmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzUzMzMyOCwiZXhwIjoyMDkzMTA5MzI4fQ.LoQ1kWm2KuFNZa6az0zAiBymwf4_Brz9YDpvk5LW6sc',
      'Content-Type', 'application/json'
    ),
    body    := '{}'::jsonb
  ) AS request_id;
  $$
);

-- täglich 08:00 UTC — Kunden an fällige Zahlungen erinnern
SELECT cron.schedule(
  'notify-payment-due-daily',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url     := 'https://ecsqbsgbfmvqaqnryvwf.supabase.co/functions/v1/notify-payment-due',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjc3Fic2diZm12cWFxbnJ5dndmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzUzMzMyOCwiZXhwIjoyMDkzMTA5MzI4fQ.LoQ1kWm2KuFNZa6az0zAiBymwf4_Brz9YDpvk5LW6sc',
      'Content-Type', 'application/json'
    ),
    body    := '{}'::jsonb
  ) AS request_id;
  $$
);
