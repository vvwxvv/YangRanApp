export const enquireApiConfig = {
  collectionName: "Enquire",
  enablePagination: false,
  defaultPageSize: 1000,
  maxPageSize: 1000,
  enableSearch: true,
  enableSorting: true,
  enableSoftDelete: false,
  enableBulkOperations: false,
  requiredFields: ["name", "email"],
  searchableFields: ["name", "email", "message"],
  arrayFields: [],
  validFields: [
    "_id",
    "name",
    "email",
    "message",
    "status",
    "createdAt",
    "updatedAt",
  ],
  defaultSortField: "createdAt",
  defaultSortOrder: -1,

  beforeCreate: async (data) => {
    data.createdAt = new Date().toISOString();
    data.status = data.status || "Pending";
    return data;
  },
};
