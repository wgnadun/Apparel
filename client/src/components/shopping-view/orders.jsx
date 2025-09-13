import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

// Add custom scrollbar styles
const customScrollbarStyles = `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #9CA3AF #F3F4F6;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #F3F4F6;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #9CA3AF;
    border-radius: 4px;
    border: 1px solid #F3F4F6;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #6B7280;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customScrollbarStyles;
  if (!document.head.querySelector('style[data-custom-scrollbar-orders]')) {
    styleSheet.setAttribute('data-custom-scrollbar-orders', 'true');
    document.head.appendChild(styleSheet);
  }
}

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "delivered":
        return "bg-black text-white hover:bg-gray-800";
      case "pending":
      case "processing":
        return "bg-gray-600 text-white hover:bg-gray-700";
      case "rejected":
      case "cancelled":
        return "bg-gray-400 text-white hover:bg-gray-500";
      case "shipped":
        return "bg-gray-800 text-white hover:bg-gray-900";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "delivered":
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case "pending":
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case "shipped":
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586V7a1 1 0 00-1-1h-1z" />
          </svg>
        );
      case "rejected":
      case "cancelled":
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // Filter and sort orders
  
  const filteredOrders = orderList?.filter(order => {
    const orderStatus = order.orderStatus || "";
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderStatus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      orderStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }) || [];

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.orderDate) - new Date(a.orderDate);
      case "oldest":
        return new Date(a.orderDate) - new Date(b.orderDate);
      case "amount-high":
        return b.totalAmount - a.totalAmount;
      case "amount-low":
        return a.totalAmount - b.totalAmount;
      default:
        return 0;
    }
  });

  const uniqueStatuses = [...new Set(orderList?.map(order => order.orderStatus) || [])];

  if (!orderList || orderList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 text-8xl mb-6">
                <svg className="w-32 h-32 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8.5 13a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 text-lg mb-6">
                You haven't placed any orders yet. Start shopping to see your order history here.
              </p>
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Order Management
          </h1>
          <p className="text-gray-600 text-lg">
            Track and manage all your orders in one place
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="bg-black text-white rounded-t-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between h-full py-5">
              <div>
                <CardTitle className="text-3xl font-bold">Order History</CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Filters and Search */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Orders
                  </label>
                  <input
                    type="text"
                    placeholder="Search by Order ID or Status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Statuses</option>
                    {uniqueStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Orders
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount-high">Highest Amount</option>
                    <option value="amount-low">Lowest Amount</option>
                  </select>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-600">
                  Showing {sortedOrders.length} of {orderList?.length || 0} orders
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-sm text-black hover:text-gray-600 mt-2 sm:mt-0"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>

            {/* Orders Table */}
            <div className={`overflow-x-auto ${sortedOrders.length > 3 ? 'max-h-96 overflow-y-auto custom-scrollbar' : ''}`}>
              <Table>
                <TableHeader className={`${sortedOrders.length > 3 ? 'sticky top-0 bg-gray-100 z-10' : ''}`}>
                  <TableRow className="bg-gray-100 hover:bg-gray-100">
                    <TableHead className="text-center font-semibold text-gray-900 py-4">
                      Order ID
                    </TableHead>
                    <TableHead className="text-center font-semibold text-gray-900 py-4">
                      Order Date
                    </TableHead>
                    <TableHead className="text-center font-semibold text-gray-900 py-4">
                      Status
                    </TableHead>
                    <TableHead className="text-center font-semibold text-gray-900 py-4">
                      Total Amount
                    </TableHead>
                    <TableHead className="text-center font-semibold text-gray-900 py-4">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOrders.length > 0 ? (
                    sortedOrders.map((orderItem, index) => (
                      <TableRow key={orderItem._id} className="hover:bg-gray-50 transition-colors duration-200">
                        <TableCell className="text-center py-4">
                          <div className="font-mono text-sm font-medium text-gray-800">
                            #{orderItem._id.slice(-8).toUpperCase()}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-center py-4">
                          <div className="text-gray-800 font-medium">
                            {new Date(orderItem.orderDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(orderItem.orderDate).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-center py-4">
                          <Badge className={`py-2 px-4 font-semibold rounded-full inline-flex items-center transition-all duration-200 ${getStatusColor(orderItem.orderStatus)}`}>
                            {getStatusIcon(orderItem.orderStatus)}
                            {(orderItem.orderStatus
                              ? orderItem.orderStatus.charAt(0).toUpperCase() + orderItem.orderStatus.slice(1)
                              : "Unknown")}
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="text-center py-4">
                          <div className="text-lg font-bold text-gray-900">
                            ${orderItem.totalAmount.toFixed(2)}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-center py-4">
                          <Dialog
                            open={openDetailsDialog}
                            onOpenChange={() => {
                              setOpenDetailsDialog(false);
                              dispatch(resetOrderDetails());
                            }}
                          >
                            <Button
                              onClick={() => handleFetchOrderDetails(orderItem._id)}
                              className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                            >
                              View Details
                            </Button>
                            <ShoppingOrderDetailsView orderDetails={orderDetails} />
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="text-gray-500">
                          <div className="text-4xl mb-4">
                            <svg className="w-16 h-16 mx-auto text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Found</h3>
                          <p className="text-gray-500">
                            {searchTerm ? `No orders match "${searchTerm}"` : "No orders match your current filters"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Order Statistics */}
        {orderList && orderList.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-8">
            <div className="bg-black p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold">
                {orderList.length}
              </div>
              <div className="text-sm opacity-90 font-medium">Total Orders</div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold">
                {orderList.filter(
                  o =>
                    o.orderStatus &&
                    (o.orderStatus.toLowerCase() === 'confirmed' ||
                     o.orderStatus.toLowerCase() === 'delivered')
                ).length}
              </div>
              <div className="text-sm opacity-90 font-medium">Completed</div>
            </div>
            
            <div className="bg-gray-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold">
                {orderList.filter(
                  o =>
                    o.orderStatus &&
                    (o.orderStatus.toLowerCase() === 'pending' ||
                     o.orderStatus.toLowerCase() === 'processing')
                ).length}
              </div>
              <div className="text-sm opacity-90 font-medium">In Progress</div>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl font-bold">
                ${orderList.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(0)}
              </div>
              <div className="text-sm opacity-90 font-medium">Total Spent</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingOrders;