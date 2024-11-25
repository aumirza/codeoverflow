import { toast } from "sonner";

export function toastPromise<T>(
  promise: Promise<T>,
  args: {
    loading?: string | React.ReactNode;
    success: string | React.ReactNode;
    error: string | React.ReactNode;
    description?: string | React.ReactNode;
    finally?: () => void | Promise<void>;
  }
): Promise<T> {
  return new Promise((resolve, reject) => {
    toast.promise(promise, {
      ...args,
      success: (data) => {
        resolve(data);
        return args.success;
      },
      error: (err) => {
        reject(err);
        return args.error;
      },
    });
  });
}
