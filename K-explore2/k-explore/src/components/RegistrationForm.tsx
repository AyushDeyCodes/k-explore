import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { validateRegistrationForm, type RegistrationFormErrors, type RegistrationFormValues } from '@/lib/validation';

interface RegistrationFormProps {
  submitting: boolean;
  submitError: string | null;
  onSubmit: (values: RegistrationFormValues) => void;
}

const EMPTY_VALUES: RegistrationFormValues = { name: '', email: '', phone: '', organization: '' };

const FIELD_CLASS =
  'h-12 w-full rounded-xl border bg-base px-4 text-base text-ink placeholder:text-muted/70 transition-colors focus:outline-none focus:ring-2 focus:ring-crimson/30';

export function RegistrationForm({ submitting, submitError, onSubmit }: RegistrationFormProps) {
  const [values, setValues] = useState<RegistrationFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<RegistrationFormErrors>({});

  const update = (field: keyof RegistrationFormValues) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateRegistrationForm(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(values);
  };

  const fieldClass = (field: keyof RegistrationFormValues) =>
    `${FIELD_CLASS} ${errors[field] ? 'border-crimson' : 'border-line hover:border-ink/40 focus:border-crimson'}`;

  const errorText = (field: keyof RegistrationFormValues) =>
    errors[field] && (
      <p id={`${field}-error`} className="text-sm text-crimson">
        {errors[field]}
      </p>
    );

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6" aria-busy={submitting}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="reg-name" className="text-sm font-semibold text-ink">
            Full name <span className="text-crimson">*</span>
          </label>
          <input
            id="reg-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update('name')(e.target.value)}
            placeholder="As it should appear on your pass"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={fieldClass('name')}
          />
          {errorText('name')}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="reg-email" className="text-sm font-semibold text-ink">
            Email <span className="text-crimson">*</span>
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update('email')(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={fieldClass('email')}
          />
          {errorText('email')}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="reg-phone" className="text-sm font-semibold text-ink">
            Mobile number <span className="text-crimson">*</span>
          </label>
          <input
            id="reg-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={values.phone}
            onChange={(e) => update('phone')(e.target.value)}
            placeholder="+91 98765 43210"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={fieldClass('phone')}
          />
          {errorText('phone')}
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="reg-org" className="text-sm font-semibold text-ink">
            College or organization <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="reg-org"
            name="organization"
            autoComplete="organization"
            value={values.organization}
            onChange={(e) => update('organization')(e.target.value)}
            placeholder="Your college, company or studio"
            aria-invalid={Boolean(errors.organization)}
            className={fieldClass('organization')}
          />
          {errorText('organization')}
        </div>
      </div>

      {submitError && (
        <div role="alert" className="rounded-xl border border-crimson/40 bg-crimson/10 px-4 py-3 text-sm text-ink">
          {submitError}
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted">
          We only use your details to confirm this registration. No payment is collected here.
        </p>
        <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Confirming your seat…
            </span>
          ) : (
            'Confirm registration'
          )}
        </Button>
      </div>
    </form>
  );
}
