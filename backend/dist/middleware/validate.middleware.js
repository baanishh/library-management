import { ZodError } from "zod";
import { ApiError } from "../errors/api-error.js";
// Validate schema
export const validate = (schema) => {
    return async (req, _res, next) => {
        try {
            const parsed = (await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            }));
            if (parsed.body !== undefined)
                req.body = parsed.body;
            if (parsed.query !== undefined)
                Object.assign(req.query, parsed.query);
            if (parsed.params !== undefined)
                Object.assign(req.params, parsed.params);
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const messages = error.issues.map((issue) => {
                    const field = issue.path
                        .filter((p) => p !== "body" && p !== "query" && p !== "params")
                        .join(".");
                    return field ? `${field}: ${issue.message}` : issue.message;
                });
                return next(ApiError.badRequest(messages.join(", ")));
            }
            next(error);
        }
    };
};
