"use client";

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Keep react-hook-form's resolver in step with a schema that changes after the
 * form mounts (admin settings arrive from /api/form-settings a few ms later).
 *
 * `useForm` only reads `resolver` at creation time, so a schema rebuilt later
 * would otherwise be ignored and a newly-required field would never fail
 * validation. RHF validates through `control._options.resolver` on every
 * submit/trigger, so pointing it at the new resolver is enough — no re-mount,
 * no lost input.
 */
export function useLiveZodResolver(form, schema) {
  useEffect(() => {
    if (!form?.control?._options) return;
    try {
      form.control._options.resolver = zodResolver(schema);
    } catch {
      /* never break the form over a resolver swap */
    }
  }, [form, schema]);
}
