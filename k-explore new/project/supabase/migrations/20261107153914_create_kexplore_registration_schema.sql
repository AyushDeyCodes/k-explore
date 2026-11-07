/*
# K Explore: registrations, favourites and contact messages

Plain-English summary: this sets up the storage behind K Explore's registration
flow. Visitors have no sign-in, so each browser gets a private random "owner token".
Every read or write goes through a small set of database functions that check
the token, the registration deadline, seat capacity and duplicate emails.

1. New Tables
- event_settings: seat capacity and registration deadline for each sample event (seeded with the 20 events).
- registrations: one row per registration, with a readable ID (KE-XXXXXXXX), participant details,
  status (confirmed or cancelled) and the owner token of the browser that registered.
- favourites: events a browser has saved, keyed by owner token.
- contact_messages: messages sent from the Contact page.

2. Security
- Row level security is enabled on every table.
- Browsers are blocked from reading or writing registrations, favourites and event_settings directly.
  They can only call the functions below.
- contact_messages accepts anonymous inserts (with length checks) and cannot be read back by browsers.
- Seat counts are returned as totals only, never participant details.

3. Functions
- get_event_seat_counts: confirmed registrations per event.
- register_for_event: validates deadline, capacity and duplicates, then creates the registration.
- cancel_registration: cancels a registration owned by the caller's token.
- list_my_registrations: lists registrations owned by the caller's token.
- list_my_favourites / set_favourite: read and save favourites for the caller's token.

4. Important notes
1. The owner token is a random 36-character identifier stored only in the visitor's browser.
2. Phone numbers are stored as 10-digit Indian mobile numbers (starting 6-9).
3. Migration is idempotent: safe to re-run.
*/

