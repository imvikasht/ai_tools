import { useState } from "react";
import toast from "react-hot-toast";

export const useAsyncAction = (action, successMessage) => {
  const [loading, setLoading] = useState(false);

  const run = async (...args) => {
    setLoading(true);
    try {
      const result = await action(...args);
      if (successMessage) {
        toast.success(successMessage);
      }
      return result;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { run, loading };
};
