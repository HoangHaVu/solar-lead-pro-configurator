import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchWebhookSettings, saveWebhookSettings, sendTestWebhook } from '../services/webhookSettings';

export function useInstallerSettings() {
  const { user } = useAuth();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!user?.id) return;
    fetchWebhookSettings(user.id)
      .then((s) => {
        if (s) {
          setWebhookUrl(s.webhook_url ?? '');
          setWebhookSecret(s.webhook_secret ?? '');
          setIsActive(s.is_active ?? true);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  async function save() {
    if (!user?.id) return;
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await saveWebhookSettings(user.id, {
        webhook_url: webhookUrl,
        webhook_secret: webhookSecret,
        is_active: isActive,
      });
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }

  async function testWebhook() {
    if (!user?.id) return;
    setIsTesting(true);
    setTestStatus('idle');
    try {
      const result = await sendTestWebhook(user.id);
      setTestStatus(result.success ? 'success' : 'error');
    } catch {
      setTestStatus('error');
    } finally {
      setIsTesting(false);
      setTimeout(() => setTestStatus('idle'), 4000);
    }
  }

  return {
    webhookUrl, setWebhookUrl,
    webhookSecret, setWebhookSecret,
    isActive, setIsActive,
    isLoading, isSaving, isTesting,
    saveStatus, testStatus,
    save, testWebhook,
  };
}
