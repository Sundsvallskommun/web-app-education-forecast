import { Request } from 'express';
import { isValidUrl } from './util';
import { isValidOrigin } from './isValidOrigin';
import { SAML_SUCCESS_REDIRECT } from '@/config';

export const getRedirects = (req: Request): { successRedirect: URL; failureRedirect: URL } => {
  let successRedirect: URL, failureRedirect: URL;
  // RelayState arrives in the body on a POST binding and in the query on a redirect binding (GET).
  // A GET has no parsed body, so guard against both being absent instead of throwing.
  const urls = String(req?.body?.RelayState ?? req?.query?.RelayState ?? '').split(',');

  if (isValidUrl(urls[0]) && isValidOrigin(urls[0])) {
    successRedirect = new URL(urls[0]);
  } else {
    successRedirect = new URL(SAML_SUCCESS_REDIRECT ?? '/');
  }

  if (isValidUrl(urls[1]) && isValidOrigin(urls[1])) {
    failureRedirect = new URL(urls[1]);
  } else {
    failureRedirect = successRedirect;
  }
  return { successRedirect, failureRedirect };
};
