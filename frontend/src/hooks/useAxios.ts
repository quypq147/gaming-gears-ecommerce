'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/src/lib/axios';

interface UseAxiosResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useAxios = <T = any>(url: string): UseAxiosResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get<T>(url);
        setData(response.data);
      } catch (err: any) {
        setError(err?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
