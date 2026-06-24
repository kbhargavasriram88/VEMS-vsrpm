const News = require('../models/News');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const AdmissionInquiry = require('../models/AdmissionInquiry');
const Faculty = require('../models/Faculty');
const ContactMessage = require('../models/ContactMessage');

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getDashboardStats = async (req, res) => {
  try {
    // ── 1. Basic Counts ────────────────────────────────────────────────────────
    const [newsCount, eventsCount, galleryCount, admissionsCount, facultyCount, messagesCount, studentsCount] = await Promise.all([
      News.countDocuments(),
      Event.countDocuments(),
      Gallery.countDocuments(),
      AdmissionInquiry.countDocuments(),
      Faculty.countDocuments(),
      ContactMessage.countDocuments(),
      AdmissionInquiry.countDocuments({ status: "Approved" })
    ]);

    // ── 2. This Month Increments ───────────────────────────────────────────────
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [newsThisMonth, eventsThisMonth, galleryThisMonth, admissionsThisMonth, facultyThisMonth, messagesThisMonth, studentsThisMonth] = await Promise.all([
      News.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Event.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Gallery.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      AdmissionInquiry.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Faculty.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      ContactMessage.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      AdmissionInquiry.countDocuments({ status: "Approved", createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    // ── 3. Recent 5 Admissions ─────────────────────────────────────────────────
    const recentAdmissions = await AdmissionInquiry.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // ── 4. Monthly Trend (Line Chart) ─────────────────────────────────────────
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const monthNum = d.getMonth();
      const startOfMonth = new Date(year, monthNum, 1);
      const endOfMonth = new Date(year, monthNum + 1, 0, 23, 59, 59, 999);
      const count = await AdmissionInquiry.countDocuments({ createdAt: { $gte: startOfMonth, $lte: endOfMonth } });
      monthlyTrend.push({ month: months[monthNum], count });
    }

    // ── 5. Grade Distribution (Bar Chart) ─────────────────────────────────────
    const gradeCounts = await AdmissionInquiry.aggregate([
      { $group: { _id: "$gradeApplyingFor", count: { $sum: 1 } } }
    ]);
    const standardGrades = ["1st Class","2nd Class","3rd Class","4th Class","5th Class","6th Class","7th Class","8th Class","9th Class","10th Class"];
    const gradeDistribution = standardGrades.map(grade => {
      const match = gradeCounts.find(g => g._id === grade);
      return { grade, count: match ? match.count : 0 };
    });

    // ── 6. Admission Status Distribution (Donut/Pie Chart) ────────────────────
    const statusCounts = await AdmissionInquiry.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const allStatuses = ["New", "Under Review", "Approved", "Rejected"];
    const statusDistribution = allStatuses.map(status => {
      const match = statusCounts.find(s => s._id === status);
      return { status, count: match ? match.count : 0 };
    });

    // ── 7. Content Overview by Month (Grouped Bar Chart) ──────────────────────
    const contentOverview = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const monthNum = d.getMonth();
      const startOfMonth = new Date(year, monthNum, 1);
      const endOfMonth = new Date(year, monthNum + 1, 0, 23, 59, 59, 999);
      const range = { createdAt: { $gte: startOfMonth, $lte: endOfMonth } };

      const [nCount, eCount, gCount] = await Promise.all([
        News.countDocuments(range),
        Event.countDocuments(range),
        Gallery.countDocuments(range),
      ]);

      contentOverview.push({ month: months[monthNum], news: nCount, events: eCount, gallery: gCount });
    }

    res.json({
      counts: {
        news: newsCount || 0,
        newsThisMonth: newsThisMonth || 0,
        events: eventsCount || 0,
        eventsThisMonth: eventsThisMonth || 0,
        gallery: galleryCount || 0,
        galleryThisMonth: galleryThisMonth || 0,
        admissions: admissionsCount || 0,
        admissionsThisMonth: admissionsThisMonth || 0,
        faculty: facultyCount || 0,
        facultyThisMonth: facultyThisMonth || 0,
        messages: messagesCount || 0,
        messagesThisMonth: messagesThisMonth || 0,
        students: studentsCount || 0,
        studentsThisMonth: studentsThisMonth || 0
      },
      recentAdmissions: recentAdmissions.map(item => ({
        _id: item._id,
        studentName: item.studentName,
        gradeApplyingFor: item.gradeApplyingFor,
        parentName: item.parentName,
        createdAt: item.createdAt,
        status: item.status
      })),
      monthlyTrend: monthlyTrend,
      gradeDistribution: gradeDistribution,
      statusDistribution: statusDistribution,
      contentOverview: contentOverview,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error loading dashboard stats', error: error.message });
  }
};

module.exports = { getDashboardStats };
