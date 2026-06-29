import Vehicle from "../models/Vehicle.js";


// create vehicles
export const createVehicle = async (req, res) => {
  try{
    const vehicleData = req.body;

    if(!vehicleData.pricePerWeek && vehicleData.pricePerDay) {
      vehicleData.pricePerWeek = vehicleData.pricePerDay * 5;
    }

    if(req.file) {
      vehicleData.image = req.file.filename;
    }

    const vehicle = await Vehicle.create(vehicleData);
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle
    });
  } catch(error) {
    res.status(500).json({message: error.message});
  }
};

//get all vehicle
export const getAllVehicles = async(req, res) => {
  try{
    const {
      type,
      brand, 
      status,
      minPrice,
      maxPrice,
      search, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;
    //filter
    const filter = {};

    if(type) filter.type = type;
    if(brand) filter.brand = {$regex: brand, $options: 'i'};
    if(status) filter.status = status;

    //price range filter
    if(minPrice || maxPrice) {
      filter.pricePerDay = {};
      if(minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if(maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    //search
    if(search) {
      filter.$or = [
        {name: { $regex: search, $options: 'i'}},
        {brand: {$regex: search, $options: 'i'}},
        { model: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    //sort
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1};

    //get vehicles
    const vehicles = await Vehicle.find(filter) 
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

    //get total count
    const total = await Vehicle.countDocuments(filter);

    res.json({
      success: true,
      count: vehicles.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: vehicles
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
}
};

//get single vehicles
export const getVehicleById = async(req, res) => {
  try{
    const vehicle = await Vehicle.findById(req.params.id);

    if(!vehicle) {
      return res.status(404).json( {
        success: false,
        message: 'Vehicle not found'
      });
    }
    res.json({
      success: true,
      data: vehicle
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
  });
}
};

// Update vehicles
export const updateVehicle = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Auto-calculate pricePerWeek if pricePerDay is updated
    if (updateData.pricePerDay && !updateData.pricePerWeek) {
      updateData.pricePerWeek = updateData.pricePerDay * 5;
    }
    
    // If new image uploaded, update image
    if (req.file) {
      updateData.image = req.file.filename;
    }
    
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Vehicle updated successfully!',
      data: vehicle
    });
    
  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// delete vehicle
export const deleteVehicle = async (req, res) => {
  try{
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if(!vehicle) {
      return res.status(404).json({message: 'Vehicle not found'});
    }
    res.json({
      success: true,
      message: "Vehicle deleted successfully!"
    });

  } catch(error) {
    res.status(500).json({message: error.message});
  }
};


//get vehicle statistics
export const getVehicleStats = async (req, res) => {
  try {
    const total = await Vehicle.countDocuments();
    const available = await Vehicle.countDocuments({ status: 'available' });
    const rented = await Vehicle.countDocuments({ status: 'rented' });
    const maintenance = await Vehicle.countDocuments({ status: 'maintenance' });
    const unavailable = await Vehicle.countDocuments({ status: 'unavailable' });
    
    // Group by type
    const typeStats = await Vehicle.aggregate([
      { $group: { 
        _id: '$type', 
        count: { $sum: 1 },
        avgPrice: { $avg: '$pricePerDay' }
      } }
    ]);
    
    // Average rating
    const avgRating = await Vehicle.aggregate([
      { $group: { 
        _id: null, 
        avgRating: { $avg: '$rating' } 
      } }
    ]);
    
    res.json({
      success: true,
      data: {
        total,
        available,
        rented,
        maintenance,
        unavailable,
        byType: typeStats,
        averageRating: avgRating[0]?.avgRating || 0
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//add review by customers
export const addReview = async(req, res) => {
  try{
    const {rating, comment} = req.body;
    const vehicleId = req.params.id;
    const userId = req.user._id;
    const userName = req.user.name;

    if(!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    //check if user already reviewed
    const existingReview = vehicle.reviews.find( 
      review => review.userId.toString() === userId.toString()
    );
    if(existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You already reviewed this vehicle'
      });
    }

    //sdd review
    vehicle.reviews.push({
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date()
    });
    //update rating
    await vehicle.updateRating(rating);

    res.json({
      success: true,
      message: "Review added successfully",
      data: {
        rating: vehicle.rating,
        totalReviews: vehicle.reviews.length,
        reviews: vehicle.reviews
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

//get vehicle review
export const getVehicleReviews = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).select('Name rating reviews');

    if(!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    //sort reviews by newest first
    const reviews = vehicle.reviews.sort((a,b) => {
      new Date(b.createdAt) - new Date(a.createdAt)
    });
    res.json({
      success: true,
      message: "Review added successfully!",
      data: {
        rating: vehicle.rating,
        totalReviews: vehicle.reviews.length,
        reviews: vehicle.reviews
      }
    });

  } catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
//delete review by user
export const deleteReview = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const userId = req.user._id;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Find and remove review
    const reviewIndex = vehicle.reviews.findIndex(
      review => review.userId.toString() === userId.toString()
    );

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    vehicle.reviews.splice(reviewIndex, 1);

    // Recalculate rating
    if (vehicle.reviews.length === 0) {
      vehicle.rating = 0;
    } else {
      const totalRating = vehicle.reviews.reduce((sum, r) => sum + r.rating, 0);
      vehicle.rating = Math.round((totalRating / vehicle.reviews.length) * 10) / 10;
    }

    await vehicle.save();

    res.json({
      success: true,
      message: 'Review deleted successfully 🗑️',
      data: {
        rating: vehicle.rating,
        totalReviews: vehicle.reviews.length
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
