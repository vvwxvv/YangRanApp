export const localizeOptions = (opts, isCn) =>
    opts.map((o) => ({ value: o.value, label: isCn ? o.label_cn : o.label_en }));
  