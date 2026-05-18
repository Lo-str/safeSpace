import type { ErrorRequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  if (err?.status === 401 || err?.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: err.message ?? 'Authentication required',
    });
  }

  const status = err?.status ?? 500;
  return res.status(status).json({
    error: 'Server Error',
    message: err?.message ?? 'An unexpected error occurred',
  });
};

export default errorMiddleware;
