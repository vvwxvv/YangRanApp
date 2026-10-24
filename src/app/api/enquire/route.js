// app/api/enquire/route.js - Enquire API

import { createApiHandler } from "@/app/api/_lib/api_shell";
import { enquireApiConfig } from "@/app/api/_config/enquire_api_config";

const config = {
  ...enquireApiConfig,
  afterCreate: async (data, result) => {
    console.log("Enquire - Created:", result.insertedId);
  },
};

const handlers = createApiHandler(config);
export const GET = handlers.GET;
export const POST = handlers.POST;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
