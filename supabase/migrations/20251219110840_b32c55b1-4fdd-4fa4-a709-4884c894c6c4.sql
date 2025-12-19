-- Expand allowed file types for file history to match app usage
ALTER TABLE public.file_history
  DROP CONSTRAINT IF EXISTS file_history_file_type_check;

ALTER TABLE public.file_history
  ADD CONSTRAINT file_history_file_type_check
  CHECK (
    file_type = ANY (
      ARRAY[
        'document'::text,
        'document-json'::text,
        'presentation'::text,
        'spreadsheet'::text,
        'pdf'::text,
        'voiceover'::text
      ]
    )
  );