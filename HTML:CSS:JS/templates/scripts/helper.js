//Error handler

export const errorHandler = (err, moduleinvoked) => {
  const errorData = {
    module: moduleinvoked,
    statusCode: err?.status,
    errorMessage: err?.message || "Something Went Wrong",
    error: err,
  };

  console.error(errorData);
};
