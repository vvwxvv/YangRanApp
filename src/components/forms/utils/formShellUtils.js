/**
 * Creates a universal label resolver that checks custom getLabel first,
 * then falls back to system labels
 */
export const createLabelResolver = (config, isCn, getSystemLabel) => {
  return (key) => {
    // 1. if the concrete form passed its own translator – use it
    if (typeof config?.getLabel === "function") {
      const custom = config.getLabel(key, isCn ? "CN" : "EN");
      if (custom && custom !== key) return custom;
    }
    // 2. fall back to global system labels
    return getSystemLabel(key, isCn);
  };
};

/**
 * Creates form box styles based on device and colors
 */
export const createFormBoxStyles = (isMobile, colors) => ({
  padding: isMobile ? 0 : { xs: 3, sm: 4 },
  backgroundColor: colors.background,
  color: colors.text,
});

/**
 * Creates container styles for mobile/desktop
 */
export const createContainerStyles = (isMobile, colors) => ({
  backgroundColor: colors.background,
  color: colors.text,
  maxWidth: '100%',
  width: '100%',
});

/**
 * Creates outer wrapper box styles
 */
export const createWrapperBoxStyles = (colors) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  minHeight: '100%',
  backgroundColor: colors.background,
});

/**
 * Default animation variants for form containers
 */
export const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1
  },
};

/**
 * Handles form submission for edit operations
 */
export const createEditSubmitHandler = (formState, form, item, apiRoute) => {
  return async (e) => {
    e.preventDefault();
    try {
      formState.setLoading(true);
      formState.clearError();
      
      const valid = await form.trigger();
      if (!valid) {
        formState.setError("Validation failed");
        return;
      }

      const id = item._id || item.id;
      const res = await fetch(`${apiRoute}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.getValues()),
      });

      const json = await res.json();
      
      if (res.ok) {
        formState.setSuccess("Updated successfully!");
        setTimeout(() => {
          window.location.href = `/manager/${apiRoute.split("/").pop()}`;
        }, 1500);
      } else {
        formState.setError(json.message || "Update failed");
      }
    } catch (err) {
      formState.setError("Network error");
    } finally {
      formState.setLoading(false);
    }
  };
};

/**
 * Validates if item has required ID for edit operations
 */
export const validateEditItem = (item) => {
  if (!item) return false;
  if (!item.id && !item._id) return false;
  return true;
};