import SendError from '../Errors/SendError';

export interface ICatchMiddleware {
    catch(error: SendError): boolean;
}

export abstract class CatchMiddleware implements ICatchMiddleware {
    /**
     * Determines the need to call next middleware.
     */
    public abstract catch(error: SendError): boolean;
}