CREATE TABLE IF NOT EXISTS event_settings (
  event_id text PRIMARY KEY,
  capacity integer NOT NULL CHECK (capacity > 0),
  registration_deadline timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS registrations (
  id text PRIMARY KEY,
  event_id text NOT NULL REFERENCES event_settings(event_id) ON DELETE CASCADE,
  owner_token text NOT NULL CHECK (char_length(owner_token) BETWEEN 16 AND 80),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254 AND position('@' IN email) > 1),
  phone text NOT NULL CHECK (phone ~ '^[6-9][0-9]{9}$'),
  organization text CHECK (organization IS NULL OR char_length(organization) <= 120),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS registrations_one_active_per_email
  ON registrations (event_id, lower(email)) WHERE status = 'confirmed';
CREATE INDEX IF NOT EXISTS registrations_owner_token_idx ON registrations (owner_token);

CREATE TABLE IF NOT EXISTS favourites (
  owner_token text NOT NULL CHECK (char_length(owner_token) BETWEEN 16 AND 80),
  event_id text NOT NULL REFERENCES event_settings(event_id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (owner_token, event_id)
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 254 AND position('@' IN email) > 1),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON event_settings FROM anon, authenticated;
REVOKE ALL ON registrations FROM anon, authenticated;
REVOKE ALL ON favourites FROM anon, authenticated;
REVOKE ALL ON contact_messages FROM anon, authenticated;

GRANT INSERT ON contact_messages TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

INSERT INTO event_settings (event_id, capacity, registration_deadline) VALUES
  ('evt-01', 600, '2026-12-03T23:59:00+05:30'),
  ('evt-02', 2000, '2026-12-15T23:59:00+05:30'),
  ('evt-03', 300, '2027-01-10T23:59:00+05:30'),
  ('evt-04', 800, '2026-12-10T23:59:00+05:30'),
  ('evt-05', 5000, '2027-01-07T23:59:00+05:30'),
  ('evt-06', 250, '2026-11-26T23:59:00+05:30'),
  ('evt-07', 40, '2026-12-05T23:59:00+05:30'),
  ('evt-08', 180, '2026-12-15T23:59:00+05:30'),
  ('evt-09', 3000, '2027-02-01T23:59:00+05:30'),
  ('evt-10', 1500, '2027-02-17T23:59:00+05:30'),
  ('evt-11', 24, '2026-11-27T23:59:00+05:30'),
  ('evt-12', 4000, '2027-01-25T23:59:00+05:30'),
  ('evt-13', 120, '2026-11-25T23:59:00+05:30'),
  ('evt-14', 1200, '2027-03-08T23:59:00+05:30'),
  ('evt-15', 150, '2026-11-21T23:59:00+05:30'),
  ('evt-16', 2500, '2027-03-28T23:59:00+05:30'),
  ('evt-17', 600, '2026-12-12T23:59:00+05:30'),
  ('evt-18', 1000, '2027-01-20T23:59:00+05:30'),
  ('evt-19', 400, '2027-03-24T23:59:00+05:30'),
  ('evt-20', 3500, '2027-05-10T23:59:00+05:30')
ON CONFLICT (event_id) DO NOTHING;

CREATE OR REPLACE FUNCTION get_event_seat_counts()
RETURNS TABLE (seat_event_id text, seat_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.event_id, count(*)
  FROM registrations r
  WHERE r.status = 'confirmed'
  GROUP BY r.event_id;
$$;

CREATE OR REPLACE FUNCTION register_for_event(
  p_event_id text,
  p_owner_token text,
  p_name text,
  p_email text,
  p_phone text,
  p_organization text
)
RETURNS registrations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_capacity integer;
  v_deadline timestamptz;
  v_taken bigint;
  v_id text;
  v_row registrations;
BEGIN
  SELECT s.capacity, s.registration_deadline
    INTO v_capacity, v_deadline
    FROM event_settings s
    WHERE s.event_id = p_event_id
    FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'EVENT_NOT_FOUND';
  END IF;

  IF now() > v_deadline THEN
    RAISE EXCEPTION 'REGISTRATION_CLOSED';
  END IF;

  IF EXISTS (
    SELECT 1 FROM registrations r
    WHERE r.event_id = p_event_id
      AND lower(r.email) = lower(p_email)
      AND r.status = 'confirmed'
  ) THEN
    RAISE EXCEPTION 'ALREADY_REGISTERED';
  END IF;

  SELECT count(*) INTO v_taken
    FROM registrations r
    WHERE r.event_id = p_event_id AND r.status = 'confirmed';

  IF v_taken >= v_capacity THEN
    RAISE EXCEPTION 'EVENT_FULL';
  END IF;

  v_id := 'KE-' || upper(substr(md5(random()::text || clock_timestamp()::text || p_email), 1, 8));

  INSERT INTO registrations (id, event_id, owner_token, name, email, phone, organization)
  VALUES (
    v_id,
    p_event_id,
    p_owner_token,
    trim(p_name),
    lower(trim(p_email)),
    p_phone,
    nullif(trim(coalesce(p_organization, '')), '')
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION cancel_registration(p_registration_id text, p_owner_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE registrations
    SET status = 'cancelled'
    WHERE id = p_registration_id
      AND owner_token = p_owner_token
      AND status = 'confirmed';
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION list_my_registrations(p_owner_token text)
RETURNS SETOF registrations
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM registrations
  WHERE owner_token = p_owner_token
  ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION list_my_favourites(p_owner_token text)
RETURNS TABLE (favourite_event_id text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT f.event_id FROM favourites f
  WHERE f.owner_token = p_owner_token
  ORDER BY f.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION set_favourite(p_owner_token text, p_event_id text, p_active boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_active THEN
    INSERT INTO favourites (owner_token, event_id)
    VALUES (p_owner_token, p_event_id)
    ON CONFLICT (owner_token, event_id) DO NOTHING;
  ELSE
    DELETE FROM favourites
    WHERE owner_token = p_owner_token AND event_id = p_event_id;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_event_seat_counts() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION register_for_event(text, text, text, text, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION cancel_registration(text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION list_my_registrations(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION list_my_favourites(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION set_favourite(text, text, boolean) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION get_event_seat_counts() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION register_for_event(text, text, text, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION cancel_registration(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION list_my_registrations(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION list_my_favourites(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION set_favourite(text, text, boolean) TO anon, authenticated;
