// src/components/ErrorPage.tsx
import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  // Type guard for narrowing the error type
  const errorMessage = (() => {
    if (isRouteErrorResponse(error)) {
      return error.statusText;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred";
  })();

  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
