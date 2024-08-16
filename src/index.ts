import type express from 'express';
import type { Hono } from 'hono';
import { handleRes, transformReq } from './util';

export function honoAdapter(hono: Hono): express.Handler {
    return async (req, res) => {
        const response = await hono.fetch(transformReq(req));
        handleRes(response, res);
    };
}
