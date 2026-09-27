export function normalizeError(error) {
    // No response — network error
    if (!error.response) {
        return {
            code: "NETWORK_ERROR",
            message: "Network error. Please check your connection.",
            errors: {},
        };
    }

    const { status, data } = error.response;

    return {
        code: data.error_code || `HTTP_${status}`,
        message: data.message || "Something went wrong.",
        errors: data.errors || {},
    };
}

export function isRateLimited(error) {
    return error?.code === "TOO_MANY_ATTEMPTS";
}

export function isUnauthenticated(error) {
    return error?.code === "UNAUTHENTICATED";
}
