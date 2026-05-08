import { supabase } from '../lib/supabase';

export interface WebhookSettings {
  installer_id: string;
  webhook_url: string;
  webhook_secret: string;
  is_active: boolean;
}

export async function fetchWebhookSettings(installerId: string): Promise<WebhookSettings | null> {
  const { data, error } = await supabase
    .from('installer_webhook_settings')
    .select('installer_id, webhook_url, webhook_secret, is_active')
    .eq('installer_id', installerId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as WebhookSettings | null;
}

export async function saveWebhookSettings(
  installerId: string,
  settings: { webhook_url: string; webhook_secret: string; is_active: boolean },
): Promise<void> {
  const { error } = await supabase
    .from('installer_webhook_settings')
    .upsert({
      installer_id: installerId,
      ...settings,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'installer_id' });
  if (error) throw new Error(error.message);
}

export async function sendTestWebhook(installerId: string): Promise<{ success: boolean; status?: number }> {
  const { data, error } = await supabase.functions.invoke('forward-lead', {
    body: { lead_id: '__test__', installer_id: installerId, is_test: true },
  });
  if (error) return { success: false };
  return { success: data?.success ?? false };
}
