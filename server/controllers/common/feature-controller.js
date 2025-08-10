const Feature = require("../../models/Feature");
const Order =  require("../../models/Order")

function getStartDate(days) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (days - 1));
  return d;
}

function fillMissingDates(rows, days) {
  const map = new Map(rows.map(r => [r._id, r]));
  const result = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(today.getDate() - i);
    const key = dt.toISOString().slice(0, 10);
    const row = map.get(key) || { _id: key, orders: 0, revenue: 0 };
    result.push(row);
  }
  return result;
}

const getAdminStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const start = getStartDate(days);
    const match = { orderDate: { $gte: start } };

    const byDate = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const byStatus = await Order.aggregate([
      { $match: match },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
    ]);

    const byPayment = await Order.aggregate([
      { $match: match },
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } }
    ]);

    const topProducts = await Order.aggregate([
      { $match: match },
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems.productId",
          title: { $first: "$cartItems.title" },
          qtySold: { $sum: "$cartItems.quantity" },
          revenue: {
            $sum: {
              $multiply: [
                { $convert: { input: "$cartItems.price", to: "double", onError: 0, onNull: 0 } },
                "$cartItems.quantity"
              ]
            }
          }
        }
      },
      { $sort: { qtySold: -1 } },
      { $limit: 10 }
    ]);

    const aggTotals = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" },
          orders: { $sum: 1 }
        }
      }
    ]);

    const filledByDate = fillMissingDates(byDate, days);

    res.json({
      days,
      ordersByDate: filledByDate,
      byStatus,
      byPayment,
      topProducts,
      totals: aggTotals[0] || { totalRevenue: 0, avgOrderValue: 0, orders: 0 }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    console.log(image, "image ");

    const featureImages = new Feature({
      image,
    });

    await featureImages.save();

    res.status(201).json({
      success: true,
      data: featureImages,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const deleteFeatureImages = async (req, res) => {
  try {
    const {id} = req.params;

    const deleted = await Feature.findByIdAndDelete(id);

    if(!deleted){
      return res.status(404).json({
        success : false,
        message : "Feature image not found"
      });
    }

    res.status(200).json({
      success: true,
      message : "Feature image successfully deleted !"
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = 
          { 
            addFeatureImage,
            getFeatureImages, 
            deleteFeatureImages, 
            getAdminStats,
            
          };