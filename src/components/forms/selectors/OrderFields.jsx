"use client";

import React from "react";
import { Grid } from "@mui/material";
import OrderSelector from "@/components/forms/selectors/OrderSelector";
import { managedOrderKeys, ORDER_KEYS, ORDER_KEY_LABELS } from "@/utils/mediaOrder";

/**
 * OrderFields
 *
 * Renders one OrderSelector per per-page order key for a collection whose
 * `order` is a JSON object (e.g. Image → rolling / exhibition / art fair).
 * Each selector binds to the nested RHF path `order.<key>`, so the submitted
 * value stays the JSON object shape.
 *
 * `managedOrderKeys` keeps this in step with the order manager's tabs — for
 * images that means no "Artist Page Order" row (the artist page order for an
 * image IS the rolling order).
 *
 * @param {"artwork"|"image"} entity — which key set to render
 */
export default function OrderFields({
  form,
  disabled = false,
  colors = {},
  isCn = false,
  onFieldChange,
  entity = "image",
  columns = 6,
}) {
  const keys = managedOrderKeys(entity);

  return (
    <Grid container spacing={2}>
      {keys.map((key) => {
        const labelObj = ORDER_KEY_LABELS[key] || { en: key, cn: key };
        const label = isCn ? labelObj.cn : labelObj.en;
        return (
          <Grid item xs={12} sm={columns} key={key}>
            <OrderSelector
              name={`order.${key}`}
              label={label}
              form={form}
              disabled={disabled}
              getLabel={() => label}
              onFieldChange={onFieldChange}
              colors={colors}
              isCn={isCn}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
