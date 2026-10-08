-- Individual amounts are integer kobo; a team total may exceed a 32-bit integer.
ALTER TABLE pay_runs ALTER COLUMN total TYPE bigint USING total::bigint;
