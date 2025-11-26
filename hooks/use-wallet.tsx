"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api/api-client"; // Adjust import path as needed

// Define types
interface Wallet {
  _id: string;
  businessId: string;
  availableBalance: number;
  pendingBalance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface VirtualAccount {
  accountNumber: string;
  currency: string;
  name: string;
  bank: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface WithdrawalAccount {
  _id: string;
  bankName: string;
  accountName: string;
  currency: string;
  accountNumber: string;
  sortCode: string;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: string;
  transactionId: string;
  referenceId: string;
  amount: number;
  currency: string;
  status: string;
  transactionType: string;
  sourceType: string;
  createdAt: string;
  destination: string;
  metadata: Record<string, any>;
}

interface TransactionStats {
  stats: {
    totalTransactions: number;
    totalAmount: number;
    creditAmount: number;
    debitAmount: number;
    creditCount: number;
    debitCount: number;
  };
  chartData: {
    date: string;
    credit: number;
    debit: number;
  }[];
}

interface TransactionFilters {
  page?: number;
  limit?: number;
  status?: string;
  transactionType?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  sort?: string;
  order?: number;
}

interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

interface AddWithdrawalAccountParams {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankId?: string;
  sortCode?: string;
  currency: string;
}

interface WithdrawFundsParams {
  accountId: string;
  amount: number;
  currency: string;
  narration?: string;
}

interface Bank {
  id: string;
  name: string;
  code: string;
}

interface DeleteAccountResponse {
  status: string;
  requestId?: string;
  message?: string;
}

interface WalletContextType {
  wallets: Wallet[];
  virtualAccount: VirtualAccount | null;
  withdrawalAccounts: WithdrawalAccount[];
  transactions: Transaction[];
  transactionStats: TransactionStats;
  activeWalletCurrency: string;
  banks: Bank[];
  isRefreshing: boolean;
  loading: {
    wallets: boolean;
    transactions: boolean;
    stats: boolean;
    virtualAccount: boolean;
    withdrawalAccounts: boolean;
  };
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  setActiveWalletCurrency: (currency: string) => void;
  fetchWallets: () => Promise<void>;
  fetchVirtualAccount: () => Promise<void>;
  refreshVirtualAccount: () => Promise<void>;
  fetchWithdrawalAccounts: () => Promise<void>;
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  fetchTransactionStats: (timeRange?: string) => Promise<void>;
  getTransactionById: (id: string) => Promise<any>;
  initiateAccountAdd: (params: AddWithdrawalAccountParams) => Promise<string>;
  confirmAccountAdd: (requestId: string, otp: string) => Promise<void>;
  initiateAccountDelete: (id: string) => Promise<string>;
  confirmAccountDelete: (id: string, requestId: string, otp: string) => Promise<void>;
  withdrawFunds: (params: WithdrawFundsParams) => Promise<void>;
  getWalletBalance: (currency?: string) => Promise<void>;
  getWalletHistory: (filters?: any) => Promise<void>;
  getWalletStats: (timeRange?: string) => Promise<void>;
}



// Create the context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Provider component
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();

  // State
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount | null>(
    null
  );
  const [withdrawalAccounts, setWithdrawalAccounts] = useState<
    WithdrawalAccount[]
  >([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionStats, setTransactionStats] = useState<TransactionStats>({
    stats: {
      totalTransactions: 0,
      totalAmount: 0,
      creditAmount: 0,
      debitAmount: 0,
      creditCount: 0,
      debitCount: 0,
    },
    chartData: [],
  });
  const [activeWalletCurrency, setActiveWalletCurrency] =
    useState<string>("NGN");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState({
    wallets: false,
    transactions: false,
    stats: false,
    virtualAccount: false,
    withdrawalAccounts: false,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [banks, setBanks] = useState<Bank[]>([]);

  // Helper function to update loading state
  const updateLoadingState = (key: keyof typeof loading, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch all wallets
  const fetchWallets = useCallback(async () => {
    try {
      updateLoadingState("wallets", true);
      const response = await apiClient.seller.get(
        "/api/v1/accounts/wallets/all"
      );

      if (response.success) {
        setWallets(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch wallets");
      }
    } catch (error: any) {
      console.error("Error fetching wallets:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch wallet data",
        variant: "destructive",
      });
    } finally {
      updateLoadingState("wallets", false);
    }
    //eslint-disable-next-line
  }, [toast]);

  // Fetch virtual account (DVA funding account)
  const fetchVirtualAccount = useCallback(async () => {
    try {
      updateLoadingState("virtualAccount", true);
      const response = await apiClient.seller.get("/api/v1/accounts/dva");

      if (response.status === "ok") {
        setVirtualAccount(response.data);
      } else {
        throw new Error("Failed to fetch virtual account");
      }
    } catch (error: any) {
      console.error("Error fetching virtual account:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch virtual account data",
        variant: "destructive",
      });
    } finally {
      updateLoadingState("virtualAccount", false);
    }
  }, [toast]);

  // Refresh virtual account
  const refreshVirtualAccount = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await fetchVirtualAccount();

      toast({
        title: "Success",
        description: "Virtual account refreshed successfully",
      });
    } catch (error: any) {
      console.error("Error refreshing virtual account:", error);
      toast({
        title: "Error",
        description: "Failed to refresh virtual account",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchVirtualAccount, toast]);

  // Fetch withdrawal accounts
  const fetchWithdrawalAccounts = useCallback(async () => {
    try {
      updateLoadingState("withdrawalAccounts", true);
      const response = await apiClient.seller.get('/api/v1/accounts');
      
      if (response.status === "ok" && Array.isArray(response.data)) {
        setWithdrawalAccounts(response.data);
      } else {
        setWithdrawalAccounts([]);
      }
    } catch (error: any) {
      console.error("Error fetching withdrawal accounts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch withdrawal accounts",
        variant: "destructive",
      });
    } finally {
      updateLoadingState("withdrawalAccounts", false);
    }
  }, [toast]);

  // Fetch transactions with filters
  const fetchTransactions = useCallback(
    async (filters: TransactionFilters = {}) => {
      try {
        updateLoadingState("transactions", true);
        const params = {
          page: filters.page || 1,
          limit: filters.limit || 10,
          ...(filters.status && { status: filters.status }),
          ...(filters.transactionType && {
            transactionType: filters.transactionType,
          }),
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
          ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
        };

        const response = await apiClient.seller.get(
          "/api/v1/accounts/transactions",
          { params }
        );

        if (response.success) {
          setTransactions(response.data);
          setPagination(response.pagination);
        } else {
          throw new Error(response.message || "Failed to fetch transactions");
        }
      } catch (error: any) {
        console.error("Error fetching transactions:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch transaction data",
          variant: "destructive",
        });
      } finally {
        updateLoadingState("transactions", false);
      }
    },
    [toast]
  );

  // Fetch transaction stats
  const fetchTransactionStats = useCallback(
    async (timeRange: string = "30d") => {
      try {
        updateLoadingState("stats", true);
        const response = await apiClient.seller.get(
          "/api/v1/accounts/transactions/stats",
          {
            params: { timeRange },
          }
        );

        if (response.success) {
          setTransactionStats(response.data);
        } else {
          throw new Error(
            response.message || "Failed to fetch transaction stats"
          );
        }
      } catch (error: any) {
        console.error("Error fetching transaction stats:", error);
        toast({
          title: "Error",
          description:
            error.message || "Failed to fetch transaction statistics",
          variant: "destructive",
        });
      } finally {
        updateLoadingState("stats", false);
      }
    },
    [toast]
  );

  const fetchBanks = useCallback(async () => {
    try {
      const response = await apiClient.seller.get("/api/v1/accounts/banks");

      if (response.status === "ok") {
        setBanks(response.data);
      } else {
        throw new Error("Failed to fetch banks");
      }
    } catch (error: any) {
      console.error("Error fetching banks:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch banks data",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Get transaction by ID
  const getTransactionById = useCallback(
    async (transactionId: string) => {
      try {
        const response = await apiClient.seller.get(
          `/api/v1/accounts/transactions/${transactionId}`
        );

        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || "Transaction not found");
        }
      } catch (error: any) {
        console.error("Error fetching transaction details:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch transaction details",
          variant: "destructive",
        });
        return null;
      }
    },
    [toast]
  );

  // Get wallet balance for specific currency
  const getWalletBalance = useCallback(
    async (currency: string = "NGN") => {
      try {
        const response = await apiClient.seller.get(
          "/api/v1/accounts/wallet/balance",
          {
            params: { currency },
          }
        );

        if (response.success) {
          setWallets((prev) =>
            prev.map((wallet) =>
              wallet.currency === currency ? { ...wallet, ...response.data } : wallet
            )
          );
          return response.data;
        } else {
          throw new Error(response.message || "Failed to fetch wallet balance");
        }
      } catch (error: any) {
        console.error("Error fetching wallet balance:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch wallet balance",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Get wallet history
  const getWalletHistory = useCallback(
    async (filters: any = {}) => {
      try {
        const params = {
          page: filters.page || 1,
          limit: filters.limit || 10,
          currency: filters.currency || activeWalletCurrency,
          ...(filters.entryType && { entryType: filters.entryType }),
          ...(filters.startDate && { startDate: filters.startDate }),
          ...(filters.endDate && { endDate: filters.endDate }),
          sort: filters.sort || "createdAt",
          order: filters.order || -1,
        };

        const response = await apiClient.seller.get(
          "/api/v1/accounts/wallet/history",
          { params }
        );

        if (response.success) {
          return response;
        } else {
          throw new Error(response.message || "Failed to fetch wallet history");
        }
      } catch (error: any) {
        console.error("Error fetching wallet history:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch wallet history",
          variant: "destructive",
        });
      }
    },
    [activeWalletCurrency, toast]
  );

  // Get wallet stats
  const getWalletStats = useCallback(
    async (timeRange: string = "30d") => {
      try {
        const response = await apiClient.seller.get(
          "/api/v1/accounts/wallet/stats",
          {
            params: { timeRange },
          }
        );

        if (response.success) {
          return response;
        } else {
          throw new Error(response.message || "Failed to fetch wallet stats");
        }
      } catch (error: any) {
        console.error("Error fetching wallet stats:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch wallet statistics",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const initiateAccountAdd = useCallback(
    async (params: AddWithdrawalAccountParams): Promise<string> => {
      try {
        const response = await apiClient.seller.post('/api/v1/accounts', params);
        
        if (response.status === "ok" && response.requestId) {
          toast({
            title: "OTP Sent",
            description: "Please check your email/phone for the OTP code to confirm account addition",
          });
          return response.requestId;
        } else {
          throw new Error(response.message || "Failed to initiate account addition");
        }
      } catch (error: any) {
        console.error("Error initiating account addition:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to initiate account addition",
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast]
  );

  const confirmAccountAdd = useCallback(
    async (requestId: string, otp: string): Promise<void> => {
      try {
        const response = await apiClient.seller.post('/api/v1/accounts', { requestId, otp });
        
        if (response.status === "ok") {
          toast({
            title: "Success",
            description: response.message || "Withdrawal account added successfully",
          });
          
          await fetchWithdrawalAccounts();
        } else {
          throw new Error(response.message || "Failed to add account");
        }
      } catch (error: any) {
        console.error("Error confirming account addition:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to confirm account addition",
          variant: "destructive",
        });
        throw error;
      }
    },
    [fetchWithdrawalAccounts, toast]
  );

  // Helper function for DELETE requests with body support
  const deleteWithBody = useCallback(async (path: string, body?: any): Promise<any> => {
    const authData = require("@/lib/auth/secure-storage").default.getAuthData();
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    
    if (authData?.token) {
      headers["Authorization"] = `Bearer ${authData.token}`;
    }
    
    if (authData?.businessId) {
      headers["x-business-key"] = authData.businessId;
    }
    
    const response = await fetch(`${baseUrl}${path}`, {
      method: "DELETE",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    return response.json();
  }, []);

  // Initiate withdrawal account deletion (Phase 1 - generates OTP)
  const initiateAccountDelete = useCallback(
    async (id: string): Promise<string> => {
      try {
        const response: DeleteAccountResponse = await deleteWithBody(`/api/v1/accounts/${id}`);
        
        if (response.status === "ok" && response.requestId) {
          toast({
            title: "OTP Sent",
            description: "Please check your email/phone for the OTP code to confirm deletion",
          });
          return response.requestId;
        } else {
          throw new Error(response.message || "Failed to initiate account deletion");
        }
      } catch (error: any) {
        console.error("Error initiating account deletion:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to initiate account deletion",
          variant: "destructive",
        });
        throw error;
      }
    },
    [deleteWithBody, toast]
  );

  // Confirm withdrawal account deletion with OTP (Phase 2)
  const confirmAccountDelete = useCallback(
    async (id: string, requestId: string, otp: string): Promise<void> => {
      try {
        const response: DeleteAccountResponse = await deleteWithBody(
          `/api/v1/accounts/${id}`,
          { requestId, otp }
        );
        
        if (response.status === "ok") {
          toast({
            title: "Success",
            description: response.message || "Withdrawal account deleted successfully",
          });
          
          // Refresh withdrawal accounts
          await fetchWithdrawalAccounts();
        } else {
          throw new Error(response.message || "Failed to delete account");
        }
      } catch (error: any) {
        console.error("Error confirming account deletion:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to confirm account deletion",
          variant: "destructive",
        });
        throw error;
      }
    },
    [deleteWithBody, fetchWithdrawalAccounts, toast]
  );

  // Withdraw funds (would need backend implementation)
  const withdrawFunds = useCallback(
    async (params: WithdrawFundsParams) => {
      try {
        const wallet = wallets.find(w => w.currency === params.currency);
        if (!wallet) {
          throw new Error(`Wallet not found for currency ${params.currency}`);
        }

        const requestBody = {
          accountId: params.accountId,
          amount: params.amount,
          walletId: wallet._id
        };

        const response = await apiClient.seller.post('/api/v1/accounts/withdraw', requestBody);

        if (response.status === "ok" || response.message) {
          toast({
            title: "Success",
            description: response.message || "Withdrawal request submitted successfully",
          });
        }

        await Promise.all([
          fetchTransactions(),
          getWalletBalance(params.currency),
        ]);

        return response;
      } catch (error: any) {
        console.error("Error withdrawing funds:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to process withdrawal",
          variant: "destructive",
        });
        throw error;
      }
    },
    [wallets, fetchTransactions, getWalletBalance, toast]
  );


  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchWallets(),
        fetchVirtualAccount(),
        fetchWithdrawalAccounts(),
        fetchTransactions(),
        fetchTransactionStats(),
        fetchBanks(),
      ]);
    };

    loadInitialData();
  }, [
    fetchWallets,
    fetchVirtualAccount,
    fetchWithdrawalAccounts,
    fetchTransactions,
    fetchTransactionStats,
    fetchBanks,
  ]);

  const value: WalletContextType = {
    wallets,
    virtualAccount,
    withdrawalAccounts,
    transactions,
    transactionStats,
    activeWalletCurrency,
    banks,
    isRefreshing,
    loading,
    pagination,
    setActiveWalletCurrency,
    fetchWallets,
    fetchVirtualAccount,
    refreshVirtualAccount,
    fetchWithdrawalAccounts,
    fetchTransactions,
    fetchTransactionStats,
    getTransactionById,
    initiateAccountAdd,
    confirmAccountAdd,
    initiateAccountDelete,
    confirmAccountDelete,
    withdrawFunds,
    getWalletBalance,
    getWalletHistory,
    getWalletStats,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

// Hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);

  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }

  return context;
};
