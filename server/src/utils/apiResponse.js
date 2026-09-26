// Every API response goes through one of these so the shape is
// predictable for the frontend regardless of which route handled it.

export function ok(res, data, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function created(res, data, message = 'Created') {
  return ok(res, data, message, 201);
}

export function fail(res, statusCode, message, errors = null) {
  return res.status(statusCode).json({ success: false, message, errors });
}
