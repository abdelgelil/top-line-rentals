import Apartment from '../models/Apartment.js';

export const getApartments = async (req, res) => {
  try {
    console.log("📥 Incoming GET request to /api/apartments with query:", req.query);
    const { towerId, guests, checkIn, checkOut } = req.query;

    const apartments = await Apartment.findAll({
      towerId,
      guests,
      checkIn,
      checkOut
    });

    res.status(200).json({
      success: true,
      data: apartments
    });
  } catch (error) {
    console.error(`[ApartmentController.getApartments Error]: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getApartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const apartment = await Apartment.findByIdWithDetails(id);

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: 'Apartment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: apartment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};