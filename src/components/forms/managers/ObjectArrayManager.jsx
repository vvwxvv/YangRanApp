"use client";
import React, { useContext, useState } from "react";
import { Button, Input } from "antd";
import { useWatch } from "react-hook-form";
import { Trash2, Plus, Braces } from "lucide-react";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import useFont from '@/hooks/useFont';
import FormTextField from "@/components/forms/fields/FormTextField";
import ItemSelector from "@/components/forms/selectors/ItemSelector";

const { TextArea } = Input;

/**
 * ObjectArrayManager – 管理对象数组（如 socialMedia）
 * 支持逐条录入和 JSON 批量粘贴。
 */
const ObjectArrayManager = ({
  fields = [],
  append,
  remove,
  replace,
  control,
  errors = {},
  fieldName,
  subFields = [],
  getLabel,
  isSubmitting = false,
  addButtonLabel = "Add Item",
  minItems = 0,
  maxItems = null,
  allowJsonMode = true,
  colors = {},
  inputFontFamilyProp,
  labelFontFamilyProp,
}) => {
  const context = useContext(LanguageContext);
  const isCn = context?.isCn;
  const { inputFontFamily: fontInput, labelFontFamily: fontLabel } = useFont();
  const inputFontFamily = inputFontFamilyProp || fontInput;
  const labelFontFamily = labelFontFamilyProp || fontLabel;

  const [jsonMode, setJsonMode] = useState(false);
  const [jsonDraft, setJsonDraft] = useState("");
  const [jsonError, setJsonError] = useState("");

  const liveValue = useWatch({ control, name: fieldName }) || [];

  const label = (key, fallback) => (getLabel ? getLabel(key) : fallback || key);

  const inputStyles = {
    fontFamily: inputFontFamily,
    color: colors?.text || undefined,
    backgroundColor: colors?.background || undefined,
    borderColor: colors?.border || undefined,
    borderRadius: "8px",
  };

  const emptyItem = () => {
    const obj = {};
    subFields.forEach((f) => { obj[f.name] = ""; });
    return obj;
  };

  const handleAppend = () => {
    if (isSubmitting) return;
    if (maxItems && fields.length >= maxItems) return;
    append(emptyItem());
  };

  const handleRemove = (index) => {
    if (isSubmitting) return;
    if (fields.length <= minItems) return;
    remove(index);
  };

  const openJsonMode = () => {
    setJsonDraft(JSON.stringify(liveValue.length ? liveValue : [emptyItem()], null, 2));
    setJsonError("");
    setJsonMode(true);
  };

  const applyJsonDraft = () => {
    if (!replace) {
      setJsonError(
        isCn
          ? "JSON 导入不可用：未提供 replace 方法。"
          : "JSON import unavailable: this field array was not given a `replace` handler."
      );
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(jsonDraft);
    } catch (e) {
      setJsonError(isCn ? "JSON 格式无效，请检查语法。" : "Invalid JSON — please check the syntax.");
      return;
    }
    if (!Array.isArray(parsed)) {
      setJsonError(isCn ? "内容必须是一个数组。" : "Content must be a JSON array.");
      return;
    }
    const sanitized = parsed.map((item) => {
      const clean = {};
      subFields.forEach((f) => {
        const raw = item && typeof item === "object" ? item[f.name] : "";
        clean[f.name] = raw === undefined || raw === null ? "" : String(raw);
      });
      return clean;
    });
    if (maxItems && sanitized.length > maxItems) {
      setJsonError(
        isCn
          ? `最多允许 ${maxItems} 项，当前有 ${sanitized.length} 项。`
          : `Maximum ${maxItems} items allowed, got ${sanitized.length}.`
      );
      return;
    }
    replace(sanitized);
    setJsonError("");
    setJsonMode(false);
  };

  const renderSubField = (subMeta, index) => {
    const path = `${fieldName}.${index}.${subMeta.name}`;
    const fieldError = errors?.[fieldName]?.[index]?.[subMeta.name];
    const fieldLabel = label(subMeta.name, subMeta.label);

    if (subMeta.type === "select") {
      const opts = (subMeta.options || []).map((opt) => ({
        value: opt.value,
        label: isCn ? opt.labelCn || opt.label : opt.label,
      }));
      return (
        <div key={subMeta.name} style={{ marginBottom: fieldError?.message ? 0 : undefined }}>
          <ItemSelector
            name={path}
            options={opts}
            control={control}
            disabled={isSubmitting}
            colors={colors}
            getLabel={() => fieldLabel}
            onFieldChange={() => {}}
          />
          {fieldError?.message && (
            <div style={{ color: "#d32f2f", fontSize: "12px", marginTop: "-10px", marginBottom: "12px" }}>
              {fieldError.message}
            </div>
          )}
        </div>
      );
    }

    return (
      <FormTextField
        key={subMeta.name}
        name={path}
        label={fieldLabel}
        placeholder={subMeta.placeholder || fieldLabel}
        control={control}
        error={fieldError}
        disabled={isSubmitting}
        colors={colors}
        labelFontFamily={labelFontFamily}
        inputStyles={inputStyles}
      />
    );
  };

  const atMax = maxItems != null && fields.length >= maxItems;
  const atMin = fields.length <= minItems;

  return (
    <div>
      {allowJsonMode && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "8px" }}>
          <Button
            size="small"
            type="text"
            icon={<Braces size={14} />}
            onClick={() => (jsonMode ? setJsonMode(false) : openJsonMode())}
            style={{ fontFamily: labelFontFamily }}
          >
            {jsonMode ? (isCn ? "关闭 JSON" : "Close JSON") : isCn ? "粘贴 JSON" : "Paste JSON"}
          </Button>
        </div>
      )}

      {jsonMode && (
        <div
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px",
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px", fontFamily: labelFontFamily }}>
            {isCn
              ? `粘贴一个对象数组，每个对象包含字段：${subFields.map((f) => f.name).join(", ")}`
              : `Paste an array of objects with fields: ${subFields.map((f) => f.name).join(", ")}`}
          </div>
          <TextArea
            rows={6}
            value={jsonDraft}
            onChange={(e) => setJsonDraft(e.target.value)}
            style={{ fontFamily: inputFontFamily, fontSize: "13px" }}
          />
          {jsonError && (
            <div style={{ color: "#d32f2f", fontSize: "12px", marginTop: "6px" }}>{jsonError}</div>
          )}
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            <Button type="primary" size="small" onClick={applyJsonDraft}>
              {isCn ? "应用" : "Apply"}
            </Button>
            <Button size="small" onClick={() => setJsonMode(false)}>
              {isCn ? "取消" : "Cancel"}
            </Button>
          </div>
        </div>
      )}

      {fields.map((item, index) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            position: "relative",
            backgroundColor: "#fafafa",
          }}
        >
          <button
            type="button"
            onClick={() => handleRemove(index)}
            disabled={isSubmitting || atMin}
            aria-label={`remove-${fieldName}-${index}`}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              border: "none",
              background: "rgba(211, 47, 47, 0.05)",
              borderRadius: "4px",
              padding: "6px",
              cursor: isSubmitting || atMin ? "not-allowed" : "pointer",
              opacity: isSubmitting || atMin ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#d32f2f",
            }}
          >
            <Trash2 size={14} />
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingRight: "32px" }}>
            {subFields.map((subMeta) => renderSubField(subMeta, index))}
          </div>
        </div>
      ))}

      <Button
        type="dashed"
        icon={<Plus size={14} />}
        onClick={handleAppend}
        disabled={isSubmitting || atMax}
        style={{ fontFamily: labelFontFamily }}
      >
        {addButtonLabel}
      </Button>

      {errors?.[fieldName]?.message && (
        <div style={{ color: "#d32f2f", fontSize: "12px", marginTop: "8px" }}>
          {errors[fieldName].message}
        </div>
      )}
    </div>
  );
};

export default ObjectArrayManager;