import Tower from '../models/tower.js';

export const getTowers = async (req, res) => {
  try {
    const towers = await Tower.findAll();

    res.status(200).json({
      success: true,
      data: towers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTowerById = async (req, res) => {
  try {
    const { id } = req.params;

    const tower = await Tower.findByIdWithDetails(id);

    if (!tower) {
      return res.status(404).json({
        success: false,
        message: 'Tower not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tower
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};