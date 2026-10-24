import { useState } from 'react';

/* =============================================================================
  useFormLang — local EN/CN toggle, independent of global LanguageContext
  Returns: { formLang, setFormLang, isFormCn, langKey }
  - formLang  → 'EN' | 'CN'
  - isFormCn  → boolean shorthand
  - langKey   → 'en' | 'cn'  (for indexing label objects)
============================================================================= */
export const useFormLang = (defaultLang = 'EN') => {
  const [formLang, setFormLang] = useState(defaultLang);
  return {
    formLang,
    setFormLang,
    isFormCn: formLang === 'CN',
    langKey: formLang === 'CN' ? 'cn' : 'en',
  };
};

/* =============================================================================
  filterSchemaByLang — filters a form schema to show only fields matching
  the selected language, plus neutral fields (no _en / _cn suffix).

  Rules:
    EN → keep fields ending in _en  + neutral fields
    CN → keep fields ending in _cn  + neutral fields
    Array sections (clip_en, clip_cn…) filtered by fieldName/key suffix.
    Sections that become empty are removed.
============================================================================= */
const hasSuffix = (name) => name.endsWith('_en') || name.endsWith('_cn');

const fieldMatchesLang = (name, formLang) => {
  if (!hasSuffix(name)) return true;
  return formLang === 'EN' ? name.endsWith('_en') : name.endsWith('_cn');
};

const sectionMatchesLang = (section, formLang) => {
  if (section.type === 'array') {
    return fieldMatchesLang(section.fieldName ?? section.key, formLang);
  }
  return true;
};

export const filterSchemaByLang = (schema, formLang) =>
  schema
    .filter((section) => sectionMatchesLang(section, formLang))
    .map((section) => {
      if (!section.fields) return section;
      return {
        ...section,
        fields: section.fields.filter((f) => fieldMatchesLang(f.name, formLang)),
      };
    })
    .filter((section) => {
      if (section.fields) return section.fields.length > 0;
      return true;
    });