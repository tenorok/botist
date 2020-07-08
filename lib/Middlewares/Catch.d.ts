import SendError from '../Errors/SendError';
export interface ICatchMiddleware {
    catch(error: SendError): boolean;
}
export declare abstract class CatchMiddleware implements ICatchMiddleware {
    /**
     * Determines the need to call next middleware.
     */
    abstract catch(error: SendError): boolean;
}
