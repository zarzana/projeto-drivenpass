import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '../middlewares';
import { credentialService } from '../services';

export async function credentialPost(req: AuthenticatedRequest, res: Response) {
    const { title, url, username, password } = req.body;
    await credentialService.createCredential(title, url, username, password, req.userId);
    return res.sendStatus(httpStatus.CREATED);
};

export async function credentialGet(req: AuthenticatedRequest, res: Response) {
    const credentialArray = await credentialService.findAllUserCredentials(req.userId);
    return res.status(httpStatus.OK).send(credentialArray);
};

export async function credentialGetById(req: AuthenticatedRequest, res: Response) {
    const credentialId = parseInt(req.params.id) as number;
    const credential = await credentialService.findCredential(credentialId, req.userId);
    return res.status(httpStatus.OK).send(credential);
};

export async function credentialDelete(req: AuthenticatedRequest, res: Response) {
    const credentialId = parseInt(req.params.id) as number;
    await credentialService.deleteCredential(credentialId, req.userId);
    return res.sendStatus(httpStatus.OK);
};