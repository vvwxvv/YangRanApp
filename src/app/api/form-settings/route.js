// app/api/form-settings/route.js
//
// Per-form field settings for the manager UI.
//
//   GET    /api/form-settings            → { data: { artwork: {...}, event: {...} } }
//   PUT    /api/form-settings            → save { formKey, layout?, sections?, fields? }
//   POST   /api/form-settings            → a form reports its own schema (discovery)
//   DELETE /api/form-settings?formKey=x  → reset that form to code defaults
//
// Auth note: this app protects the manager area with the client-side pattern
// lock; its API layer has no session concept (same as every other /api route
// here). If the caller DOES send a JWT (Authorization: Bearer / authToken
// cookie), it is validated — a forged or expired token is rejected. When the
// app grows real server auth, replace `authorize()` with the shared guard.

import { NextResponse } from 'next/server';
import { extractToken, verifyToken, getUserById } from '@/app/api/auth/_authUtils';
import {
  listFormSettings,
  saveFormSetting,
  saveDiscoveredSchema,
  resetFormSetting,
} from '@/lib/formSettingsServer';

export const dynamic = 'force-dynamic';

const NO_STORE = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

const json = (data, status = 200) =>
  new NextResponse(JSON.stringify(data), { status, headers: NO_STORE });

async function authorize(request) {
  const token = extractToken(request);
  if (!token) return null; // pattern-lock-only app: no server session to check

  const payload = verifyToken(token);
  if (!payload?.id) return json({ error: 'Unauthorized' }, 401);

  const user = await getUserById(payload.id);
  if (!user) return json({ error: 'Unauthorized' }, 401);

  return null;
}

export async function GET(request) {
  const denied = await authorize(request);
  if (denied) return denied;

  try {
    return json({ data: await listFormSettings() });
  } catch (error) {
    console.error('[api/form-settings] GET failed:', error);
    return json({ data: {}, error: 'Failed to read form settings' }, 200);
  }
}

export async function PUT(request) {
  const denied = await authorize(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    if (!body?.formKey) return json({ error: 'formKey is required' }, 400);
    const doc = await saveFormSetting(body.formKey, body);
    return json({ data: doc });
  } catch (error) {
    console.error('[api/form-settings] PUT failed:', error);
    return json({ error: 'Failed to save form settings' }, 500);
  }
}

/** Discovery: a form sends the schema it just rendered (idempotent snapshot). */
export async function POST(request) {
  const denied = await authorize(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    if (!body?.formKey || !Array.isArray(body?.sections)) {
      return json({ error: 'formKey and sections are required' }, 400);
    }
    const doc = await saveDiscoveredSchema(body.formKey, { sections: body.sections });
    return json({ data: { formKey: doc?.formKey, sections: doc?.discovered?.sections?.length || 0 } });
  } catch (error) {
    console.error('[api/form-settings] POST failed:', error);
    return json({ error: 'Failed to register form schema' }, 500);
  }
}

export async function DELETE(request) {
  const denied = await authorize(request);
  if (denied) return denied;

  try {
    const formKey = new URL(request.url).searchParams.get('formKey');
    if (!formKey) return json({ error: 'formKey is required' }, 400);
    return json({ data: await resetFormSetting(formKey) });
  } catch (error) {
    console.error('[api/form-settings] DELETE failed:', error);
    return json({ error: 'Failed to reset form settings' }, 500);
  }
}
