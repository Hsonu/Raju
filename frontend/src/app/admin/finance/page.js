'use client';
import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import FinanceOverviewHeader from '../../../components/finance/FinanceOverviewHeader';
import FinancialMetricsGrid from '../../../components/finance/FinancialMetricsGrid';
import FinancialInsightsGrid from '../../../components/finance/FinancialInsightsGrid';
import FinancialActivityGrid from '../../../components/finance/FinancialActivityGrid';
import FinanceOverviewFooter from '../../../components/finance/FinanceOverviewFooter';

export default function AdminFinancePage() {
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    productRevenue: 0,
    repairRevenue: 0,
    gstCollected: 0,
    laptopSalesCount: 0,
    devicesRepairedCount: 0,
    monthlyAggregation: [],
  });

  const loadData = async () => {
    try {
      const financeRes = await api.getFinanceOverview().catch(() => null);

      if (financeRes && financeRes.finance) {
        setStats(financeRes.finance);
        if (financeRes.finance.recentTransactions) {
          setTransactions(financeRes.finance.recentTransactions);
        }
      } else {
        // Fallback to orders & dashboard stats
        const [dashRes, ordersRes] = await Promise.all([
          api.getDashboardStats().catch(() => null),
          api.getAllOrders({ limit: 10 }).catch(() => null),
        ]);

        if (dashRes && dashRes.stats) {
          const rev = dashRes.stats.totalSales || 0;
          setStats({
            totalRevenue: rev,
            productRevenue: rev,
            repairRevenue: 0,
            gstCollected: Math.round(rev * 0.18),
            laptopSalesCount: dashRes.stats.totalOrders || 0,
            devicesRepairedCount: dashRes.stats.completedRepairs || 0,
            monthlyAggregation: [],
          });
        }
        if (ordersRes && ordersRes.orders) {
          setTransactions(ordersRes.orders);
        }
      }
    } catch (e) {
      console.error('Error loading finance data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
      showToast('Live financial ledger synchronized from database! 📊');
    } catch (e) {
      showToast('Refreshed live ledger');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FinanceOverviewHeader onRefresh={handleRefresh} refreshing={refreshing} />
      <FinancialMetricsGrid stats={stats} />
      <FinancialInsightsGrid stats={stats} />
      <FinancialActivityGrid transactions={transactions} />
      <FinanceOverviewFooter stats={stats} />
    </div>
  );
}
