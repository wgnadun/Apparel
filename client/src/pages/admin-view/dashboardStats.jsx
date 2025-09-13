import { fetchAdminStats } from '@/store/common/feature-slice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { DollarSign, ShoppingCart, TrendingUp, BarChart3, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function AdminDashboardStats() {
  const dispatch = useDispatch();
  const { adminStats: stats, statsLoading: loading, statsError: error } =
    useSelector((state) => state.commonFeature);
  const { authType } = useSelector(state => state.auth);
  const [days, setDays] = useState(30);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const authParams = { getAccessTokenSilently, authType };
    dispatch(fetchAdminStats({ days, ...authParams }));
  }, [dispatch, days, getAccessTokenSilently, authType]);

  console.log("📊 Stats data from store:", stats);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <ArrowDownRight className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 text-lg font-semibold text-center">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const labels = stats.ordersByDate.map(d => d._id);

  // Enhanced color schemes
  const revenueData = {
    labels,
    datasets: [{
      label: "Revenue ($)",
      data: stats.ordersByDate.map(d => d.revenue),
      borderColor: 'rgb(59, 130, 246)', // Blue-500
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  };

  const ordersData = {
    labels,
    datasets: [{
      label: "Orders",
      data: stats.ordersByDate.map(d => d.orders),
      borderColor: 'rgb(16, 185, 129)', // Emerald-500
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgb(16, 185, 129)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  };

  const statusData = {
    labels: stats.byStatus.map(s => s._id || "Unknown"),
    datasets: [{
      label: "Orders by Status",
      data: stats.byStatus.map(s => s.count),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',   // Red-500
        'rgba(245, 158, 11, 0.8)',  // Amber-500
        'rgba(34, 197, 94, 0.8)',   // Green-500
        'rgba(59, 130, 246, 0.8)',  // Blue-500
        'rgba(147, 51, 234, 0.8)',  // Purple-500
        'rgba(236, 72, 153, 0.8)',  // Pink-500
        'rgba(20, 184, 166, 0.8)',  // Teal-500
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(245, 158, 11)',
        'rgb(34, 197, 94)',
        'rgb(59, 130, 246)',
        'rgb(147, 51, 234)',
        'rgb(236, 72, 153)',
        'rgb(20, 184, 166)',
      ],
      borderWidth: 2,
      hoverOffset: 10
    }]
  };

  // Helper function to truncate long product names
  const truncateLabel = (label, maxLength = 20) => {
    if (!label) return 'Unknown Product';
    if (label.length <= maxLength) return label;
    return label.substring(0, maxLength) + '...';
  };

  const topProductsData = {
    labels: stats.topProducts.map(p => truncateLabel(p.title || p._id)),
    datasets: [{
      label: "Quantity Sold",
      data: stats.topProducts.map(p => p.qtySold),
      // Store full product data for tooltips
      productData: stats.topProducts,
      backgroundColor: [
        'rgba(168, 85, 247, 0.9)',  // Purple-500
        'rgba(236, 72, 153, 0.9)',  // Pink-500
        'rgba(59, 130, 246, 0.9)',  // Blue-500
        'rgba(16, 185, 129, 0.9)',  // Emerald-500
        'rgba(245, 158, 11, 0.9)',  // Amber-500
        'rgba(239, 68, 68, 0.9)',   // Red-500
        'rgba(20, 184, 166, 0.9)',  // Teal-500
        'rgba(34, 197, 94, 0.9)',   // Green-500
      ],
      borderColor: [
        'rgb(168, 85, 247)',
        'rgb(236, 72, 153)',
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
        'rgb(20, 184, 166)',
        'rgb(34, 197, 94)',
      ],
      borderWidth: 2,
      borderRadius: 12,
      borderSkipped: false,
      hoverBackgroundColor: [
        'rgba(168, 85, 247, 1)',  // Purple-500
        'rgba(236, 72, 153, 1)',  // Pink-500
        'rgba(59, 130, 246, 1)',  // Blue-500
        'rgba(16, 185, 129, 1)',  // Emerald-500
        'rgba(245, 158, 11, 1)',  // Amber-500
        'rgba(239, 68, 68, 1)',   // Red-500
        'rgba(20, 184, 166, 1)',  // Teal-500
        'rgba(34, 197, 94, 1)',   // Green-500
      ],
    }]
  };

  // Chart options for better responsiveness and styling
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: '600'
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 13,
            weight: '600'
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          boxWidth: 12,
          boxHeight: 12,
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const dataset = data.datasets[0];
              const total = dataset.data.reduce((sum, value) => sum + value, 0);
              
              return data.labels.map((label, i) => {
                const value = dataset.data[i];
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label}: ${value} orders (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(148, 163, 184, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: function(context) {
            return `Order Status: ${context[0].label}`;
          },
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return [
              `Orders: ${value.toLocaleString()}`,
              `Percentage: ${percentage}%`,
              `Total Orders: ${total.toLocaleString()}`
            ];
          }
        }
      },
      datalabels: false
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2, // Higher resolution for crisp text
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 16,
            weight: '700',
            family: "'Inter', 'Segoe UI', sans-serif"
          },
          usePointStyle: true,
          padding: 25,
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        titleColor: '#f1f5f9',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(148, 163, 184, 0.4)',
        borderWidth: 1,
        cornerRadius: 16,
        padding: 20,
        titleFont: {
          size: 16,
          weight: '700'
        },
        bodyFont: {
          size: 14,
          weight: '500'
        },
        titleAlign: 'center',
        bodyAlign: 'left',
        displayColors: false,
        caretSize: 8,
        callbacks: {
          title: function(context) {
            const product = stats.topProducts[context[0].dataIndex];
            const fullTitle = product?.title || product?._id || 'Unknown Product';
            return `📦 ${fullTitle}`;
          },
          label: function(context) {
            const product = stats.topProducts[context.dataIndex];
            const value = context.raw;
            
            if (!product) {
              return ['❌ Product data not available'];
            }
            
            const lines = [
              `🛍️ Quantity Sold: ${value.toLocaleString()}`,
              `💰 Revenue: $${product.revenue?.toLocaleString() || '0'}`,
              `📊 Rank: #${context.dataIndex + 1}`,
              '', // Empty line for spacing
            ];
            
            // Add additional product details if available
            if (product.category) {
              lines.push(`🏷️ Category: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}`);
            }
            
            if (product.brand) {
              lines.push(`🏢 Brand: ${product.brand.charAt(0).toUpperCase() + product.brand.slice(1)}`);
            }
            
            if (product.price) {
              lines.push(`💵 Price: $${product.price.toLocaleString()}`);
            }
            
            if (product.salePrice && product.salePrice > 0) {
              lines.push(`🔥 Sale Price: $${product.salePrice.toLocaleString()}`);
            }
            
            if (product.totalStock !== undefined) {
              lines.push(`📦 Stock: ${product.totalStock.toLocaleString()}`);
            }
            
            // Add performance metrics
            if (product.qtySold && product.revenue) {
              const avgPrice = (product.revenue / product.qtySold).toFixed(2);
              lines.push(`📈 Avg Price: $${avgPrice}`);
            }
            
            return lines;
          },
          afterLabel: function(context) {
            const product = stats.topProducts[context.dataIndex];
            const additionalInfo = [];
            
            if (product?.description) {
              const description = product.description.length > 120 
                ? product.description.substring(0, 120) + '...' 
                : product.description;
              additionalInfo.push(`📝 ${description}`);
            }
            
            if (product?.image) {
              additionalInfo.push(`🖼️ Image: Available`);
            }
            
            if (product?.createdAt) {
              const date = new Date(product.createdAt).toLocaleDateString();
              additionalInfo.push(`📅 Added: ${date}`);
            }
            
            return additionalInfo;
          },
          footer: function(context) {
            const product = stats.topProducts[context[0].dataIndex];
            const footerLines = [];
            
            if (product?.averageReview !== undefined && product.averageReview > 0) {
              const stars = '⭐'.repeat(Math.round(product.averageReview));
              footerLines.push(`${stars} Rating: ${product.averageReview.toFixed(1)}/5.0`);
            }
            
            // Add market share percentage
            const totalSold = stats.topProducts.reduce((sum, p) => sum + p.qtySold, 0);
            if (totalSold > 0) {
              const marketShare = ((product.qtySold / totalSold) * 100).toFixed(1);
              footerLines.push(`📊 Market Share: ${marketShare}%`);
            }
            
            return footerLines;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 13,
            weight: '600',
            family: "'Inter', 'Segoe UI', sans-serif"
          },
          color: '#374151',
          maxRotation: 45,
          minRotation: 0,
          padding: 10
        },
        title: {
          display: true,
          text: 'Products',
          font: {
            size: 14,
            weight: '700',
            family: "'Inter', 'Segoe UI', sans-serif"
          },
          color: '#374151',
          padding: 20
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.08)',
          lineWidth: 1
        },
        ticks: {
          font: {
            size: 13,
            weight: '600',
            family: "'Inter', 'Segoe UI', sans-serif"
          },
          color: '#374151',
          padding: 12,
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Quantity Sold',
          font: {
            size: 14,
            weight: '700',
            family: "'Inter', 'Segoe UI', sans-serif"
          },
          color: '#374151',
          padding: 20
        }
      }
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-1 h-12 bg-gray-800 rounded-full"></div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Analytics Hub
              </h1>
              <p className="text-gray-600 mt-1 font-medium">
                Performance insights and metrics
              </p>
            </div>
          </div>
        </div>

        {/* Time Period Filter */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-gray-700 font-medium">Time Period:</span>
            </div>
            <div className="flex gap-2">
              {[7, 30, 90].map(num => (
                <button
                  key={num}
                  onClick={() => setDays(num)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200
                    ${days === num
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {num === 7 ? 'Last Week' : num === 30 ? 'Last Month' : 'Last Quarter'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gray-800 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-gray-900">Revenue Trend</h3>
            </div>
            <div className="h-64 sm:h-80">
              <Line data={revenueData} options={lineChartOptions} />
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gray-800 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-gray-900">Orders Trend</h3>
            </div>
            <div className="h-64 sm:h-80">
              <Line data={ordersData} options={lineChartOptions} />
            </div>
          </div>

          {/* Status Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gray-800 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-gray-900">Order Status</h3>
            </div>
            <div className="h-64 sm:h-80">
              <Pie data={statusData} options={pieChartOptions} />
            </div>
          </div>

          {/* Top Products Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-1 h-8 bg-gray-800 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-gray-900">Top Products</h3>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {stats.topProducts.length} products
              </div>
            </div>
            <div className="h-72 sm:h-80 lg:h-96 relative">
              <Bar data={topProductsData} options={barChartOptions} />
            </div>
            {stats.topProducts.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">No product data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-gray-900">
              ${stats.ordersByDate.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+8%</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.ordersByDate.reduce((sum, d) => sum + d.orders, 0).toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+15%</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1">Products Sold</div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.topProducts.reduce((sum, p) => sum + p.qtySold, 0).toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex items-center text-red-600">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">-3%</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1">Avg Order Value</div>
            <div className="text-2xl font-bold text-gray-900">
              ${Math.round(stats.ordersByDate.reduce((sum, d) => sum + d.revenue, 0) / stats.ordersByDate.reduce((sum, d) => sum + d.orders, 0) || 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardStats;