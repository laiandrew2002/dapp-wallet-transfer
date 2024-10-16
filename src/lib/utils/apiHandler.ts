import type { NextApiResponse } from 'next';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleSuccessResponse(res: NextApiResponse, statusCode: number, data: any) {
  res.status(statusCode).json({ success: true, data });
}

export function handleErrorResponse(res: NextApiResponse, statusCode: number, message: string) {
  res.status(statusCode).json({ success: false, error: message });
}