const Province = require('../models/ProvincesModel.js');

const getProvincesByRegion = async (req, res) => {
  try {
    const provinces = await Province.find({ deletedAt: null }).lean();

    const groupedProvinces = {
      'Miền Bắc': [],
      'Miền Trung': [],
      'Miền Nam': [],
      'Miền Khác': [] 
    };

    const validRegions = new Set(['Miền Bắc', 'Miền Trung', 'Miền Nam']); // Các miền hợp lệ

    provinces.forEach(province => {
      const regionName = province.region ? String(province.region) : 'Miền Khác'; // Chuyển về String và gán mặc định nếu null/undefined

      const provinceData = {
        _id: province._id,
        description: province.description,
        images: province.images,
      };

      if (validRegions.has(regionName)) {
        groupedProvinces[regionName].push(provinceData);
      } else {
        groupedProvinces['Miền Khác'].push(provinceData);
      }
    });

    const result = Object.keys(groupedProvinces)
      .filter(regionName => groupedProvinces[regionName].length > 0) 
      .map(regionName => ({
        region: regionName,
        provinces: groupedProvinces[regionName]
      }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting provinces by region:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  getProvincesByRegion
}