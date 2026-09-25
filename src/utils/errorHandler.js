export function notFoundHandler(request, response) {
  response.status(404).json({ message: `Route not found: ${request.method} ${request.originalUrl}` });
}

export function errorHandler(error, request, response, next) {
  console.error(error);
  const statusCode = error.statusCode || 500;
  response.status(statusCode).json({
    message: statusCode === 500 ? 'Internal server error' : error.message
  });
}
