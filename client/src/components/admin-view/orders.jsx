import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { useAuth0 } from '@auth0/auth0-react';
import { ShoppingBag, Eye, Calendar, DollarSign, Package, Search } from 'lucide-react';

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
  if (!document.head.querySelector('style[data-custom-scrollbar]')) {
    styleSheet.setAttribute('data-custom-scrollbar', 'true');
    document.head.appendChild(styleSheet);
  }
}

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const { authType } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();

  const handleFetchOrderDetails = React.useCallback((getId) => {
    const authParams = { getAccessTokenSilently, authType };
    dispatch(getOrderDetailsForAdmin({
      id: getId,
      ...authParams,
    }));
  }, [dispatch, getAccessTokenSilently, authType]);

  useEffect(() => {
    const authParams = { getAccessTokenSilently, authType };
    dispatch(getAllOrdersForAdmin(authParams));
  }, [dispatch, getAccessTokenSilently, authType]);

  console.log(orderDetails, "oder Details admin");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  // Memoized filtering for better performance
  const filteredOrders = useMemo(() => {
    if (!orderList) return [];
    
    return orderList.filter(order => {
      const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orderList, searchTerm, statusFilter]);

  // Memoized unique statuses
  const uniqueStatuses = useMemo(() => {
    if (!orderList) return [];
    return [...new Set(orderList.map(order => order.orderStatus))];
  }, [orderList]);

  // Memoized stats calculations
  const orderStats = useMemo(() => {
    if (!orderList) return { total: 0, confirmed: 0, pending: 0, revenue: 0 };
    
    return {
      total: orderList.length,
      confirmed: orderList.filter(order => order.orderStatus === "confirmed").length,
      pending: orderList.filter(order => order.orderStatus === "pending").length,
      revenue: orderList.reduce((sum, order) => sum + order.totalAmount, 0)
    };
  }, [orderList]);

  return (
    <div className="h-full flex flex-col p-6">
      {/* Premium Header */}
      <div className="mb-8 flex-shrink-0">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-1 h-12 bg-black rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold text-black">
              Orders Management
            </h1>
            <p className="text-gray-600 font-medium">
              Manage and track all customer orders
            </p>
          </div>
        </div>
      </div>

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-black">{orderStats.total}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-black">{orderStats.confirmed}</div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-black">{orderStats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-black">${orderStats.revenue.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Filters and Search */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-8 flex-shrink-0">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by ID or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm font-medium"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm font-medium"
            >
              <option value="all">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Premium Orders Table */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="w-5 h-5 mr-3 text-black" />
              <span className="text-xl font-bold text-black">Orders List</span>
              <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {filteredOrders.length} orders
              </span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900 text-center">Order ID</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Date</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Amount</TableHead>
                <TableHead className="font-semibold text-gray-900 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0
                ? filteredOrders.map((orderItem) => (
                    <TableRow key={orderItem._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-gray-900 text-center">
                        #{orderItem?._id.slice(-8)}
                      </TableCell>
                      <TableCell className="text-gray-600 text-center">
                        {new Date(orderItem?.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={`py-1 px-2 text-xs font-medium ${
                            orderItem?.orderStatus === "confirmed"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : orderItem?.orderStatus === "Rejected"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }`}
                        >
                          {orderItem?.orderStatus.charAt(0).toUpperCase() + orderItem?.orderStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900 text-center">
                        ${orderItem?.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <AdminOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <Package className="w-12 h-12 text-gray-400 mb-4" />
                          <p className="text-gray-500 text-lg font-medium">No orders found</p>
                          <p className="text-gray-400 text-sm">
                            {searchTerm || statusFilter !== "all" 
                              ? "Try adjusting your search or filter criteria"
                              : "No orders have been placed yet"
                            }
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
export default AdminOrdersView;
