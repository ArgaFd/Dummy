const Order = require('../models/order');
const Payment = require('../models/payment');
const Menu = require('../models/menu');
const { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, format } = require('date-fns');

const getSalesReport = async (req, res) => {
  try {
    const { period = 'daily', start, end } = req.query;
    
    let startDate, endDate;
    const now = new Date();
    
    // Set date range based on period
    switch (period) {
      case 'daily':
        startDate = startOfDay(start ? parseISO(start) : now);
        endDate = endOfDay(start ? parseISO(start) : now);
        break;
      case 'weekly':
        startDate = startOfWeek(start ? parseISO(start) : now, { weekStartsOn: 1 }); // Monday
        endDate = endOfWeek(start ? parseISO(parseISO(start).setDate(parseISO(start).getDate() + 6)) : now, { weekStartsOn: 1 });
        break;
      case 'monthly':
        startDate = startOfMonth(start ? parseISO(start) : now);
        endDate = endOfMonth(start ? parseISO(start) : now);
        break;
      case 'custom':
        if (!start || !end) {
          return res.status(400).json({ success: false, message: 'Start and end dates are required for custom range' });
        }
        startDate = startOfDay(parseISO(start));
        endDate = endOfDay(parseISO(end));
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid period. Use daily, weekly, monthly, or custom' });
    }

    // Get all paid orders in the date range
    const orders = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $lookup: {
          from: 'payments',
          localField: 'id',
          foreignField: 'orderId',
          as: 'payment'
        }
      },
      { $unwind: '$payment' },
      {
        $match: {
          'payment.status': 'paid'
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === 'daily' ? '%Y-%m-%d' : 
                     period === 'weekly' ? '%Y-%W' :
                     '%Y-%m',
              date: '$createdAt'
            }
          },
          date: { $first: '$createdAt' },
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          orders: { $push: '$$ROOT' }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Get top selling items
    const topSellingItems = await Order.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuId',
          name: { $first: '$items.name' },
          quantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } }
        }
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 }
    ]);

    // Calculate summary
    const summary = {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      startDate,
      endDate,
      period
    };

    orders.forEach(periodData => {
      summary.totalRevenue += periodData.totalRevenue;
      summary.totalOrders += periodData.orderCount;
    });

    summary.averageOrderValue = summary.totalOrders > 0 
      ? Math.round(summary.totalRevenue / summary.totalOrders)
      : 0;

    // Format response
    const formattedData = orders.map(periodData => ({
      period: periodData._id,
      date: periodData.date,
      revenue: periodData.totalRevenue,
      orderCount: periodData.orderCount,
      averageOrderValue: Math.round(periodData.totalRevenue / periodData.orderCount) || 0
    }));

    res.json({
      success: true,
      data: {
        summary,
        periods: formattedData,
        topSellingItems
      }
    });
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ success: false, message: 'Error generating sales report', error: error.message });
  }
};

module.exports = {
  getSalesReport
};
