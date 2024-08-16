import type * as e from 'express';

export function transformReq(req: e.Request): Request {
    const url = new URL(req.url, 'http://example.com');
    return new Request(url, {
        method: req.method,
        headers: req.headers as Record<string, string>,
        body: req.body,
    });
}

export function handleRes(res: Response, exp: e.Response) {
    const headers = res.headers;
    for (const [key, value] of headers) {
        exp.setHeader(key, value);
    }
    exp.status(res.status);
    const body = res.body;
    if (!body) {
        exp.end();
        return;
    }
    body.pipeTo(
        new WritableStream({
            write(chunk) {
                exp.write(chunk);
            },
        }),
    ).then(() => {
        exp.end();
    });
}
