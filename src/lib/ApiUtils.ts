import { NextResponse } from 'next/server';

function Response(success: boolean, message?: string, data?: any) {
    let j;
    if (data && message) {
        j = {
            success,
            message: message,
            data: data,
        };
    } else if (data && !message) {
        j = {
            success,
            data: data,
        };
    } else if (!data && message) {
        j = {
            success,
            message: message,
        };
    } else {
        j = {
            success,
        };
    }

    return NextResponse.json(j);
}

function ServerError(err: any) {
    console.log(`[ERR] ${new Date().toISOString()} | ${err}`);
    return Response(false, 'ServerError');
}

function NotFound(message: string) {
    return NextResponse.json({
        success: false,
        message: message,
    }, { status: 404 });
}


const ApiUtils = {
    Response,
    ServerError,
    NotFound,
};
export default ApiUtils;