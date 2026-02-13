import { InjectionToken } from '@angular/core';
import type { Request, Response } from 'express';

export const REQUEST = new InjectionToken<Request>('CEI-SSO:REQUEST');
export const RESPONSE = new InjectionToken<Response>('CEI-SSO:RESPONSE');