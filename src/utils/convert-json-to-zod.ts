import { z } from "zod";

interface JsonSchemaProperty {
  type: string;
  description?: string;
}

export interface JsonSchema {
  type: string;
  properties: Record<string, JsonSchemaProperty>;
  required?: string[];
}

export const convertJsonToZod = (schema: JsonSchema) => {
  if (!schema.properties) {
    throw new Error("Invalid schema: missing properties");
  }

  const zodSchema: Record<string, z.ZodType> = {};
  Object.entries(schema.properties).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      const propType = value.type;
      zodSchema[key] =
        propType === "string"
          ? z.string()
          : propType === "boolean"
            ? z.boolean()
            : propType === "number"
              ? z.number()
              : propType === "integer"
                ? z.number().int()
                : z.any();

      if (value.description) {
        zodSchema[key] = zodSchema[key].describe(value.description);
      }
    }
  });

  return z.object(zodSchema);
};
