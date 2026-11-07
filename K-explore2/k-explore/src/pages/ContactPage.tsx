import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { SectionHeader } from '@/components/SectionHeader';
import { useToast } from '@/hooks/useToast';
import { isValidEmail } from '@/lib/validation';
import { sendContactMessage } from '@/services/contactService';

interface ContactValues {
  name: string;
  email: string;
  message: string;
}
type ContactErrors = Partial<Record<keyof ContactValues, string>>;

const EMPTY: ContactValues = { name: '', email: '', message: '' };
const FIELD =
  'w-full rounded-xl border bg-base px-4 text-base text-ink placeholder:text-muted/70 transition-colors focus:outline-none focus:ring-2 focus:ring-crimson/30';

function validate(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Enter your name (at least 2 characters).';
  if (!values.email.trim()) errors.email = 'Email address is required.';
  else if (!isValidEmail(values.email.trim())) errors.email = 'Enter a valid email, for example name@example.com.';
  const message = values.message.trim();
  if (message.length < 10) errors.message = 'Tell us a little more (at least 10 characters).';
  else if (message.length > 2000) errors.message = 'Message must be 2000 characters or fewer.';
  return errors;
}

export function ContactPage() {
  const notify = useToast();
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field: keyof ContactValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSubmitting(true);
    try {
      await sendContactMessage(values);
      setSent(true);
      setValues(EMPTY);
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Your message could not be sent.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const border = (field: keyof ContactValues) =>
    errors[field] ? 'border-crimson' : 'border-line hover:border-ink/40 focus:border-crimson';

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6">
      <SectionHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about an event, a registration or the platform? Send us a note."
      />

      {sent ? (
        <div className="rounded-2xl border border-line bg-surface p-8 text-center" role="status">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-bold text-ink">Message sent</h2>
          <p className="mt-2 text-sm text-muted">Thanks for reaching out. We will get back to you soon.</p>
          <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
            Send another message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-col gap-2">
            <label htmlFor="c-name" className="text-sm font-semibold text-ink">Name</label>
            <input
              id="c-name"
              autoComplete="name"
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              aria-invalid={Boolean(errors.name)}
              className={`${FIELD} h-12 ${border('name')}`}
            />
            {errors.name && <p className="text-sm text-crimson">{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="c-email" className="text-sm font-semibold text-ink">Email</label>
            <input
              id="c-email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              aria-invalid={Boolean(errors.email)}
              className={`${FIELD} h-12 ${border('email')}`}
            />
            {errors.email && <p className="text-sm text-crimson">{errors.email}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="c-message" className="text-sm font-semibold text-ink">Message</label>
            <textarea
              id="c-message"
              rows={5}
              value={values.message}
              onChange={(e) => update('message', e.target.value)}
              aria-invalid={Boolean(errors.message)}
              className={`${FIELD} py-3 ${border('message')}`}
            />
            {errors.message && <p className="text-sm text-crimson">{errors.message}</p>}
          </div>
          <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto sm:self-end">
            Send message
          </Button>
        </form>
      )}
    </div>
  );
}
