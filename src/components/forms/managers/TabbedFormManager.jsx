import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Tabs, ConfigProvider } from 'antd';
import { useFieldArray } from 'react-hook-form';

import { LanguageContext } from '@/components/contexts/LanguageContext';
import { getSystemLabel } from '@/components/labels/system_labels';
import useFont from '@/hooks/useFont';
import { getFormArtistValue, shouldHideArtistField } from '@/utils/artistUtils';
import { useFormSettings, discoverFormSchema } from '@/components/forms/settings/FormSettingsContext';
import { resolveFormSchema, toDiscoveredSchema } from '@/components/forms/settings/resolveFormSchema';
import FieldsCustomizeMenu from '@/components/forms/settings/FieldsCustomizeMenu';

import FormTextField from '@/components/forms/fields/FormTextField';
import FormSelectField from '@/components/forms/fields/FormSelectField';
import FormAutoCompleteField from '@/components/forms/fields/FormAutoCompleteField';
import LanguageSelector, {
  languageOptions,
} from '@/components/forms/selectors/LanguageSelector';
import YearSelector from '@/components/forms/selectors/YearSelector';
import MultiRelationSelector from '@/components/forms/selectors/MultiRelationSelector';
import OrderFieldsDisplay from '@/components/forms/selectors/OrderFieldsDisplay';
import ArrayManager from '@/components/forms/managers/ArrayManager';
import ObjectArrayManager from '@/components/forms/managers/ObjectArrayManager';

