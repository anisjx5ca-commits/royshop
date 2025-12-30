import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { FiShoppingCart, FiTrendingUp, FiBarChart2, FiCheck, FiLock } from 'react-icons/fi';

interface TotalRevenueData {
  total_income: number;
  total_orders_completed: number;
}

interface DailySalesData {
  sale_date: string;
  daily_income: number;
  orders_count: number;
}

interface PendingOrder {
  id: string;
  customer_email: string;
  total_amount: number;
  items: any[];
  created_at: string;
  payment_status: string;
}

const ADMIN_PASSWORD = 'admin123'; // Hardcoded password for now

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);

  const [totalRevenue, setTotalRevenue] = useState<TotalRevenueData | null>(null);
  const [dailySales, setDailySales] = useState<DailySalesData[]>([]);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);

  // Handle password check
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordPrompt(false);
      toast.success('Admin access granted!');
    } else {
      toast.error('Incorrect password');
      setPasswordInput('');
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch total revenue data
        const { data: revenueData, error: revenueError } = await supabase
          .from('total_revenue_view')
          .select('*')
          .single();

        if (revenueError) throw revenueError;
        setTotalRevenue(revenueData);

        // Fetch daily sales data
        const { data: salesData, error: salesError } = await supabase
          .from('daily_sales_view')
          .select('*')
          .order('sale_date', { ascending: false });

        if (salesError) throw salesError;
        setDailySales(salesData || []);

        // Fetch pending orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('payment_status', 'n')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setPendingOrders(ordersData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Handle confirm sale & deduct stock
  const handleConfirmSale = async (orderId: string) => {
    try {
      setConfirmingOrderId(orderId);

      // Update payment_status to 'y'
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: 'y' })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Sale confirmed & stock deducted!');
      
      // Remove from pending orders
      setPendingOrders(prev => prev.filter(order => order.id !== orderId));

      // Refresh revenue data
      const { data: revenueData } = await supabase
        .from('total_revenue_view')
        .select('*')
        .single();
      if (revenueData) setTotalRevenue(revenueData);

      // Refresh daily sales
      const { data: salesData } = await supabase
        .from('daily_sales_view')
        .select('*')
        .order('sale_date', { ascending: false });
      if (salesData) setDailySales(salesData);
    } catch (error) {
      console.error('Error confirming sale:', error);
      toast.error('Failed to confirm sale');
    } finally {
      setConfirmingOrderId(null);
    }
  };

  // Password Prompt UI
  if (showPasswordPrompt) {
    return (
      <div className="min-h-screen bg-neon-black flex items-center justify-center px-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-pink rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-cyan rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-neon-black border-2 border-neon-pink rounded-lg p-8 max-w-md w-full"
          style={{
            boxShadow: '0 0 30px rgba(255, 0, 110, 0.3), inset 0 0 20px rgba(255, 0, 110, 0.1)',
          }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-neon-pink rounded-full animate-pulse">
              <FiLock className="w-6 h-6 text-neon-black" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 text-neon-white" style={{ textShadow: '0 0 20px rgba(255, 0, 110, 0.6)' }}>
            Admin Access
          </h1>
          <p className="text-center text-neon-cyan mb-6">Enter password to continue</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-neon-dark-gray border-2 border-neon-cyan rounded-lg px-4 py-3 text-neon-white placeholder-neon-gray focus:outline-none focus:border-neon-pink transition-colors"
                style={{
                  boxShadow: '0 0 10px rgba(0, 217, 255, 0.2)',
                }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-neon-pink text-neon-black font-bold py-3 rounded-lg transition-all duration-300 hover:bg-neon-pink-dark"
              style={{
                boxShadow: '0 0 20px rgba(255, 0, 110, 0.4)',
              }}
            >
              Unlock Dashboard
            </motion.button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 text-neon-cyan hover:text-neon-pink transition-colors text-sm"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neon-black text-neon-white overflow-hidden relative pt-32 pb-12 px-4">
      {/* Cyberpunk Grid Background */}
      <div className="fixed inset-0 opacity-15 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="admin-grid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF006E" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <g stroke="url(#admin-grid)" strokeWidth="0.5" opacity="0.3">
            {Array.from({ length: 20 }).map((_, i) => (
              <g key={i}>
                <line x1={`${i * 5}%`} y1="0%" x2={`${i * 5}%`} y2="100%" />
                <line x1="0%" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold" style={{ textShadow: '0 0 20px rgba(255, 0, 110, 0.6)' }}>
              Admin Dashboard
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-neon-cyan text-neon-black font-bold rounded-lg hover:bg-neon-cyan-dark transition-all"
              style={{
                boxShadow: '0 0 15px rgba(0, 217, 255, 0.4)',
              }}
            >
              Exit
            </motion.button>
          </div>
          <p className="text-neon-cyan text-lg">Real-time sales tracking & order management</p>
        </motion.div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-neon-pink border-t-neon-cyan rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-neon-gray">Loading dashboard...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Total Revenue Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-neon-dark-gray border-2 border-neon-green rounded-lg p-6"
                style={{
                  boxShadow: '0 0 30px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.05)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neon-green">Total Revenue</h3>
                  <div className="p-2 bg-neon-green rounded-lg">
                    <FiTrendingUp className="w-5 h-5 text-neon-black" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-neon-green" style={{ textShadow: '0 0 20px rgba(0, 255, 65, 0.6)' }}>
                  {totalRevenue ? `DA ${totalRevenue.total_income.toLocaleString('fr-DZ')}` : 'Loading...'}
                </p>
                <p className="text-sm text-neon-gray mt-2">Total income from completed orders</p>
              </motion.div>

              {/* Completed Orders Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-neon-dark-gray border-2 border-neon-cyan rounded-lg p-6"
                style={{
                  boxShadow: '0 0 30px rgba(0, 217, 255, 0.3), inset 0 0 20px rgba(0, 217, 255, 0.05)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neon-cyan">Completed Orders</h3>
                  <div className="p-2 bg-neon-cyan rounded-lg">
                    <FiShoppingCart className="w-5 h-5 text-neon-black" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-neon-cyan" style={{ textShadow: '0 0 20px rgba(0, 217, 255, 0.6)' }}>
                  {totalRevenue ? totalRevenue.total_orders_completed : 'Loading...'}
                </p>
                <p className="text-sm text-neon-gray mt-2">Total completed transactions</p>
              </motion.div>

              {/* Average Order Value Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-neon-dark-gray border-2 border-neon-pink rounded-lg p-6"
                style={{
                  boxShadow: '0 0 30px rgba(255, 0, 110, 0.3), inset 0 0 20px rgba(255, 0, 110, 0.05)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neon-pink">Average Order Value</h3>
                  <div className="p-2 bg-neon-pink rounded-lg">
                    <FiBarChart2 className="w-5 h-5 text-neon-black" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-neon-pink" style={{ textShadow: '0 0 20px rgba(255, 0, 110, 0.6)' }}>
                  {totalRevenue && totalRevenue.total_orders_completed > 0
                    ? `DA ${(totalRevenue.total_income / totalRevenue.total_orders_completed).toFixed(0)}`
                    : 'N/A'}
                </p>
                <p className="text-sm text-neon-gray mt-2">Average revenue per order</p>
              </motion.div>
            </div>

            {/* Daily Sales Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-neon-dark-gray border-2 border-neon-cyan rounded-lg p-6 mb-12"
              style={{
                boxShadow: '0 0 30px rgba(0, 217, 255, 0.2), inset 0 0 20px rgba(0, 217, 255, 0.05)',
              }}
            >
              <h2 className="text-2xl font-bold mb-6 text-neon-cyan" style={{ textShadow: '0 0 15px rgba(0, 217, 255, 0.6)' }}>
                Daily Sales
              </h2>

              {dailySales.length === 0 ? (
                <p className="text-neon-gray py-8 text-center">No sales data available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-neon-cyan">
                        <th className="text-left py-4 px-4 text-neon-cyan font-semibold">Date</th>
                        <th className="text-center py-4 px-4 text-neon-cyan font-semibold">Orders Count</th>
                        <th className="text-right py-4 px-4 text-neon-cyan font-semibold">Income (DA)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailySales.map((sale, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className="border-b border-neon-gray-dark hover:bg-neon-gray-dark-2 transition-colors"
                        >
                          <td className="py-4 px-4 text-neon-white">
                            {new Date(sale.sale_date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })}
                          </td>
                          <td className="py-4 px-4 text-center text-neon-green font-semibold">{sale.orders_count}</td>
                          <td className="py-4 px-4 text-right text-neon-pink font-semibold">
                            DA {sale.daily_income.toLocaleString('fr-DZ')}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* Pending Orders Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-neon-dark-gray border-2 border-neon-pink rounded-lg p-6"
              style={{
                boxShadow: '0 0 30px rgba(255, 0, 110, 0.2), inset 0 0 20px rgba(255, 0, 110, 0.05)',
              }}
            >
              <h2 className="text-2xl font-bold mb-6 text-neon-pink" style={{ textShadow: '0 0 15px rgba(255, 0, 110, 0.6)' }}>
                Pending Orders ({pendingOrders.length})
              </h2>

              {pendingOrders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neon-gray text-lg">No pending orders</p>
                  <p className="text-neon-gray text-sm mt-2">All orders have been confirmed!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-neon-black border border-neon-pink rounded-lg p-4 hover:border-neon-pink-bright transition-colors"
                      style={{
                        boxShadow: '0 0 15px rgba(255, 0, 110, 0.1)',
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        {/* Order ID & Date */}
                        <div>
                          <p className="text-sm text-neon-gray">Order ID</p>
                          <p className="text-neon-white font-mono text-sm truncate">{order.id.slice(0, 12)}...</p>
                          <p className="text-xs text-neon-gray mt-1">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>

                        {/* Customer Email */}
                        <div>
                          <p className="text-sm text-neon-gray">Customer</p>
                          <p className="text-neon-white text-sm truncate">{order.customer_email}</p>
                        </div>

                        {/* Items Count & Amount */}
                        <div>
                          <p className="text-sm text-neon-gray">Items</p>
                          <p className="text-neon-cyan font-semibold">{order.items?.length || 0} items</p>
                          <p className="text-neon-pink font-bold text-lg mt-1">
                            DA {order.total_amount.toLocaleString('fr-DZ')}
                          </p>
                        </div>

                        {/* Confirm Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleConfirmSale(order.id)}
                          disabled={confirmingOrderId === order.id}
                          className="flex items-center justify-center gap-2 bg-neon-green text-neon-black font-bold py-2 px-4 rounded-lg hover:bg-neon-green-bright transition-all disabled:opacity-50"
                          style={{
                            boxShadow: '0 0 15px rgba(0, 255, 65, 0.3)',
                          }}
                        >
                          {confirmingOrderId === order.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-neon-black border-t-transparent rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <FiCheck className="w-4 h-4" />
                              <span>Confirm Sale</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
