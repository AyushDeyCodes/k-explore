import { supabase } from '@/lib/supabase';
import { readLocalContactMessages, writeLocalContactMessages } from '@/lib/storage';

export interface ContactMessageInput {
  name: string;
  email: string;
  message: string;
}

export async function sendContactMessage(input: ContactMessageInput): Promise<void> {
  const payload = {
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
  };

  if (!supabase) {
    writeLocalContactMessages([
      { ...payload, createdAt: new Date().toISOString() },
      ...readLocalContactMessages(),
    ]);
    return;
  }

  const { error } = await supabase.from('contact_messages').insert(payload);
  if (error) throw new Error('Your message could not be sent. Please try again in a moment.');
}
