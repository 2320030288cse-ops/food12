import React, { useState } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Receipt, 
  Download, 
  Printer, 
  User, 
  MapPin, 
  Clock,
  Search,
  FileText,
  CheckCircle
} from 'lucide-react';

const BillGeneration: React.FC = () => {
  const { orders, payments } = useOrder();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const completedOrders = orders.filter(order => order.status === 'completed');
  
  const filteredOrders = completedOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (order.tableNumber && order.tableNumber.toString().includes(searchTerm));
    return matchesSearch;
  });

  const getOrderPayments = (orderId: string) => {
    return payments.filter(payment => payment.orderId === orderId);
  };

  const generateBill = (order: any) => {
    const orderPayments = getOrderPayments(order.id);
    const billData = {
      orderId: order.id,
      customerName: order.customerName || 'Walk-in Customer',
      tableNumber: order.tableNumber,
      items: order.items,
      subtotal: order.total - order.tax,
      tax: order.tax,
      total: order.total,
      payments: orderPayments,
      date: new Date(order.createdAt).toLocaleString(),
      completedAt: order.completedAt ? new Date(order.completedAt).toLocaleString() : null,
      paymentStatus: order.paymentStatus
    };

    return billData;
  };

  const downloadBill = (order: any) => {
    const bill = generateBill(order);
    const billContent = `
═══════════════════════════════════════
           GS RESTAURANT
         Order Receipt
═══════════════════════════════════════

Order #: ${bill.orderId.slice(-6)}
Customer: ${bill.customerName}
${bill.tableNumber ? `Table: ${bill.tableNumber}` : ''}
Date: ${bill.date}
${bill.completedAt ? `Completed: ${bill.completedAt}` : ''}

═══════════════════════════════════════
                ITEMS
═══════════════════════════════════════
${bill.items.map((item: any) => 
  `${item.name.padEnd(25)} x${item.quantity.toString().padStart(2)} ₹${item.subtotal.toFixed(2).padStart(8)}`
).join('\n')}

═══════════════════════════════════════
               SUMMARY
═══════════════════════════════════════
Subtotal:                    ₹${(bill.subtotal).toFixed(2).padStart(8)}
Tax (18%):                   ₹${bill.tax.toFixed(2).padStart(8)}
Total:                       ₹${bill.total.toFixed(2).padStart(8)}

═══════════════════════════════════════
               PAYMENT
═══════════════════════════════════════
${bill.payments.map((payment: any) => 
  `${payment.method.toUpperCase().padEnd(20)} ₹${payment.amount.toFixed(2).padStart(8)}`
).join('\n')}

Status: ${bill.paymentStatus.toUpperCase()}

═══════════════════════════════════════
        Thank you for dining with us!
           Visit us again soon!
═══════════════════════════════════════
    `;

    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GS-Restaurant-Bill-${order.id.slice(-6)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printBill = (order: any) => {
    const bill = generateBill(order);
    const printContent = `
      <html>
        <head>
          <title>GS Restaurant - Bill #${bill.orderId.slice(-6)}</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              font-size: 14px; 
              margin: 20px; 
              line-height: 1.4;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            .header h1 { 
              font-size: 24px; 
              margin: 0; 
              font-weight: bold;
            }
            .header p { 
              margin: 5px 0; 
              font-size: 16px;
            }
            .section { 
              margin: 20px 0; 
            }
            .divider { 
              border-top: 1px dashed #000; 
              margin: 15px 0; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
            }
            th, td { 
              text-align: left; 
              padding: 8px 5px; 
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .total-row { 
              font-weight: bold; 
              font-size: 16px;
              background-color: #f9f9f9;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              border-top: 2px solid #000;
              padding-top: 20px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 20px;
            }
            .status-paid {
              color: #16a34a;
              font-weight: bold;
            }
            .status-pending {
              color: #ea580c;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🍽️ GS RESTAURANT</h1>
            <p>Order Receipt</p>
          </div>
          
          <div class="section">
            <div class="info-grid">
              <div><strong>Order #:</strong> ${bill.orderId.slice(-6)}</div>
              <div><strong>Date:</strong> ${bill.date}</div>
              <div><strong>Customer:</strong> ${bill.customerName}</div>
              ${bill.tableNumber ? `<div><strong>Table:</strong> ${bill.tableNumber}</div>` : '<div></div>'}
            </div>
            ${bill.completedAt ? `<p><strong>Completed:</strong> ${bill.completedAt}</p>` : ''}
          </div>
          
          <div class="divider"></div>
          
          <div class="section">
            <h3>ORDER ITEMS</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${bill.items.map((item: any) => 
                  `<tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price.toFixed(2)}</td>
                    <td>₹${item.subtotal.toFixed(2)}</td>
                  </tr>`
                ).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="divider"></div>
          
          <div class="section">
            <table>
              <tr><td>Subtotal:</td><td style="text-align: right;">₹${(bill.subtotal).toFixed(2)}</td></tr>
              <tr><td>Tax (18%):</td><td style="text-align: right;">₹${bill.tax.toFixed(2)}</td></tr>
              <tr class="total-row"><td>TOTAL:</td><td style="text-align: right;">₹${bill.total.toFixed(2)}</td></tr>
            </table>
          </div>
          
          <div class="divider"></div>
          
          <div class="section">
            <h3>PAYMENT DETAILS</h3>
            ${bill.payments.length > 0 ? 
              bill.payments.map((payment: any) => 
                `<p><strong>${payment.method.toUpperCase()}:</strong> ₹${payment.amount.toFixed(2)}</p>`
              ).join('') :
              '<p>No payment recorded</p>'
            }
            <p><strong>Payment Status:</strong> 
              <span class="${bill.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'}">
                ${bill.paymentStatus.toUpperCase()}
              </span>
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Thank you for dining with us!</strong></p>
            <p>Visit us again soon! 🙏</p>
            <p style="font-size: 12px; margin-top: 15px;">
              GS Restaurant • Best Food, Best Service<br>
              For feedback: feedback@gsrestaurant.com
            </p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
          <Receipt className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Bill Generation
          </h2>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Generate and download bills for completed orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders List */}
        <div className={`p-6 rounded-xl border ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-lg`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
            <h3 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Completed Orders
            </h3>
            
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className={`text-center py-12 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Orders Found</p>
              <p className="text-sm">Complete some orders to generate bills</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedOrder?.id === order.id
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-lg'
                      : isDark 
                        ? 'bg-gray-700 border-gray-600 hover:border-gray-500' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Order #{order.id.slice(-6)}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                      }`}>
                        {order.paymentStatus}
                      </span>
                      <span className={`text-lg font-bold ${
                        selectedOrder?.id === order.id ? 'text-blue-600' : isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        ₹{order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className={`h-4 w-4 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    {order.tableNumber && (
                      <div className="flex items-center space-x-2">
                        <MapPin className={`h-4 w-4 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          Table {order.tableNumber}
                        </span>
                      </div>
                    )}
                    
                    {order.customerName && (
                      <div className="flex items-center space-x-2">
                        <User className={`h-4 w-4 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {order.customerName}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {order.items.length} items
                      </span>
                      {order.paymentStatus === 'paid' && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">Paid</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bill Preview */}
        <div className={`p-6 rounded-xl border ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } shadow-lg`}>
          {selectedOrder ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Bill Preview
                  </h3>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Order #{selectedOrder.id.slice(-6)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => printBill(selectedOrder)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                    title="Print Bill"
                  >
                    <Printer className="h-5 w-5" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => downloadBill(selectedOrder)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                    title="Download Bill"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className={`p-6 rounded-lg border-2 border-dashed ${
                isDark ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-300'
              } font-mono text-sm`}>
                <div className="text-center mb-6">
                  <h4 className={`font-bold text-xl ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    🍽️ GS RESTAURANT
                  </h4>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
                    Order Receipt
                  </p>
                  <div className="w-full border-t-2 border-dashed border-gray-400 mt-2"></div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>ORDER #</span>
                      <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>
                        {selectedOrder.id.slice(-6)}
                      </div>
                    </div>
                    <div>
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>DATE</span>
                      <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>CUSTOMER</span>
                      <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>
                        {selectedOrder.customerName || 'Walk-in Customer'}
                      </div>
                    </div>
                    {selectedOrder.tableNumber && (
                      <div>
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs`}>TABLE</span>
                        <div className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>
                          {selectedOrder.tableNumber}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-gray-400 pt-4 mb-4">
                  <h5 className={`font-bold mb-3 text-center ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    ORDER ITEMS
                  </h5>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                            {item.name}
                          </span>
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
                            x{item.quantity}
                          </span>
                        </div>
                        <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>
                          ₹{item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-gray-400 pt-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Subtotal:
                      </span>
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>
                        ₹{(selectedOrder.total - selectedOrder.tax).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Tax (18%):
                      </span>
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>
                        ₹{selectedOrder.tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-400 pt-2">
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                        TOTAL:
                      </span>
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ₹{selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-gray-400 pt-4 mb-4">
                  <h5 className={`font-bold mb-3 text-center ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    PAYMENT DETAILS
                  </h5>
                  <div className="space-y-2">
                    {getOrderPayments(selectedOrder.id).length > 0 ? (
                      getOrderPayments(selectedOrder.id).map((payment: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {payment.method.toUpperCase()}:
                          </span>
                          <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>
                            ₹{payment.amount.toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500">
                        No payment recorded
                      </div>
                    )}
                    <div className="flex justify-between font-bold pt-2 border-t border-gray-400">
                      <span className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Status:
                      </span>
                      <span className={`${
                        selectedOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      } font-bold`}>
                        {selectedOrder.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-gray-400 pt-4 text-center">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} font-medium text-lg`}>
                    Thank you for dining with us! 🙏
                  </p>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm mt-2`}>
                    Visit us again soon!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`text-center py-12 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Receipt className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-lg font-medium mb-2">Select an Order</p>
              <p className="text-sm">Choose a completed order to preview and generate bill</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillGeneration;