import { isAxiosError } from "axios";
import { NextResponse } from "next/server";

export default function basicErrorHandler(error: any, message_title: string) {
  const errorDetails = {
    title: message_title,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    response: {
      data: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    },
    request: error.config ? {
      method: error.config.method,
      url: error.config.url,
      params: error.config.params,
    } : undefined,
  };
    
  console.error('Error details:', JSON.stringify(errorDetails, null, 2));

  if (isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const message = error.response?.data?.error || error.message;

    const errorResponses: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      500: 'Internal Server Error',
    };

    const errorMessage = errorResponses[status] || message || 'An unexpected error occurred';
    return NextResponse.json({ 
      error: {
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? message : undefined,
        status,
      },
    }, { status });
  }

  if (error instanceof Error) {
    return NextResponse.json({ 
      error: {
        message: error.message,
        status: 400,
      },
    }, { status: 400 });
  }

  return NextResponse.json({ 
    error: {
      message: "An unexpected error occurred",
      status: 500,
    },
  }, { status: 500 });
}