export type RepositoryResponse<T = any> = {
  status: "success" | "error";
  msg: string;
  data: T | null;
  statusCode: number;
}
export function createDefaultResponse<T>({
  status = "error",
  msg = "An error occurred", // Default message
  data = null,
  statusCode = 404,          // Default HTTP status code to 404
}: Partial<RepositoryResponse<T>> = {}): RepositoryResponse<T> {
  return {
    status,
    msg,
    data,
    statusCode,
  };
}


export function tryCatchWithLogging(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    try {
      // Add logging behavior from the base decorator
      logMethod(target, propertyKey, descriptor);

      // Execute the original method
      return await originalMethod.apply(this, args);
    } catch (error) {
      const e = error as Error;
      console.error(`Error occurred in ${propertyKey}:`, e.message);
      return createDefaultResponse({ msg: e.message });
    }
  };

  return descriptor;
}
export function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Method ${propertyKey} was called with args:`, args);
    return originalMethod.apply(this, args);
  };

  return descriptor;
}


