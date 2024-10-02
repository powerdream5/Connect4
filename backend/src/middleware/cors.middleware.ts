import { Request, Response, NextFunction } from "express";

export default function corsMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if(req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        )
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.sendStatus(204);
    }
    
    next();
}