const TabbedFormManager = ({
  form,
  schema: rawSchema = [],
  getLabelFunc,
  // Optional dedicated tab-label resolver (falls back to getLabelFunc).
  getTabLabelFunc,
  getTabLabel: getTabLabelProp,
  onFieldChange,
  colors = {},
  disabled = false,
  customRenderers = {},
  // Language is hoisted out of the tabs into the header row (next to
  // “Form settings”). Set false for a form that wants it inline instead.
  languageInHeader = true,
}) => {
  const { isCn } = useContext(LanguageContext);
  const { inputFontFamily, labelFontFamily } = useFont();
  const [activeTab, setActiveTab] = useState(() => rawSchema?.[0]?.key || '0');

  /* ── form settings: code schema + site policy + this editor's prefs ────── */
  const { formKey, settings, prefs, showAll, enabled } = useFormSettings();

  const resolved = useMemo(
    () => resolveFormSchema({ schema: rawSchema, settings, prefs, showAll }),
    [rawSchema, settings, prefs, showAll]
  );
  // `schema` below is the resolved one: hidden fields/sections are already gone.
  const schema = resolved.schema;

  /* ── Language → header row ────────────────────────────────────────────── */
  // Language is a document-level switch, not metadata: pull it out of whatever
  // tab it lives in and render it beside “Form settings”. A tab that held only
  // the language field (artwork / event “metadata”) disappears.
  const languageField = useMemo(() => {
    if (languageInHeader === false) return null;
    for (const section of schema) {
      const hit = (section.fields || []).find(
        (field) => field.type === 'language' || field.name === 'language'
      );
      if (hit) return hit;
    }
    // Language is a document-level switch: it is no longer declared inside a
    // tab, so fall back to the form value itself (forms without a language
    // field — enquiry / image / video — get no selector).
    let hasLanguage = false;
    try {
      hasLanguage = form.getValues?.('language') !== undefined;
    } catch {
      hasLanguage = false;
    }
    return hasLanguage ? { name: 'language', type: 'language' } : null;
  }, [schema, languageInHeader, form]);

  const tabSchemaSource = useMemo(() => {
    if (!languageField) return schema;
    return schema
      .map((section) =>
        Array.isArray(section.fields)
          ? {
              ...section,
              fields: section.fields.filter(
                (field) => field.name !== languageField.name
              ),
            }
          : section
      )
      .filter(
        (section) =>
          !(Array.isArray(section.fields) && section.fields.length === 0)
      );
  }, [schema, languageField]);

  // First open of a form registers its sections/fields, so the settings page
  // never needs a hard-coded registry. `discoverySig` keeps it to one POST when
  // nothing changed (section files rebuild their schema array every render).
  const discovery = useMemo(() => toDiscoveredSchema(rawSchema, isCn), [rawSchema, isCn]);
  const discoverySig = useMemo(() => JSON.stringify(discovery), [discovery]);
  useEffect(() => {
    if (!formKey || !discovery.length) return;
    discoverFormSchema(formKey, discovery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formKey, discoverySig]);

  // Keep the selected tab valid when settings hide the section it points at
  // (tabs are keyed by section key, not by index).
  useEffect(() => {
    if (!tabSchemaSource.length) return;
    if (!tabSchemaSource.some((section) => section.key === activeTab)) {
      setActiveTab(tabSchemaSource[0].key);
    }
  }, [tabSchemaSource, activeTab]);

  const hideArtist = shouldHideArtistField();
  const watchedLanguage = form.watch?.('language');
  const hasArtistField = useMemo(
    () =>
      tabSchemaSource.some((tab) =>
        tab.fields?.some((field) => field.name === 'artist')
      ),
    [tabSchemaSource]
  );

  // Artist sites: the artist field is implicit. Hide its input and keep the
  // form value in sync with APP_PERSON_EN / APP_PERSON_CN.
  useEffect(() => {
    if (!hideArtist || !hasArtistField) return;
    const language = String(
      watchedLanguage || form.getValues('language') || (isCn ? 'CN' : 'EN')
    ).toUpperCase();
    const value = getFormArtistValue('', language);
    if (value && form.getValues('artist') !== value) {
      form.setValue('artist', value, { shouldDirty: false, shouldValidate: false });
    }
  }, [hideArtist, hasArtistField, watchedLanguage, isCn, form]);

  const arrayFieldNames = useMemo(() => {
    // NOTE: use the CODE schema (`rawSchema`), never the resolved one. The
    // number of useFieldArray() calls below must not change when a section is
    // hidden by settings — that would break hook order at runtime.
    return rawSchema
      .filter(
        (tab) =>
          (tab.type === 'array' || tab.type === 'object-array') && tab.fieldName
      )
      .map((tab) => tab.fieldName);
  }, [rawSchema]);

  const fieldArraysData = {};
  arrayFieldNames.forEach((fieldName) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    fieldArraysData[fieldName] = useFieldArray({
      control: form.control,
      name: fieldName,
    });
  });

  const getLabel = (key, labelObj) => {
    // Sections may supply a fallback label (`section.label`); pass it through
    // so a tab without a dictionary entry still reads in the current language.
    if (getLabelFunc) return getLabelFunc(key, labelObj);
    if (labelObj) return labelObj[isCn ? 'cn' : 'en'];
    return getSystemLabel(key, isCn);
  };

  const paletteColor = (key, fallback) => colors?.[key] || fallback;

  const inputStyles = useMemo(
    () => ({
      fontFamily: inputFontFamily,
      color: paletteColor('text') || undefined,
      backgroundColor: paletteColor('background') || undefined,
      borderColor: paletteColor('border') || undefined,
      borderRadius: '8px',
    }),
    [colors, inputFontFamily]
  );

  // Section fields declare a `type`; language fields must be a dropdown
  // ("CN" / "EN"), and `select` fields must be a dropdown too — both used to
  // fall through to a plain text input.
  const resolveSelectOptions = (options) => {
    if (!options) return [];
    if (typeof options === 'string') {
      if (options === 'languageOptions') {
        return languageOptions.map((option) => ({
          value: option.value,
          label: isCn ? option.label_cn : option.label_en,
        }));
      }
      return [];
    }
    return (Array.isArray(options) ? options : []).map((option) =>
      option && typeof option === 'object'
        ? { value: option.value ?? option.label, label: option.label ?? option.value }
        : { value: option, label: String(option) }
    );
  };

  const renderFieldInput = (meta) => {
    const label = getLabel(meta.name, meta.label);

    // Language → shared dropdown (EN / CN), same component everywhere.
    if (meta.type === 'language' || meta.name === 'language') {
      return (
        <LanguageSelector
          key={meta.name}
          form={form}
          name={meta.name}
          disabled={disabled}
          colors={colors}
          isCn={isCn}
          getLabel={(key) =>
            key === 'languagePlaceholder'
              ? isCn
                ? '选择语言'
                : 'Select language...'
              : label
          }
          onFieldChange={() => onFieldChange?.(meta.name)}
        />
      );
    }

    // Year → simple single-value dropdown 1980 … current year.
    if (meta.type === 'year' || (meta.name === 'year' && meta.options !== false)) {
      return (
        <YearSelector
          key={meta.name}
          form={form}
          name={meta.name}
          disabled={disabled}
          colors={colors}
          isCn={isCn}
          getLabel={() => label}
          onFieldChange={() => onFieldChange?.(meta.name)}
        />
      );
    }

    if (meta.type === 'autocomplete') {
      return (
        <FormAutoCompleteField
          key={meta.name}
          name={meta.name}
          label={label}
          control={form.control}
          error={form.formState.errors[meta.name]}
          disabled={disabled}
          options={resolveSelectOptions(meta.options)}
          colors={colors}
          labelFontFamily={labelFontFamily}
          inputStyles={inputStyles}
          onChange={() => onFieldChange?.(meta.name)}
        />
      );
    }

    if (meta.type === 'select') {
      return (
        <FormSelectField
          key={meta.name}
          name={meta.name}
          label={label}
          control={form.control}
          error={form.formState.errors[meta.name]}
          disabled={disabled}
          options={resolveSelectOptions(meta.options)}
          colors={colors}
          labelFontFamily={labelFontFamily}
          inputStyles={inputStyles}
          onChange={() => onFieldChange?.(meta.name)}
        />
      );
    }

    return (
      <FormTextField
        key={meta.name}
        name={meta.name}
        label={label}
        control={form.control}
        error={form.formState.errors[meta.name]}
        disabled={disabled}
        multiline={meta.type === 'multiline'}
        rows={meta.rows || 1}
        colors={colors}
        labelFontFamily={labelFontFamily}
        inputStyles={inputStyles}
        onChange={() => onFieldChange?.(meta.name)}
        placeholder={label}
      />
    );
  };

  const renderFieldGroup = (fields) => {
    const visibleFields = hideArtist
      ? fields.filter((meta) => meta.name !== 'artist')
      : fields;

    const progressive = resolved.layout?.progressive === true;
    // Only split when both halves exist; otherwise a section whose fields are
    // all "advanced" would render an empty body.
    const useSplit =
      progressive &&
      visibleFields.some((f) => f.essential) &&
      visibleFields.some((f) => !f.essential);
    const essential = useSplit ? visibleFields.filter((f) => f.essential) : visibleFields;
    const advanced = useSplit ? visibleFields.filter((f) => !f.essential) : [];

    const block = (list) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {list.map((meta) => renderFieldInput(meta))}
      </div>
    );

    if (!advanced.length) return block(essential);

    return (
      <>
        {block(essential)}
        <details style={{ marginTop: 4 }}>
          <summary
            style={{
              cursor: 'pointer',
              fontSize: 12,
              opacity: 0.6,
              padding: '10px 0',
              letterSpacing: 0.3,
              userSelect: 'none',
            }}
          >
            {isCn ? `更多信息（${advanced.length}）` : `More details (${advanced.length})`}
          </summary>
          <div style={{ paddingTop: 12 }}>{block(advanced)}</div>
        </details>
      </>
    );
  };

  // Cross-entity relation (Prisma `String[]` fields such as
  // Artwork.related_exhibition) → language-matched multi-select whose
  // options come from the related collection. Configure with:
  //   { type: 'relation', fieldName: 'related_exhibition',
  //     label: {en,cn},
  //     relation: { endpoint: 'exhibition', labelKey: 'title',
  //                 languageField: 'language', matchLanguage: true,
  //                 descriptionKey: 'year', unique: true },
  //     matchField: 'language',   // read the target language from the form
  //     allowCustom: false }      // only values from the list
  const renderRelationField = (tabConfig) => {
    const relation = tabConfig.relation || {};
    // The record's own language (e.g. an EN artwork) beats the UI language.
    const watched = tabConfig.matchField ? form.watch(tabConfig.matchField) : undefined;
    const language = String(watched || (isCn ? 'CN' : 'EN')).trim().toUpperCase();

    return (
      <MultiRelationSelector
        name={tabConfig.fieldName}
        label={getLabel(tabConfig.fieldName, tabConfig.label)}
        control={form.control}
        sources={relation}
        language={tabConfig.matchField ? language : undefined}
        allowCustom={tabConfig.allowCustom !== false}
        disabled={disabled}
        isCn={isCn}
        colors={colors}
        placeholder={
          tabConfig.placeholder?.[isCn ? 'cn' : 'en'] ||
          (isCn ? '选择或输入…' : 'Select or type…')
        }
        hint={tabConfig.hint?.[isCn ? 'cn' : 'en']}
        onChange={(vals) => onFieldChange?.(tabConfig.fieldName, vals)}
      />
    );
  };

  // Ordering — read-only. The position itself is set on the dedicated order
  // page, so the form only shows the number + a link:
  //   `{ key: 'ordering', type: 'order', entity: 'artwork',
  //      orderPagePath: '/manager/artwork/order' }`
  //   `{ key: 'ordering', type: 'order', fieldName: 'order',
  //      label: {en,cn}, orderPagePath: '/manager/<entity>/reorder' }`
  const renderOrderField = (tabConfig) => (
    <OrderFieldsDisplay
      form={form}
      entity={tabConfig.entity || null}
      fieldName={tabConfig.fieldName || 'order'}
      label={tabConfig.orderLabel || tabConfig.label || null}
      labels={tabConfig.orderKeyLabels || null}
      orderPagePath={tabConfig.orderPagePath || null}
      isCn={isCn}
      colors={colors}
      hint={
        tabConfig.orderHint?.[isCn ? 'cn' : 'en'] ||
        (isCn
          ? '排序在排序页中拖拽调整'
          : 'Positions are arranged on the order page')
      }
    />
  );

  const renderArrayField = (tabConfig) => {
    const fieldArrayData = fieldArraysData[tabConfig.fieldName];
    if (!fieldArrayData) {
      console.log(`No field array data found for ${tabConfig.fieldName}`);
      return null;
    }
    const { fields, append, remove, replace } = fieldArrayData;
    // 直接使用 tabConfig.addLabel，若不存在则通过 getLabel 生成
    const addLabel = tabConfig.addLabel || getLabel(`add${tabConfig.fieldName}`);
    return (
      <ArrayManager
        fields={fields}
        append={append}
        remove={remove}
        register={form.register}
        control={form.control}
        errors={form.formState.errors}
        fieldName={tabConfig.fieldName}
        itemLabel={getLabel(tabConfig.fieldName, tabConfig.label)}
        addButtonLabel={addLabel}
        isSubmitting={disabled}
        rows={tabConfig.rows || 3}
        multiline={tabConfig.multiline || false}
        onChange={(index, value) =>
          onFieldChange?.(`${tabConfig.fieldName}[${index}]`, value)
        }
      />
    );
  };

  const renderObjectArrayField = (tabConfig) => {
    const fieldArrayData = fieldArraysData[tabConfig.fieldName];
    if (!fieldArrayData) {
      console.log(`No field array data found for ${tabConfig.fieldName}`);
      return null;
    }
    const { fields, append, remove, replace } = fieldArrayData;

    const resolvedSubFields = (tabConfig.subFields || []).map((f) => ({
      ...f,
      label: getLabel(f.name, f.label),
    }));

    const addLabel = tabConfig.addLabel || getLabel(`add${tabConfig.fieldName}`);

    return (
      <ObjectArrayManager
        fields={fields}
        append={append}
        remove={remove}
        replace={replace}
        control={form.control}
        errors={form.formState.errors}
        fieldName={tabConfig.fieldName}
        subFields={resolvedSubFields}
        getLabel={(key) => getLabel(key, tabConfig.subFieldLabels?.[key])}
        isSubmitting={disabled}
        addButtonLabel={addLabel}
        minItems={tabConfig.minItems || 0}
        maxItems={tabConfig.maxItems || null}
        allowJsonMode={tabConfig.allowJsonMode !== false}
        colors={colors}
        inputFontFamilyProp={inputFontFamily}
        labelFontFamilyProp={labelFontFamily}
      />
    );
  };

  const renderTabContent = (tabConfig) => {
    if (tabConfig.fields) {
      return renderFieldGroup(tabConfig.fields);
    }
    if (tabConfig.type === 'array') {
      return renderArrayField(tabConfig);
    }
    if (tabConfig.type === 'relation') {
      return renderRelationField(tabConfig);
    }
    if (tabConfig.type === 'order') {
      return renderOrderField(tabConfig);
    }
    if (tabConfig.type === 'object-array') {
      return renderObjectArrayField(tabConfig);
    }
    if (tabConfig.type === 'custom' && customRenderers[tabConfig.renderKey]) {
      const renderer = customRenderers[tabConfig.renderKey];
      return typeof renderer === 'function' ? renderer() : renderer;
    }
    return null;
  };

  // Ordering always sits LAST in the tab bar, pushed to the right edge and
  // separated from the content tabs by a dashed rule.
  const isOrderTab = (tab) => tab?.type === 'order' || tab?.key === 'ordering';
  const tabSchema = useMemo(() => {
    const list = Array.isArray(tabSchemaSource) ? tabSchemaSource : [];
    const orderTabs = list.filter(isOrderTab);
    if (!orderTabs.length) return list;
    return [...list.filter((tab) => !isOrderTab(tab)), ...orderTabs];
  }, [tabSchemaSource]);

  const hasOrderTab = tabSchema.some(isOrderTab);

  const tabLabeler = getTabLabelFunc || getTabLabelProp;
  const tabItems = tabSchema.map((tab, idx) => {
    const text = tabLabeler
      ? tabLabeler(tab.key, tab.label)
      : getLabel(tab.key, tab.label);
    const isOrder = isOrderTab(tab);
    return {
      key: String(tab.key ?? idx),
      label:
        isOrder && tabSchema.length > 1 ? (
          <span
            style={{ display: 'inline-flex', alignItems: 'center' }}
            title={text}
          >
            <span className="tfm-order-dash" aria-hidden="true" />
            {text}
          </span>
        ) : (
          text
        ),
      children: <div style={{ padding: '2px' }}>{renderTabContent(tab)}</div>,
    };
  });

  return (
    <div
      className={`tfm-tabbar${hasOrderTab ? ' tfm-tabbar--with-order' : ''}`}
      style={{ width: '100%' }}
    >
      <style>{`
        /* Ordering tab: dashed connector + pinned to the right edge */
        .tfm-order-dash {
          display: inline-block;
          width: clamp(36px, 8vw, 150px);
          margin-right: 14px;
          border-top: 1px dashed rgba(0, 0, 0, .35);
          vertical-align: middle;
        }
        @media (max-width: 700px) {
          .tfm-order-dash { display: none; }
        }
        .tfm-tabbar--with-order .ant-tabs-nav-list { width: 100% !important; }
        /* The ordering tab is always rendered last (the ink-bar element follows
           it), so target it by its dashed connector and fall back to the
           second-to-last child for engines without :has(). */
        .tfm-tabbar--with-order .ant-tabs-tab:has(.tfm-order-dash) { margin-left: auto !important; }
        .tfm-tabbar--with-order .ant-tabs-nav-list > .ant-tabs-tab:nth-last-child(2) { margin-left: auto !important; }
      `}</style>

      {(enabled || languageField) ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 4,
          }}
        >
          {languageField ? (
            <LanguageSelector
              compact
              showLabel={false}
              form={form}
              name={languageField.name || 'language'}
              disabled={disabled}
              colors={colors}
              isCn={isCn}
              getLabel={(key) =>
                key === 'languagePlaceholder'
                  ? isCn
                    ? '选择语言'
                    : 'Select language...'
                  : getLabel('language', languageField.label)
              }
              onFieldChange={() => onFieldChange?.(languageField.name || 'language')}
            />
          ) : null}
          {/* Bold rule between the language switch and “Form settings”. */}
          {languageField && enabled ? (
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: 2,
                height: 18,
                background: colors?.text || '#000',
                flex: '0 0 auto',
              }}
            />
          ) : null}
          {enabled ? (
            <FieldsCustomizeMenu
              codeSections={rawSchema}
              fields={resolved.fields}
              stats={resolved.stats}
              isCn={isCn}
            />
          ) : null}
        </div>
      ) : null}
      <ConfigProvider
        wave={{ disabled: true }}
        theme={{
          token: { colorPrimary: '#000000', colorLink: '#000000', colorText: '#000000' },
          components: {
            Tabs: {
              inkBarColor: '#000000',
              itemColor: '#8a8a8a',
              itemHoverColor: '#000000',
              itemSelectedColor: '#000000',
              titleFontSize: 14,
            },
          },
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
          tabBarGutter={24}
          style={{ fontFamily: labelFontFamily }}
        />
      </ConfigProvider>
    </div>
  );
};

export default TabbedFormManager;