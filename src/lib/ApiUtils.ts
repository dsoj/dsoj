import { NextResponse } from 'next/server';

export function ApiResponse(message: string, success: boolean, data?: any) {
    let j;
    if (data) {
        j = {
            message,
            success,
            data,
        };
    } else {
        j = {
            message,
            success
        };
    }
    return NextResponse.json(j);
}

export function ApiServerError() {
    return ApiResponse('ServerError', false);
}